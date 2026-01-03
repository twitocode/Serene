export interface UserDto {
  id: string;
  email?: string | null;
  name?: string | null;
  image?: string | null;
  emailConfirmed: boolean;
  createdAt: string;
  updatedAt: string;
}
export interface OnboardingStatusDto {
  step: number;
  completed: boolean;
  started: boolean;
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
