import { Skeleton } from "@/components/ui/skeleton";

export function AdminTableSkeleton() {
  return (
    <div>
      <Skeleton className="h-9 w-56" />
      <Skeleton className="mt-2 h-4 w-full max-w-md" />
      <div className="mt-6 flex justify-end">
        <Skeleton className="h-10 w-40 rounded-full" />
      </div>
      <Skeleton className="mt-4 h-10 w-64" />
      <div className="mt-4 space-y-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    </div>
  );
}
