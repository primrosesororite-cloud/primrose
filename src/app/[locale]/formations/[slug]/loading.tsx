import { Skeleton } from "@/components/ui/skeleton";

export default function FormationDetailLoading() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-16 md:px-6">
      <Skeleton className="h-4 w-32" />
      <Skeleton className="mt-4 h-6 w-28 rounded-full" />
      <Skeleton className="mt-3 h-9 w-3/4" />
      <Skeleton className="mt-3 h-5 w-full" />
      <Skeleton className="mt-1 h-5 w-2/3" />
      <div className="mt-10 rounded-card bg-primrose-white p-6 shadow-card">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="mt-4 h-10 w-full" />
        <Skeleton className="mt-3 h-10 w-full" />
        <Skeleton className="mt-3 h-24 w-full" />
      </div>
    </section>
  );
}
