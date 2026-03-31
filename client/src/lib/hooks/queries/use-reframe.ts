import { useMutation } from "@tanstack/react-query";
import { apiFetch } from "@/lib/helpers/api-fetch";
import type { ReframeRequest, ReframeResponse } from "@/lib/types/api-types";

/** Handles camelCase, PascalCase, or accidental double-wrapping of Result.data */
function normalizeReframePayload(raw: unknown): ReframeResponse {
	let r = raw;
	if (r && typeof r === "object") {
		const o = r as Record<string, unknown>;
		if ("data" in o && typeof o.data === "object" && o.data !== null) {
			r = o.data;
		}
	}
	if (!r || typeof r !== "object") {
		throw new Error("Invalid reframe response");
	}
	const o = r as Record<string, unknown>;
	const distortion = o.distortion ?? o.Distortion;
	const socraticQuestion = o.socraticQuestion ?? o.SocraticQuestion;
	const suggestedReframe = o.suggestedReframe ?? o.SuggestedReframe;
	if (distortion == null || suggestedReframe == null) {
		throw new Error("Invalid reframe response shape");
	}
	return {
		distortion: String(distortion),
		socraticQuestion: String(socraticQuestion ?? ""),
		suggestedReframe: String(suggestedReframe),
	};
}

export function useReframeMutation() {
	return useMutation<ReframeResponse, Error, ReframeRequest>({
		mutationFn: async (data) => {
			const res = await apiFetch<unknown>("/checkin/reframe", {
				method: "POST",
				body: JSON.stringify(data),
			});
			if (!res.isSuccess || res.data == null) {
				throw new Error(res.message ?? "Failed to get reframe suggestion");
			}
			return normalizeReframePayload(res.data);
		},
	});
}
