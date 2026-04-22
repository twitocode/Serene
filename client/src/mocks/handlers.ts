import { HttpResponse, http } from "msw";

export const handlers = [
	http.get("*/users/me", () => {
		return HttpResponse.json({
			isSuccess: true,
			data: {
				id: "1",
				email: "test@example.com",
				name: "Test User",
				roles: [],
			},
		});
	}),

	http.post("*/auth/check-email", async ({ request }) => {
		const body = (await request.json()) as { email?: string };
		if (body.email === "test@example.com") {
			return HttpResponse.json({ isSuccess: true, data: { exists: true } });
		}
		if (body.email === "nonexistent@example.com") {
			return HttpResponse.json({ isSuccess: true, data: { exists: false } });
		}
		return HttpResponse.json({ isSuccess: true, data: { exists: false } });
	}),

	http.post("*/auth/sign-in/*", () => {
		return HttpResponse.json({
			isSuccess: true,
			data: { user: { id: "1", email: "test@example.com" } },
		});
	}),

	http.get("*/users/onboarding", ({ request }) => {
		const cookie = request.headers.get("cookie") || "";
		const onboardingNotCompleted = cookie.includes(
			"x-test-onboarding=incomplete",
		);

		return HttpResponse.json({
			isSuccess: true,
			data: onboardingNotCompleted
				? {
						completed: false,
						started: false,
						step: 1,
						name: "",
						dateOfBirth: null,
						gender: "",
						pronouns: "",
						countryCode: "",
						schoolName: "",
						mochiName: "",
						mochiPronouns: "",
					}
				: { completed: true, currentStep: 5 },
		});
	}),

	http.post("*/users/onboarding/step*", () => {
		return HttpResponse.json({ isSuccess: true });
	}),

	http.get("*/checkin", () => {
		return HttpResponse.json({
			isSuccess: true,
			data: [],
		});
	}),

	http.post("*/checkin/reframe", () => {
		return HttpResponse.json({
			isSuccess: true,
			data: {
				suggestedReframe: "Test reframe",
				distortion: "All-or-Nothing",
				socraticQuestion: "Is this really true?",
			},
		});
	}),

	http.post("*/checkin", () => {
		return HttpResponse.json({
			isSuccess: true,
			data: { success: true },
		});
	}),

	http.get("*/settings", () => {
		return HttpResponse.json({
			isSuccess: true,
			data: {
				theme: "system",
				notifications: true,
			},
		});
	}),
];
