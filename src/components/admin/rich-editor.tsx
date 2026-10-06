"use client";

import { useEditor, EditorContent, type JSONContent } from "@tiptap/react";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  List,
  ListOrdered,
  Heading2,
  Link as LinkIcon,
  Quote,
} from "lucide-react";
import { tiptapExtensions } from "@/lib/tiptap-extensions";
import { cn } from "@/lib/utils";

function ToolbarButton({
  active,
  onClick,
  label,
  children,
}: {
  active?: boolean;
  onClick: () => void;
  label: string;
  children: React.ReactNode;
}) {
  return (
  <button
  type="button"
  onClick={onClick}
  aria-label={label}
  aria-pressed={active}
  className={cn(
"flex h-8 w-8 items-center justify-center rounded-md text-primrose-ink/70 hover:bg-primrose-cream",
  active && "bg-primrose-green/15 text-primrose-green-dark"
  )}
  >
  {children}
  </button>
  );
}

export function RichEditor({
  content,
  onChange,
}: {
  content: JSONContent | null;
  onChange: (content: JSONContent) => void;
}) {
  const editor = useEditor({
  extensions: tiptapExtensions,
  content: content ?? "",
  immediatelyRender: false,
  onUpdate: ({ editor }) => onChange(editor.getJSON()),
  editorProps: {
  attributes: {
  class:
"prose-sm min-h-[200px] max-w-none rounded-b-lg border border-t-0 border-primrose-ink/15 bg-primrose-white px-3 py-2 text-sm focus:outline-none [&_h2]:font-serif [&_h2]:text-lg [&_h2]:text-primrose-green-dark [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_a]:text-primrose-green-dark [&_a]:underline [&_blockquote]:border-l-2 [&_blockquote]:border-primrose-green [&_blockquote]:pl-3 [&_blockquote]:italic",
  },
  },
  });

  if (!editor) return null;

  function setLink() {
  const url = window.prompt("URL du lien :");
  if (url === null) return;
  if (url === "") {
  editor!.chain().focus().unsetLink().run();
  return;
  }
  editor!.chain().focus().setLink({ href: url }).run();
  }

  return (
  <div>
  <div className="flex flex-wrap items-center gap-1 rounded-t-lg border border-primrose-ink/15 bg-primrose-cream/50 p-1">
  <ToolbarButton
  label="Gras"
  active={editor.isActive("bold")}
  onClick={() => editor.chain().focus().toggleBold().run()}
  >
  <Bold className="h-4 w-4" aria-hidden />
  </ToolbarButton>
  <ToolbarButton
  label="Italique"
  active={editor.isActive("italic")}
  onClick={() => editor.chain().focus().toggleItalic().run()}
  >
  <Italic className="h-4 w-4" aria-hidden />
  </ToolbarButton>
  <ToolbarButton
  label="Souligné"
  active={editor.isActive("underline")}
  onClick={() => editor.chain().focus().toggleUnderline().run()}
  >
  <UnderlineIcon className="h-4 w-4" aria-hidden />
  </ToolbarButton>
  <ToolbarButton
  label="Titre"
  active={editor.isActive("heading", { level: 2 })}
  onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
  >
  <Heading2 className="h-4 w-4" aria-hidden />
  </ToolbarButton>
  <ToolbarButton
  label="Liste à puces"
  active={editor.isActive("bulletList")}
  onClick={() => editor.chain().focus().toggleBulletList().run()}
  >
  <List className="h-4 w-4" aria-hidden />
  </ToolbarButton>
  <ToolbarButton
  label="Liste numérotée"
  active={editor.isActive("orderedList")}
  onClick={() => editor.chain().focus().toggleOrderedList().run()}
  >
  <ListOrdered className="h-4 w-4" aria-hidden />
  </ToolbarButton>
  <ToolbarButton
  label="Citation"
  active={editor.isActive("blockquote")}
  onClick={() => editor.chain().focus().toggleBlockquote().run()}
  >
  <Quote className="h-4 w-4" aria-hidden />
  </ToolbarButton>
  <ToolbarButton label="Lien" active={editor.isActive("link")} onClick={setLink}>
  <LinkIcon className="h-4 w-4" aria-hidden />
  </ToolbarButton>
  </div>
  <EditorContent editor={editor} />
  </div>
  );
}
