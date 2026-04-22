import { test, expect } from "@playwright/test";

test.describe("Onboarding Flow", () => {
	test("should navigate through onboarding steps", async ({ page, context }) => {
		await context.addCookies([
			{
				name: "session_token",
				value: "dummy-token",
				domain: "localhost",
				path: "/",
			},
			{
				name: "x-test-onboarding",
				value: "incomplete",
				domain: "localhost",
				path: "/",
			},
		]);

		await page.goto("/onboarding");

		await expect(page).toHaveURL(/\/onboarding/);

		await expect(page.getByText(/What should we call you?/i)).toBeVisible();

		await page.getByPlaceholder(/Name/i).fill("Test User");

		await page.getByRole("button", { name: /Continue/i }).click();

		await expect(page).toHaveURL(/\/onboarding/);
	});
});
