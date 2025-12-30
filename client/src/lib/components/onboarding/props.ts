import { School } from "@/lib/types";

export interface OnboardingStepProps {
  step: number;
  name: string;
  setName: (name: string) => void;
  age: number;
  setAge: (age: number) => void;
  gender: string;
  setGender: (gender: string) => void;
  pronouns: string;
  setPronouns: (pronouns: string) => void;
  country: string;
  setCountry: (country: string) => void;
  school: string;
  setSchool: (school: string) => void;
  koalaName: string;
  setKoalaName: (koalaName: string) => void;
  koalaColor: string;
  setKoalaColor: (koalaColor: string) => void;
  koalaPronouns: string;
  setKoalaPronouns: (koalaPronouns: string) => void;
  onNext: () => void;
  onBack: () => void;
}
