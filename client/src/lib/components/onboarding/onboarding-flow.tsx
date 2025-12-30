"use client";

//TODO: add back functionality
import {
  completeStep1,
  completeStep2,
  completeStep3,
  completeStep4,
  completeStep5,
} from "@/lib/client/onboarding-client";
import { schools } from "@/lib/data";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { IntermediateStepOne } from "./intermediate-step-1";
import { IntermediateStepTwo } from "./intermediate-step-2";
import { StepOne } from "./step-1";
import { StepTwo } from "./step-2";
import { StepThree } from "./step-3";
import { StepFour } from "./step-4";
import { StepFive } from "./step-5";
type TransitionType = "slide" | "fade" | "scale";

const getVariants = (type: TransitionType) => {
  switch (type) {
    case "slide":
      return {
        enter: (direction: number) => ({
          x: direction > 0 ? 1000 : -1000,
          opacity: 0,
        }),
        center: { x: 0, opacity: 1 },
        exit: (direction: number) => ({
          x: direction < 0 ? 1000 : -1000,
          opacity: 0,
        }),
      };
    case "fade":
      return {
        enter: { opacity: 0 },
        center: { opacity: 1 },
        exit: { opacity: 0 },
      };
    case "scale":
      return {
        enter: { opacity: 0, scale: 0.8 },
        center: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.8 },
      };
  }
};

interface Props {
  initialStep: number
}
export function OnboardingFlow(props: Props) {
  const [onboardingStep, setOnBoardingStep] = useState(props.initialStep);
  const [uiStep, setUIStep] = useState(1);
  const [direction, setDirection] = useState(0);
  const [name, setName] = useState("");
  const [age, setAge] = useState(0);
  const [gender, setGender] = useState("");
  const [pronouns, setPronouns] = useState("");
  const [country, setCountry] = useState("");
  const [school, setSchool] = useState("");
  const [koalaName, setKoalaName] = useState("");
  const [koalaColor, setKoalaColor] = useState("");
  const [koalaPronouns, setKoalaPronouns] = useState("");
  const transitionType: TransitionType = "slide"; // Change to "fade" or "scale"

  const goNext = () => {
    setDirection(1);
    setUIStep((prev) => prev + 1);
  };

  const goNextAPI = async () => {
    goNext();
    setOnBoardingStep((prev) => prev + 1);
    if (onboardingStep === 1) await completeStep1(name);
    if (onboardingStep === 2) await completeStep2(age, gender, pronouns);
    if (onboardingStep === 3) await completeStep3(country);
    if (onboardingStep === 4) {
      const schoolObj = schools.find((s) => s.name === school)!;
      await completeStep4({
        ...schoolObj,
        schoolName: school,
      });
    }
    if (onboardingStep === 5)
      await completeStep5(koalaName, koalaPronouns, koalaColor);
  };

  const goBack = () => {
    setDirection(-1);
    setUIStep((prev) => prev - 1);
  };

  const variants = getVariants(transitionType);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-2xl h-[600px] bg-white rounded-lg overflow-hidden relative">
        <AnimatePresence initial={false} mode="wait" custom={direction}>
          <motion.div
            key={uiStep}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            className="h-full flex items-center justify-center p-8"
          >
            {uiStep === 1 && <IntermediateStepOne onNext={goNext} />}
            {uiStep === 2 && (
              <StepOne name={name} setName={setName} onNext={goNextAPI} />
            )}
            {uiStep === 3 && (
              <IntermediateStepTwo name={name} onNext={goNext} />
            )}
            {uiStep === 4 && (
              <StepTwo
                age={age}
                setAge={setAge}
                gender={gender}
                setGender={setGender}
                pronouns={pronouns}
                setPronouns={setPronouns}
                onNext={goNextAPI}
                onBack={goBack}
              />
            )}
            {uiStep === 5 && (
              <StepThree
                country={country}
                setCountry={setCountry}
                onNext={goNextAPI}
                onBack={goBack}
              />
            )}
            {uiStep === 6 && (
              <StepFour
                school={school}
                setSchool={setSchool}
                onNext={goNextAPI}
                onBack={goBack}
              />
            )}
            {uiStep === 7 && (
              <StepFive
                koalaName={koalaName}
                setKoalaName={setKoalaName}
                koalaColor={koalaColor}
                setKoalaColor={setKoalaColor}
                koalaPronouns={koalaPronouns}
                setKoalaPronouns={setKoalaPronouns}
                onNext={goNextAPI}
                onBack={goBack}
              />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Progress dots */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <motion.div
              key={i}
              initial={false}
              animate={{
                scale: i === uiStep ? 1.2 : 1,
                backgroundColor: i === uiStep ? "#000" : "#d1d5db",
              }}
              transition={{ duration: 0.2 }}
              className="w-2 h-2 rounded-full"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
