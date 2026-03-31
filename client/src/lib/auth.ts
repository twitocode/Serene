import { apiFetch } from "@/lib/helpers/api-fetch";
import type {
	AuthResponseDto,
	CheckEmailDto,
	CheckEmailResponseDto,
	EmailSignInDto,
	EmailSignUpDto,
	GoogleLoginDto,
	Result,
} from "./types/api-types";

export const auth = {
	checkEmail: async (email: string): Promise<Result<CheckEmailResponseDto>> => {
		return apiFetch<CheckEmailResponseDto>("/auth/check-email", {
			method: "POST",
			body: JSON.stringify({ email } as CheckEmailDto),
		});
	},

	signIn: async (data: EmailSignInDto): Promise<Result<AuthResponseDto>> => {
		return apiFetch<AuthResponseDto>("/auth/sign-in/email", {
			method: "POST",
			body: JSON.stringify(data),
		});
	},

	signUp: async (data: EmailSignUpDto): Promise<Result<AuthResponseDto>> => {
		return apiFetch<AuthResponseDto>("/auth/sign-up/email", {
			method: "POST",
			body: JSON.stringify(data),
		});
	},

	signInWithGoogle: async (
		idToken: string,
	): Promise<Result<AuthResponseDto>> => {
		return apiFetch<AuthResponseDto>("/auth/google", {
			method: "POST",
			body: JSON.stringify({ idToken } as GoogleLoginDto),
		});
	},

	signOut: async (): Promise<Result<{ success: boolean; message: string }>> => {
		document.cookie = "session_token=; max-age=0; path=/;";
		return apiFetch<{ success: boolean; message: string }>("/auth/sign-out", {
			method: "POST",
		});
	},
};
