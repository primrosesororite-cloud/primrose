"use client";

import { useState } from "react";
import { GripVertical } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

/**
 * Liste réordonnable par glisser-déposer (API HTML5 native — pas de
 * dépendance supplémentaire). Optimiste : l'ordre local change immédiatement,
 * puis `onReorder` persiste ; en cas d'échec, l'ordre serveur est restauré.
 */
export function SortableList<T>({
  items,
  getId,
  onReorder,
  renderItem,
}: {
  items: T[];
  getId: (item: T) => string;
  onReorder: (orderedIds: string[]) => Promise<{ error?: string } | void>;
  renderItem: (item: T) => React.ReactNode;
}) {
  const [ordered, setOrdered] = useState(items);
  const [prevItems, setPrevItems] = useState(items);
  const [draggedId, setDraggedId] = useState<string | null>(null);

  // Resynchronise l'état local quand `items` change côté serveur (ex. après
  // un échec de réordonnancement) — ajustement pendant le rendu plutôt qu'un
  // Effect, pour éviter un rendu en cascade (voir react-hooks/set-state-in-effect).
  if (items !== prevItems) {
    setPrevItems(items);
    setOrdered(items);
  }

  function handleDrop(targetId: string) {
    if (!draggedId || draggedId === targetId) return;

    const fromIndex = ordered.findIndex((i) => getId(i) === draggedId);
    const toIndex = ordered.findIndex((i) => getId(i) === targetId);
    if (fromIndex === -1 || toIndex === -1) return;

    const next = [...ordered];
    const [moved] = next.splice(fromIndex, 1);
    next.splice(toIndex, 0, moved);
    setOrdered(next);
    setDraggedId(null);

    onReorder(next.map(getId)).then((result) => {
      if (result?.error) {
        toast.error(result.error);
        setOrdered(items);
      }
    });
  }

  return (
    <ul className="space-y-2">
      {ordered.map((item) => {
        const id = getId(item);
        return (
          <li
            key={id}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => handleDrop(id)}
            className={cn(
              "flex items-center gap-2 rounded-lg bg-primrose-white p-3 shadow-sm ring-1 ring-primrose-ink/5",
              draggedId === id && "opacity-50"
            )}
          >
            <span
              draggable
              onDragStart={() => setDraggedId(id)}
              onDragEnd={() => setDraggedId(null)}
              className="shrink-0 cursor-grab text-primrose-ink/30 active:cursor-grabbing"
            >
              <GripVertical aria-hidden className="h-4 w-4" />
            </span>
            <div className="min-w-0 flex-1">{renderItem(item)}</div>
          </li>
        );
      })}
    </ul>
  );
}
