"use client";

import { Button } from "@/lib/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { ReactNode } from "react";

interface TrendCardProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
}

export function TrendCard({ title, subtitle, children, className = "" }: TrendCardProps) {
  return (
    <div className={`bg-card rounded-2xl border border-border p-6 ${className}`}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-semibold text-foreground">{title}</h3>
          {subtitle && (
            <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
          )}
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8 -mt-1 -mr-2">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </div>
      {children}
    </div>
  );
}
