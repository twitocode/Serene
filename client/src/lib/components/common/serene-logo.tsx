import { MochiDefault } from "@/lib/components/common/mochi";

export default function SereneLogo({
  noText = false,
  noLogo = false,
  sidebar = false,
  className = "",
  iconSize = 8,
  textSize = "xl",
}) {
  return (
    <div
      className={` flex items-center text-xl space-x-4 ${className} hover:scale-105 transition ease-in duration-75`}
    >
      {!noLogo && (
        <MochiDefault
          className={`h-${iconSize} text-sidebar-primary flex aspect-square items-center justify-center rounded-lg`}
        />
      )}
      {!noText && (
        <span className={`font-yeasty text-${textSize} `}>Serene</span>
      )}
    </div>
  );
}
