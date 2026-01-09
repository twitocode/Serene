// somatic-step.tsx
import FemaleBody from "@/lib/components/checkin/bodies/female-body";
import MaleBody from "@/lib/components/checkin/bodies/male-body";
import { getBodyPart, BodyPart } from "@/lib/components/checkin/somatic-utils";
import { useUserQuery } from "@/lib/hooks/queries/use-user";
import { useIsMobile } from "@/lib/hooks/use-mobile";
import { useState } from "react";

export default function SomaticStep() {
  const { data: user } = useUserQuery();
  const [sensation, setSensation] = useState<{
    x: number;
    y: number;
    active: boolean;
    part: BodyPart;
  }>({ x: 0, y: 0, active: false, part: null });
  const isMobile = useIsMobile();

  const handleBodyClick = (e: React.MouseEvent<SVGSVGElement>) => {
    const svgRect = e.currentTarget.getBoundingClientRect();
    // Calculate percentage position (0-1)
    const x = (e.clientX - svgRect.left) / svgRect.width;
    const y = (e.clientY - svgRect.top) / svgRect.height;

    const part = getBodyPart(x, y);

    setSensation({
      x,
      y,
      active: true,
      part,
    });
  };

  return (
    <div className="flex flex-col md:grid md:grid-cols-2 h-full">
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-center font-medium text-xl">
          Have you felt any physical discomfort lately?
        </h1>
        <span className="text-muted-foreground text-center">
          {isMobile ? "Tap" : "Click"} a spot on the body
        </span>
      </div>
      <div className="h-full max-h-[60vh] w-full flex justify-center items-center px-4">
        {user?.gender === "Female" ? (
          <FemaleBody onClick={handleBodyClick} activePart={sensation.part} />
        ) : (
          <MaleBody onClick={handleBodyClick} activePart={sensation.part} />
        )}
      </div>
      {sensation.active && sensation.part && (
        <div className="mt-4 p-2 bg-primary/10 rounded-md animate-in fade-in zoom-in">
          <p className="text-sm font-semibold text-primary">
            Selected: {sensation.part}
          </p>
        </div>
      )}
    </div>
  );
}

