import { createClient } from "@/lib/supabase/server";
import { DocumentsTable } from "@/components/admin/documents/documents-table";

export default async function AdminDocumentsPage() {
  const supabase = await createClient();
  const { data: documents } = await supabase
    .from("documents")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="font-serif text-2xl text-primrose-green-dark">Documents</h1>
      <p className="mt-1 text-sm text-primrose-ink/70">
        Rapports, guides et textes en PDF que les lecteurs peuvent consulter directement sur le
        site ou télécharger. Seuls les documents publiés sont visibles.
      </p>
      <div className="mt-6">
        <DocumentsTable documents={documents ?? []} />
      </div>
    </div>
  );
}
