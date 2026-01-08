import { GridPoint } from "@/lib/types/index";

export interface Result<T = void> {
  isSuccess: boolean;
  data: T | null;
  message?: string | null;
  errorCode?: string | null;
  errors?: Record<string, string[]> | null;
}

export interface UserDto {
  id: string;
  email?: string | null;
  name?: string | null;
  image?: string | null;
  emailConfirmed: boolean;
  createdAt: string;
  updatedAt: string;
  preferences?: PreferencesDto | null;
}

export interface PreferencesDto {
  id: string;
  theme?: string | null;
  passwordLock?: string | null;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProfileDto {
  id: string;
  koalaName: string | null;
  koalaColour: string | null;
  koalaPronouns: string | null;
  currentStreak: number;
  longestStreak: number;
  userId: string;
  schoolId: string;
}

export interface SchoolDto {
  id: string;
  city: string;
  name: string;
  countryCode: string;
  regionCode: string;
  userId: string;
}

export interface OnboardingStatusDto {
  step: number;
  completed: boolean;
  started: boolean;
  name?: string | null;
  dateOfBirth?: string;
  gender?: string | null;
  pronouns?: string | null;
  countryCode?: string | null;
  schoolName?: string | null;
  koalaName?: string | null;
  koalaColour?: string | null;
  koalaPronouns?: string | null;
}

export interface AuthResponseDto {
  token: string;
  user: UserDto;
}

export interface CheckEmailResponseDto {
  exists: boolean;
  hasPassword: boolean;
  providers: string[];
}

export interface EmailSignUpDto {
  email: string;
  password: string;
  name: string;
}

export interface EmailSignInDto {
  email: string;
  password: string;
}

export interface CheckEmailDto {
  email: string;
}

export interface GoogleLoginDto {
  idToken: string;
}

export interface QOTDPostDto {
  qotdId: string;
  response: string;
}

export interface QOTDResponseDto {
  qotdId: string;
  question: string;
}

export interface QOTDAnswerDto {
  userId: string;
  username: string;
  answer: string;
}


export interface CompleteCheckinRequest {
  promptAnswer: string | null;
  somaticState: { [key: string]: GridPoint };
  lingeringThoughts: string | null;
  moodLabel: string;
  promptQuestion: string;
  moodSeverity: number;
}

export interface CheckinResponse {
  lingeringThoughts: string | null;
  moodLabel: string;
  promptQuestion: string;
  moodSeverity: number;
  id: string;
  dateCompleted: string;
}