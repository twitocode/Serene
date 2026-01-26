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
  mochiName: string;
  setMochiName: (mochiName: string) => void;
  mochiPronouns: string;
  setMochiPronouns: (mochiPronouns: string) => void;
  onNext: () => void;
  onBack: () => void;
}
