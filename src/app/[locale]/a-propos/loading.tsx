import { Skeleton } from "@/components/ui/skeleton";

export default function AProposLoading() {
  return (
    <div>
      <div className="bg-primrose-cream px-4 py-16 text-center md:px-6">
        <Skeleton className="mx-auto h-9 w-64" />
      </div>
      <section className="mx-auto max-w-3xl px-4 py-16 md:px-6">
        <Skeleton className="h-7 w-48" />
        <Skeleton className="mt-3 h-5 w-full" />
        <Skeleton className="mt-2 h-5 w-5/6" />
      </section>
    </div>
  );
}
