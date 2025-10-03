import { Ribbon } from "lucide-react";

export default function SereneLogo({noText = false, noLogo = false, sidebar =false }) {
  return (
    <div className={`${!sidebar && "w-full"} flex items-center space-x-2`}>
      {!noLogo && (
        <div className="text-sidebar-primary flex aspect-square items-center justify-center rounded-lg">
          <Ribbon />
        </div>
      )}
      {!noText && (
        <span className="font-medium font-serif text-xl">Serene</span>
      )}
    </div>
  );
}
