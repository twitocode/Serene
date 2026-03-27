import { MochiDefault } from "@/lib/components/common/mochi";
import { cn } from "@/lib/utils";

export default function SereneLogo({
  noText = false,
  noLogo = false,
  sidebar = false,
  className = "",
  textSize = "text-xl",
}: {
  noText?: boolean;
  noLogo?: boolean;
  sidebar?: boolean;
  className?: string;
  textSize?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 transition-transform duration-200 hover:opacity-90",
        className,
      )}
    >
      {!noLogo && (
        <MochiDefault
          className={cn(
            "shrink-0 text-primary",
            sidebar
              ? "size-7 max-h-7 max-w-7 group-data-[collapsible=icon]:size-6 group-data-[collapsible=icon]:max-h-6 group-data-[collapsible=icon]:max-w-6"
              : "size-9",
          )}
        />
      )}
      {!noText && (
        <span
          className={cn(
            "font-serif font-semibold tracking-tight text-foreground",
            textSize,
          )}
        >
          Serene
        </span>
      )}
    </div>
  );
}
