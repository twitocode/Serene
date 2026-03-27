import { Skeleton } from "@/lib/components/ui/skeleton";

export function TrendsSkeleton() {
  return (
    <div className="space-y-4 px-1">
      <Skeleton className="h-44 w-full rounded-2xl" />
      <Skeleton className="h-52 w-full rounded-2xl" />
      <Skeleton className="h-36 w-full rounded-2xl" />
    </div>
  );
}
