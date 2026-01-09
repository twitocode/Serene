"use client";

import * as React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "./carousel";
import { useIsMobile } from "@/lib/hooks/use-mobile";

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
  FreeScrollCarousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
};
