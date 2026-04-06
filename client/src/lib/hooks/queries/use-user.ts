import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/helpers/api-fetch";
import type { User } from "@/lib/types/index";

interface UpdateProfileRequest {
	name?: string;
	struggles?: string[];
}

interface ChangePasswordRequest {
	currentPassword: string;
	newPassword: string;
}

export function useUserQuery() {
	return useQuery<User>({
		queryKey: ["user"],
		queryFn: async () => {
			const res = await apiFetch<User>("/users/me");
			if (!res.isSuccess || !res.data) {
				throw new Error(res.message ?? "Failed to fetch user");
			}
			return res.data;
		},
	});
}

export function useUpdateProfileMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (data: UpdateProfileRequest) => {
			const res = await apiFetch<User>("/users/me", {
				method: "PUT",
				body: JSON.stringify(data),
			});
			if (!res.isSuccess) {
				throw new Error(res.message ?? "Failed to update profile");
			}
			return res.data;
		},
		onSuccess: (newUser) => {
			queryClient.setQueryData(["user"], newUser);
		},
	});
}

export function useChangePasswordMutation() {
	return useMutation({
		mutationFn: async (data: ChangePasswordRequest) => {
			const res = await apiFetch<{ message: string }>("/users/me/password", {
				method: "PUT",
				body: JSON.stringify(data),
			});
			if (!res.isSuccess) {
				throw new Error(res.message ?? "Failed to change password");
			}
			return res.data;
		},
	});
}
