"use client";

import { Skeleton } from "@/lib/components/ui/skeleton";

export function QOTDCardSkeleton() {
	return (
		<div className="card-organic border-border/80 p-5">
			<div className="flex gap-4">
				<Skeleton className="size-10 shrink-0 rounded-full" />
				<div className="flex flex-1 flex-col gap-2">
					<Skeleton className="h-4 w-24" />
					<Skeleton className="h-4 w-full" />
					<Skeleton className="h-4 w-4/5" />
				</div>
			</div>
		</div>
	);
}

export function QOTDSkeleton() {
	return (
		<div className="mx-auto flex max-w-2xl flex-col gap-6 px-4 py-8 md:px-6">
			<div className="space-y-2 text-center">
				<Skeleton className="mx-auto h-3 w-20" />
				<Skeleton className="mx-auto h-9 w-48" />
				<Skeleton className="mx-auto h-4 w-64" />
			</div>

			<div className="card-organic space-y-4 border-border/80 p-6 md:p-8">
				<Skeleton className="h-3 w-28" />
				<Skeleton className="h-8 w-full" />
				<Skeleton className="h-8 max-w-[92%]" />
				<div className="flex gap-3 pt-2">
					<Skeleton className="h-12 flex-1 rounded-xl" />
					<Skeleton className="h-12 w-24 rounded-xl" />
				</div>
			</div>

			<Skeleton className="h-px w-full" />

			<div>
				<Skeleton className="mb-4 h-4 w-32" />
				<div className="flex flex-col gap-4">
					{Array.from({ length: 3 }).map((_, i) => (
						<QOTDCardSkeleton key={i} />
					))}
				</div>
			</div>
		</div>
	);
}
