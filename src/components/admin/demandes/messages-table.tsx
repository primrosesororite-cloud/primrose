"use client";

import { useState } from "react";
import { Eye } from "lucide-react";
import { AdminDataTable } from "@/components/admin/data-table";
import { createAdminColumnHelper } from "@/components/admin/table-features";
import { ReplyButton } from "@/components/admin/reply-button";
import { ToggleSwitch } from "@/components/admin/toggle-switch";
import { Modal } from "@/components/admin/modal";
import { markMessageLu } from "@/actions/admin/demandes";
import type { Database } from "@/types/database";

type MessageContact = Database["public"]["Tables"]["messages_contact"]["Row"];

const helper = createAdminColumnHelper<MessageContact>();

function DetailButton({ message }: { message: MessageContact }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Voir le message"
        className="flex h-8 w-8 items-center justify-center rounded-full text-primrose-ink/60 hover:bg-primrose-cream hover:text-primrose-ink"
      >
        <Eye className="h-4 w-4" aria-hidden />
      </button>
      <Modal open={open} onOpenChange={setOpen} title={message.sujet || message.nom}>
        <dl className="space-y-2 text-sm">
          <div>
            <dt className="text-xs text-primrose-ink/70">De</dt>
            <dd>
              {message.nom} · {message.email}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-primrose-ink/70">Message</dt>
            <dd className="whitespace-pre-wrap">{message.message}</dd>
          </div>
        </dl>
      </Modal>
    </>
  );
}

export function MessagesTable({ messages }: { messages: MessageContact[] }) {
  const columns = [
    helper.accessor("nom", { header: "Nom" }),
    helper.accessor("sujet", { header: "Sujet" }),
    helper.accessor("email", { header: "E-mail" }),
    helper.accessor((row) => new Date(row.created_at).toLocaleDateString("fr-FR"), {
      id: "date",
      header: "Reçu le",
    }),
    helper.display({
      id: "lu",
      header: "Lu",
      cell: ({ row }) => (
        <ToggleSwitch
          checked={row.original.lu}
          onToggle={(next) => markMessageLu(row.original.id, next)}
          labelOn="Lu"
          labelOff="Non lu"
        />
      ),
    }),
    helper.display({
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <DetailButton message={row.original} />
          <ReplyButton
            to={row.original.email}
            defaultSubject={`Re : ${row.original.sujet || "votre message"}`}
          />
        </div>
      ),
    }),
  ];

  return (
    <AdminDataTable
      data={messages}
      columns={columns}
      searchPlaceholder="Rechercher un message…"
      emptyMessage="Aucun message de contact."
    />
  );
}
