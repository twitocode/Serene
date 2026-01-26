"use client";

import { Skeleton } from "@/lib/components/ui/skeleton";

export function ActivityCardSkeleton() {
  return (
    <div className="relative bg-card rounded-3xl p-6 border border-border">
      <div className="absolute -top-3 -right-3 w-12 h-12 bg-background border-2 border-border rounded-full" />
      <div className="flex items-center gap-2 mb-3">
        <Skeleton className="h-6 w-24 rounded-full" />
        <Skeleton className="h-4 w-12" />
      </div>
      <Skeleton className="h-6 w-3/4 mb-2" />
      <Skeleton className="h-4 w-full mb-1" />
      <Skeleton className="h-4 w-5/6" />
    </div>
  );
}

export function ResourceCardSkeleton() {
  return (
    <div className="bg-card rounded-3xl p-6 border border-border">
      <Skeleton className="h-6 w-20 rounded-full mb-4" />
      <Skeleton className="h-6 w-3/4 mb-2" />
      <Skeleton className="h-4 w-full mb-1" />
      <Skeleton className="h-4 w-5/6 mb-4" />
      <Skeleton className="h-4 w-24" />
    </div>
  );
}

export function ExploreSkeleton() {
  return (
    <div className="min-h-full max-w-6xl mx-auto px-4 py-8">
      <div className="mb-12 flex flex-col items-center">
        <Skeleton className="h-10 w-48 mb-2" />
        <Skeleton className="h-5 w-96" />
      </div>

      <div className="mb-12">
        <div className="mb-6">
          <Skeleton className="h-8 w-56 mb-2" />
          <Skeleton className="h-4 w-80" />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <ActivityCardSkeleton key={i} />
          ))}
        </div>
      </div>

      <div>
        <div className="mb-6">
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-72" />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <ResourceCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
