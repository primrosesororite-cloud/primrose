import { requireAdmin } from "@/lib/admin/current-admin";
import { createClient } from "@/lib/supabase/server";
import { MessagesTable } from "@/components/admin/demandes/messages-table";

export default async function AdminMessagesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  await requireAdmin(locale);

  const supabase = await createClient();
  const { data: messages } = await supabase
    .from("messages_contact")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="font-serif text-2xl text-primrose-green-dark">
        Messages de contact
      </h1>
      <p className="mt-1 text-sm text-primrose-ink/70">
        Messages reçus depuis le formulaire /contact.
      </p>
      <div className="mt-6">
        <MessagesTable messages={messages ?? []} />
      </div>
    </div>
  );
}
