"use client";

import type * as React from "react";
import { useIsMobile } from "@/lib/hooks/use-mobile";
import {
	Carousel,
	type CarouselApi,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "./carousel";

function FreeScrollCarousel({
	opts,
	...props
}: React.ComponentProps<typeof Carousel>) {
	const isMobile = useIsMobile();
	return (
		<Carousel
			opts={{
				...opts,
				dragFree: !isMobile,
			}}
			{...props}
		/>
	);
}

export {
	type CarouselApi,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
	FreeScrollCarousel,
};
