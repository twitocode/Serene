import { Ribbon } from "lucide-react";

export default function SereneLogo({
  noText = false,
  noLogo = false,
  sidebar = false,
  className = "",
  iconSize = 20,
  textSize = "xl",
}) {
  return (
    <div
      className={`${
        !sidebar && "w-full"
      } flex items-center space-x-2 text-xl ${className}`}
    >
      {!noLogo && (
        <div className="text-sidebar-primary flex aspect-square items-center justify-center rounded-lg">
          {/* <Ribbon size={iconSize} /> */}
          <img src="/logo.png" className="h-10" />
        </div>
      )}
      {!noText && (
        <span className={`font-bold font-serif text-${textSize} `}>
          Serene
        </span>
      )}
    </div>
  );
}
