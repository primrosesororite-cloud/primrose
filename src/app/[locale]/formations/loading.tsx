import { Skeleton } from "@/components/ui/skeleton";

export default function FormationsLoading() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-16 md:px-6">
      <Skeleton className="h-9 w-64" />
      <Skeleton className="mt-3 h-5 w-full max-w-xl" />
      <div className="mt-8 flex gap-3">
        <Skeleton className="h-10 w-40 rounded-full" />
        <Skeleton className="h-10 w-40 rounded-full" />
      </div>
      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-card bg-primrose-white p-6 shadow-card">
            <Skeleton className="h-5 w-24 rounded-full" />
            <Skeleton className="mt-3 h-6 w-3/4" />
            <Skeleton className="mt-2 h-4 w-full" />
            <Skeleton className="mt-1 h-4 w-2/3" />
          </div>
        ))}
      </div>
    </section>
  );
}
