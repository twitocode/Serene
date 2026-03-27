"use client";

import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface TrendCardProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
}

export function TrendCard({
  title,
  subtitle,
  children,
  className = "",
}: TrendCardProps) {
  return (
    <div
      className={cn(
        "card-organic border-border/80 bg-card/95 p-5 shadow-sm backdrop-blur-sm md:p-6",
        className,
      )}
    >
      <div className="mb-4 border-b border-border/60 pb-3">
        <h3 className="font-serif text-lg font-semibold tracking-tight text-foreground">
          {title}
        </h3>
        {subtitle ? (
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            {subtitle}
          </p>
        ) : null}
      </div>
      {children}
    </div>
  );
}
