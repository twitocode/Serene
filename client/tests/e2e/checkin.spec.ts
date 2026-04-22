import { expect, test } from "@playwright/test";

test.describe("Check-in Flow", () => {
	test("should navigate through check-in steps", async ({ page, context }) => {
		await context.addCookies([
			{
				name: "session_token",
				value: "dummy-token",
				domain: "localhost",
				path: "/",
			},
		]);

		await page.goto("/home/checkin");
		await expect(page).toHaveURL(/\/home\/checkin/, { timeout: 10000 });

		// Start Check-in
		await expect(page.getByRole("heading", { name: "Check-in", exact: true })).toBeVisible();
		await page.getByRole("button", { name: /Start check-in|Add check-in/i }).click();

		// Step 1: Mood
		await expect(page.getByText(/How are you right now\?/i)).toBeVisible();
		// The mood buttons contain the text of the mood. We can click "Content".
		await page.getByText("Content", { exact: true }).first().click();
		await page.getByRole("button", { name: /Continue/i }).click();

		// Step 2: Somatic
		await expect(
			page.getByText(/Have you felt any physical discomfort lately\?/i),
		).toBeVisible();
		await expect(page.getByRole("button", { name: "Skip", exact: true })).toBeVisible();
		await page.getByRole("button", { name: "Skip", exact: true }).click();

		// Step 3: Weighing
		await expect(page.getByText(/What's weighing on you\?/i)).toBeVisible();
		await page
			.getByPlaceholder(/I have an exam tomorrow/i)
			.fill("I am stressed about my exam");
		await page.getByRole("button", { name: "Next", exact: true }).click();

		// Step 4: Reframing
		await expect(page.getByText(/A kinder angle/i)).toBeVisible();
		await page.getByPlaceholder(/Write your own reframed thought/i).fill("Test reframe");
		await page.getByRole("button", { name: "Next", exact: true }).click();

		// Step 5: Checkin Complete Step
		await expect(page.getByText(/Review & save/i)).toBeVisible();
		await page.getByRole("button", { name: /Finish check-in/i }).click();

		// Verify redirect/closing of the flow
		await expect(page.getByText(/Logged this day/i)).toBeVisible();
	});
});
