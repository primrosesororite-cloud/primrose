import { createClient } from "@/lib/supabase/server";
import { VisionForm } from "@/components/admin/contenus/vision-form";
import { ChiffresTable } from "@/components/admin/contenus/chiffres-table";
import type { VisionInput } from "@/lib/validations/admin/contenus";

export default async function AdminContenusPage() {
  const supabase = await createClient();

  const [{ data: visionRow }, { data: chiffres }] = await Promise.all([
    supabase.from("pages_content").select("content").eq("key", "home.vision").single(),
    supabase.from("chiffres_cles").select("*").order("ordre", { ascending: true }),
  ]);

  const visionContent = (visionRow?.content ?? { titre: "", texte: "" }) as VisionInput;

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-serif text-2xl text-primrose-green-dark">
          Contenus du site
        </h1>
        <p className="mt-1 text-sm text-primrose-ink/70">
          Vision de l&apos;accueil et chiffres clés affichés sur le site public.
        </p>
      </div>

      <section>
        <h2 className="font-serif text-lg text-primrose-green-dark">Vision (accueil)</h2>
        <div className="mt-3 max-w-xl rounded-card bg-primrose-white p-6 shadow-card">
          <VisionForm defaultValues={visionContent} />
        </div>
      </section>

      <section>
        <h2 className="font-serif text-lg text-primrose-green-dark">Chiffres clés</h2>
        <div className="mt-3">
          <ChiffresTable chiffres={chiffres ?? []} />
        </div>
      </section>
    </div>
  );
}
