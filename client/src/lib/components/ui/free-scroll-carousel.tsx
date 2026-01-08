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

function FreeScrollCarousel({
  opts,
  ...props
}: React.ComponentProps<typeof Carousel>) {
  return (
    <Carousel
      opts={{
        ...opts,
        dragFree: true,
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
