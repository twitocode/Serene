import { apiFetch } from "@/lib/helpers/api-fetch";
import {
  AuthResponseDto,
  CheckEmailDto,
  CheckEmailResponseDto,
  EmailSignInDto,
  EmailSignUpDto,
  GoogleLoginDto,
} from "./types/api-types";

export const auth = {
  checkEmail: async (email: string) => {
    return apiFetch<CheckEmailResponseDto>("/auth/check-email", {
      method: "POST",
      body: JSON.stringify({ email } as CheckEmailDto),
    });
  },

  signIn: async (data: EmailSignInDto) => {
    return apiFetch<AuthResponseDto>("/auth/sign-in/email", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  signUp: async (data: EmailSignUpDto) => {
    return apiFetch<AuthResponseDto>("/auth/sign-up/email", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  signInWithGoogle: async (idToken: string) => {
    return apiFetch<AuthResponseDto>("/auth/google", {
      method: "POST",
      body: JSON.stringify({ idToken } as GoogleLoginDto),
    });
  },

  signOut: async () => {
    return apiFetch<{ success: boolean; message: string }>("/auth/sign-out", {
      method: "POST",
    });
  },
};
