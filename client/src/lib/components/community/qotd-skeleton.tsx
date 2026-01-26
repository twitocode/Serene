"use client";

import { Skeleton } from "@/lib/components/ui/skeleton";

export function QOTDCardSkeleton() {
  return (
    <div className="bg-card rounded-2xl p-6 border border-border">
      <div className="flex gap-4">
        <Skeleton className="h-12 w-12 rounded-full flex-shrink-0" />
        <div className="flex flex-col gap-2 flex-1">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
    </div>
  );
}

export function QOTDSkeleton() {
  return (
    <div className="flex flex-col gap-6 p-4 max-w-2xl mx-auto">
      <div className="bg-card rounded-2xl p-6 border border-border">
        <Skeleton className="h-6 w-16 mb-4" />
        <Skeleton className="h-8 w-full mb-2" />
        <Skeleton className="h-8 w-3/4" />
      </div>

      <div className="bg-card rounded-2xl p-6 border border-border">
        <Skeleton className="h-24 w-full rounded-xl" />
        <Skeleton className="h-10 w-32 mt-4" />
      </div>

      <div className="flex flex-col gap-4">
        <Skeleton className="h-6 w-32 mb-2" />
        {Array.from({ length: 3 }).map((_, i) => (
          <QOTDCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
