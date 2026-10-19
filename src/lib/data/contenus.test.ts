import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

type Result = { data: unknown; error: unknown };
const tables: Record<string, Result> = {};

/** Constructeur de requête factice : chaque méthode renvoie le même objet, attendable. */
function fakeBuilder(result: Result) {
  const builder: Record<string, unknown> = {};
  for (const method of ["select", "eq", "order", "single"]) builder[method] = () => builder;
  builder.then = (resolve: (value: Result) => unknown) => resolve(result);
  return builder;
}

vi.mock("@/lib/supabase/public", () => ({
  createPublicClient: () => ({
    from: (table: string) => fakeBuilder(tables[table] ?? { data: null, error: { message: "absent" } }),
  }),
}));

const messages: Record<string, Record<string, unknown>> = {
  missions: Object.fromEntries(
    ["prevenir", "soutenir", "plaider", "former"].map((k) => [
      k,
      {
        titre: `MSG-${k}`,
        description: `desc-${k}`,
        detail: `detail-${k}`,
        valeurs: [`val-${k}`],
        actions: [`act-${k}`],
      },
    ])
  ),
  "home.vision": { titre: "titre-msg", texte: "texte-msg", valeurs: ["v-msg"] },
};

vi.mock("next-intl/server", () => ({
  getTranslations: async ({ namespace }: { namespace: string }) => {
    const lire = (chemin: string) =>
      chemin.split(".").reduce<unknown>((acc, cle) => (acc as Record<string, unknown>)[cle], messages[namespace]);
    const t = (chemin: string) => lire(chemin) as string;
    t.raw = (chemin: string) => lire(chemin);
    return t;
  },
}));

async function charger() {
  vi.resetModules();
  return import("./contenus");
}

beforeEach(() => {
  vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://exemple.supabase.co");
  vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "cle");
});

afterEach(() => {
  vi.unstubAllEnvs();
  for (const cle of Object.keys(tables)) delete tables[cle];
});

describe("getMissions", () => {
  it("utilise la base (ordre, titre, actions, valeurs) et masque les axes inactifs", async () => {
    tables.missions = {
      error: null,
      data: [
        { id: "m2", slug: "soutenir", titre: "AIDER", description: "d2", detail: "dd2", actions: ["a1", "a2"], ordre: 1 },
        { id: "m1", slug: "prevenir", titre: "PREVENIR", description: "d1", detail: null, actions: [], ordre: 2 },
      ],
    };
    tables.valeurs = { error: null, data: [{ mission_id: "m2", libelle: "Confiance" }] };

    const { getMissions } = await charger();
    const resultat = await getMissions("fr");

    expect(resultat.map((m) => m.key)).toEqual(["soutenir", "prevenir"]);
    expect(resultat[0]).toMatchObject({ titre: "AIDER", detail: "dd2", actions: ["a1", "a2"], valeurs: ["Confiance"] });
    // detail vide en base : retombe sur le texte d'origine ; liste d'actions vide acceptée telle quelle
    expect(resultat[1]).toMatchObject({ detail: "detail-prevenir", actions: [], valeurs: [] });
  });

  it("garde les textes d'origine tant que la migration n'est pas appliquée (colonne actions absente)", async () => {
    tables.missions = {
      error: null,
      data: [{ id: "m1", slug: "plaider", titre: "PLAIDER", description: "d", ordre: 1 }],
    };
    tables.valeurs = { error: null, data: [] };

    const { getMissions } = await charger();
    const [mission] = await getMissions("fr");

    expect(mission).toMatchObject({ actions: ["act-plaider"], valeurs: ["val-plaider"], detail: "detail-plaider" });
  });

  it("retombe sur les fichiers de traduction si la base échoue ou est vide", async () => {
    tables.missions = { data: null, error: { message: "panne" } };
    const { getMissions } = await charger();
    expect((await getMissions("fr")).map((m) => m.titre)).toEqual([
      "MSG-prevenir",
      "MSG-soutenir",
      "MSG-plaider",
      "MSG-former",
    ]);

    tables.missions = { data: [], error: null };
    expect(await (await charger()).getMissions("fr")).toHaveLength(4);
  });

  it("ignore la base dans une autre langue que le français", async () => {
    tables.missions = { error: null, data: [{ id: "m1", slug: "prevenir", titre: "X", description: "x", ordre: 1 }] };
    const { getMissions } = await charger();
    expect((await getMissions("en"))[0].titre).toBe("MSG-prevenir");
  });
});

describe("getVision", () => {
  it("fusionne la base avec les textes d'origine champ par champ", async () => {
    tables.pages_content = { error: null, data: { content: { titre: "Titre admin", texte: "  ", valeurs: ["A", "B"] } } };
    const { getVision } = await charger();
    expect(await getVision("fr")).toEqual({ titre: "Titre admin", texte: "texte-msg", valeurs: ["A", "B"] });
  });

  it("accepte une liste de valeurs vide (l'équipe a tout retiré)", async () => {
    tables.pages_content = { error: null, data: { content: { titre: "T", texte: "X", valeurs: [] } } };
    const { getVision } = await charger();
    expect((await getVision("fr")).valeurs).toEqual([]);
  });

  it("garde les valeurs d'origine si le contenu n'en a pas encore (avant migration)", async () => {
    tables.pages_content = { error: null, data: { content: { titre: "T", texte: "X" } } };
    const { getVision } = await charger();
    expect((await getVision("fr")).valeurs).toEqual(["v-msg"]);
  });
});

describe("getChiffresCles", () => {
  it("n'expose que les chiffres non nuls", async () => {
    tables.chiffres_cles = {
      error: null,
      data: [
        { id: "1", libelle: "Ateliers", valeur: 0, suffixe: "", ordre: 1, actif: true },
        { id: "2", libelle: "Personnes", valeur: 1200, suffixe: "+", ordre: 2, actif: true },
      ],
    };
    const { getChiffresCles } = await charger();
    expect((await getChiffresCles()).map((c) => c.libelle)).toEqual(["Personnes"]);
  });
});
