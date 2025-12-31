"use client";

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
import { ReturningStep } from "./returning-step";
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
  initialStep: number;
  hasStarted: boolean;
}

export function OnboardingFlow(props: Props) {
  // Convert database step to UI step
  const getInitialUIStep = (dbStep: number, hasStarted: boolean): number => {
    // If user has started before, show returning step first
    if (hasStarted) {
      return 0; // Returning step
    }

    // If user has not started at all, show intermediate step 1 first
    return 1; // Intermediate step 1
  };

  const [onboardingStep, setOnBoardingStep] = useState(props.initialStep);
  const [uiStep, setUIStep] = useState(
    getInitialUIStep(props.initialStep, props.hasStarted)
  );
  const [direction, setDirection] = useState(0);
  const [name, setName] = useState("");
  const [age, setAge] = useState(0);
  const [gender, setGender] = useState("");
  const [pronouns, setPronouns] = useState("");
  const [country, setCountry] = useState("");
  const [school, setSchool] = useState("");
  const [koalaName, setKoalaName] = useState("");
  const [koalaColour, setKoalaColor] = useState("");
  const [koalaPronouns, setKoalaPronouns] = useState("");
  const transitionType: TransitionType = "scale";

  const getProgressStep = (currentUIStep: number): number => {
    switch (currentUIStep) {
      case 0:
        return 1; // ReturningStep -> shows Step 1 progress
      case 1:
        return 1; // IntermediateStepOne -> shows Step 1 progress
      case 2:
        return 1; // StepOne -> Step 1 progress
      case 3:
        return 2; // IntermediateStepTwo -> shows Step 2 progress
      case 4:
        return 2; // StepTwo -> Step 2 progress
      case 5:
        return 3; // StepThree -> Step 3 progress
      case 6:
        return 4; // StepFour -> Step 4 progress
      case 7:
        return 5; // StepFive -> Step 5 progress
      default:
        return 1;
    }
  };

  const goNext = () => {
    setDirection(1);
    setUIStep((prev) => {
      // If coming from returning step (0), jump to correct step based on onboardingStep
      if (prev === 0) {
        switch (onboardingStep) {
          case 1:
            return 2; // StepOne
          case 2:
            return 4; // StepTwo
          case 3:
            return 5; // StepThree
          case 4:
            return 6; // StepFour
          case 5:
            return 7; // StepFive
          default:
            return 1; // IntermediateStepOne for new users
        }
      }
      return prev + 1;
    });
  };

  const goNextAPI = async () => {
    try {
      if (onboardingStep === 1) await completeStep1(name);
      if (onboardingStep === 2)
        await completeStep2(age, gender, pronouns.replace("-", " "));
      if (onboardingStep === 3) await completeStep3(country);
      if (onboardingStep === 4) {
        const schoolObj = schools.find((s) => s.name === school)!;
        await completeStep4(schoolObj);
      }
      if (onboardingStep === 5) {
        await completeStep5(koalaName, koalaPronouns, koalaColour);
        window.location.href = "/home";
        return;
      }

      goNext();
      setOnBoardingStep((prev) => prev + 1);
    } catch (error) {
      console.error(error);
    }
  };

  const goBack = () => {
    setDirection(-1);
    setOnBoardingStep((prev) => prev - 1);

    setUIStep((prev) => {
      // Skip intermediate steps when going back
      if (prev === 4) return 2; // From StepTwo -> skip IntermediateStepTwo -> go to StepOne
      if (prev === 2 && !props.hasStarted) return 1; // From StepOne -> go to IntermediateStepOne (only for new users)
      return prev - 1;
    });
  };

  const variants = getVariants(transitionType);

  return (
    <div className="min-h-screen flex items-center justify-center p-4  w-full">
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
            {uiStep === 0 && <ReturningStep onNext={goNext} />}
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
                koalaColour={koalaColour}
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
          {[1, 2, 3, 4, 5].map((i) => (
            <motion.div
              key={i}
              initial={false}
              animate={{
                scale: i === getProgressStep(uiStep) ? 1.2 : 1,
                backgroundColor:
                  i === getProgressStep(uiStep) ? "#000" : "#d1d5db",
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
