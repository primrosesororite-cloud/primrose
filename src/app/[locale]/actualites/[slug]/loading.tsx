import { Skeleton } from "@/components/ui/skeleton";

export default function ActualiteDetailLoading() {
  return (
    <article className="mx-auto max-w-2xl px-4 py-16 md:px-6">
      <Skeleton className="h-4 w-32" />
      <Skeleton className="mt-4 h-4 w-40" />
      <Skeleton className="mt-2 h-9 w-full" />
      <Skeleton className="mt-6 h-64 w-full rounded-card" />
      <Skeleton className="mt-6 h-5 w-full" />
      <Skeleton className="mt-2 h-5 w-5/6" />
    </article>
  );
}
