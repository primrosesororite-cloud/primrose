import { createClient } from "@/lib/supabase/server";
import { ParametresForm } from "@/components/admin/parametres/parametres-form";
import { NumerosUrgenceEditor } from "@/components/admin/parametres/numeros-urgence-editor";

type NumeroUrgence = { label: string; numero: string };

function isNumeroUrgence(value: unknown): value is NumeroUrgence {
  return typeof value === "object" && value !== null && "label" in value && "numero" in value;
}

export default async function AdminParametresPage() {
  const supabase = await createClient();
  const { data: parametres } = await supabase
    .from("parametres_site")
    .select("*")
    .eq("id", 1)
    .single();

  const numeros = (parametres?.numeros_urgence ?? []).filter(isNumeroUrgence);

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-serif text-2xl text-primrose-green-dark">
          Paramètres du site
        </h1>
        <p className="mt-1 text-sm text-primrose-ink/70">
          Coordonnées générales et numéros d&apos;urgence affichés sur le site public.
        </p>
      </div>

      <section>
        <h2 className="font-serif text-lg text-primrose-green-dark">
          Coordonnées générales
        </h2>
        <div className="mt-3 max-w-xl rounded-card bg-primrose-white p-6 shadow-card">
          <ParametresForm
            defaultValues={{
              nom: parametres?.nom ?? "",
              slogan: parametres?.slogan ?? "",
              email: parametres?.email ?? "",
              telephone: parametres?.telephone ?? "",
              adresse: parametres?.adresse ?? "",
            }}
          />
        </div>
      </section>

      <section>
        <h2 className="font-serif text-lg text-primrose-green-dark">
          Numéros d&apos;urgence
        </h2>
        <div className="mt-3 max-w-xl rounded-card bg-primrose-white p-6 shadow-card">
          <NumerosUrgenceEditor initial={numeros} />
        </div>
      </section>
    </div>
  );
}
