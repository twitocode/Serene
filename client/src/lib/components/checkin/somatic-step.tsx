import FemaleBody from "@/lib/components/checkin/bodies/female-body";
import MaleBody from "@/lib/components/checkin/bodies/male-body";
import {
  BodyPart,
  getBodyPart,
  PRESET_SENSATIONS,
} from "@/lib/components/checkin/somatic-utils";
import { Badge } from "@/lib/components/ui/badge";
import { Button } from "@/lib/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/lib/components/ui/drawer";
import { Input } from "@/lib/components/ui/input";
import {
  MultiSelect,
  MultiSelectContent,
  MultiSelectGroup,
  MultiSelectItem,
  MultiSelectTrigger,
} from "@/lib/components/ui/multi-select";
import { useCheckinStore } from "@/lib/components/providers/zustand-provider";
import { useUserQuery } from "@/lib/hooks/queries/use-user";
import { useIsMobile } from "@/lib/hooks/use-mobile";
import { Plus, X } from "lucide-react";
import { useState } from "react";

export default function SomaticStep() {
  const { data: user } = useUserQuery();
  const { somaticState, setSomaticState, goNext } = useCheckinStore(
    (state) => state
  );

  const [selectedPart, setSelectedPart] = useState<{
    part: BodyPart;
    x: number;
    y: number;
  } | null>(null);

  const [currentSensations, setCurrentSensations] = useState<string[]>([]);
  const [customSensation, setCustomSensation] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();

  const handleBodyClick = (e: React.MouseEvent<SVGSVGElement>) => {
    const svgRect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - svgRect.left) / svgRect.width;
    const y = (e.clientY - svgRect.top) / svgRect.height;

    const part = getBodyPart(x, y, user?.gender || "Female");

    if (part !== null) {
      setSelectedPart({ part, x, y });

      const existing = somaticState[part]?.sensations || [];
      setCurrentSensations(existing);
      setIsOpen(true);
    }
  };

  const handleSave = () => {
    if (selectedPart && selectedPart.part) {
      const newState = { ...somaticState };

      if (currentSensations.length > 0) {
        newState[selectedPart.part] = {
          x: selectedPart.x,
          y: selectedPart.y,
          sensations: currentSensations,
        };
      } else {
        delete newState[selectedPart.part];
      }

      setSomaticState(newState);
    }
    setIsOpen(false);
    setCustomSensation("");
    setSelectedPart(null);
  };

  const addCustomSensation = () => {
    if (
      customSensation.trim() &&
      !currentSensations.includes(customSensation.trim())
    ) {
      setCurrentSensations([...currentSensations, customSensation.trim()]);
      setCustomSensation("");
    }
  };

  const onPresetsChange = (newPresets: string[]) => {
    const custom = currentSensations.filter(
      (s) => !PRESET_SENSATIONS.includes(s)
    );
    setCurrentSensations([...custom, ...newPresets]);
  };

  const currentPresets = currentSensations.filter((s) =>
    PRESET_SENSATIONS.includes(s)
  );

  const sensationCounts = Object.entries(somaticState).reduce(
    (acc, [part, data]) => {
      acc[part] = data.sensations.length;
      return acc;
    },
    {} as Record<string, number>
  );

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
          <FemaleBody
            onClick={handleBodyClick}
            somaticState={somaticState}
            selectedPart={selectedPart?.part}
          />
        ) : (
          <MaleBody
            onClick={handleBodyClick}
            somaticState={somaticState}
            selectedPart={selectedPart?.part}
          />
        )}
      </div>
      <Button className="mt-4" onClick={goNext}>
        {Object.keys(somaticState).length === 0 ? "Skip" : "Continue"}
      </Button>

      <Drawer
        open={isOpen}
        onOpenChange={(open) => {
          if (!open) {
            setCustomSensation("");
            setSelectedPart(null);
          }
          setIsOpen(open);
        }}
      >
        <DrawerContent >
          <DrawerHeader className="">
            <DrawerTitle>{selectedPart?.part}</DrawerTitle>
            <DrawerDescription className="flex flex-col gap-4 pt-4">
              <div className="flex flex-wrap gap-2 mb-2">
                {currentSensations.length === 0 && (
                  <span className="text-sm text-muted-foreground">
                    No sensations selected
                  </span>
                )}
                {currentSensations.map((s) => (
                  <Badge key={s} variant="secondary" className="gap-1 pr-1">
                    {s}
                    <X
                      className="h-3 w-3 cursor-pointer hover:text-destructive"
                      onClick={() =>
                        setCurrentSensations(
                          currentSensations.filter((x) => x !== s)
                        )
                      }
                    />
                  </Badge>
                ))}
              </div>

              <MultiSelect
                values={currentPresets}
                onValuesChange={onPresetsChange}
              >
                <MultiSelectTrigger className="w-full">
                  <span className="text-muted-foreground font-normal">
                    Select preset sensations...
                  </span>
                </MultiSelectTrigger>
                <MultiSelectContent>
                  <MultiSelectGroup>
                    {PRESET_SENSATIONS.map((s) => (
                      <MultiSelectItem key={s} value={s}>
                        {s}
                      </MultiSelectItem>
                    ))}
                  </MultiSelectGroup>
                </MultiSelectContent>
              </MultiSelect>

              <div className="flex gap-2">
                <Input
                  placeholder="Other sensation..."
                  value={customSensation}
                  onChange={(e) => setCustomSensation(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addCustomSensation();
                    }
                  }}
                />
                <Button
                  size="icon"
                  variant="outline"
                  onClick={addCustomSensation}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </DrawerDescription>
          </DrawerHeader>
          <DrawerFooter className="">
            <Button onClick={handleSave}>Save</Button>
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
