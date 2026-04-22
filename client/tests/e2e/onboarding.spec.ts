import { expect, test } from "@playwright/test";

test.describe("Onboarding Flow", () => {
	test("should navigate through onboarding steps", async ({
		page,
		context,
	}) => {
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

		// Step 1: Welcome / Name
		await expect(page).toHaveURL(/\/onboarding/);
		await expect(page.getByText(/What should we call you?/i)).toBeVisible();
		await page.getByPlaceholder(/Name/i).fill("Test User");
		await page.getByRole("button", { name: /Continue/i }).click();

		// Step 2: Personal Info (Date of Birth, Gender, Pronouns)
		await expect(page.getByText(/Tell us about yourself/i)).toBeVisible();

		// Click the date picker
		await page.getByRole("button", { name: /Select date of birth/i }).click();
		// In shadcn calendar with dropdowns, we can select the year to be > 13 years ago
		await page
			.locator("select")
			.filter({ hasText: "2000" })
			.selectOption("2000");
		await page.getByRole("gridcell", { name: "15" }).first().click();

		// Select Gender
		await page.getByRole("combobox").first().click();
		await page.getByRole("option", { name: "Non-binary" }).click();

		// Select Pronouns
		await page.getByRole("combobox").nth(1).click();
		await page.getByRole("option", { name: "They/Them" }).click();

		await page.getByRole("button", { name: /Continue/i }).click();

		// Step 4: Disclaimer
		await expect(page.getByText(/Disclaimer/i)).toBeVisible();
		await expect(
			page.getByText(/exclusively for McMaster University students/i),
		).toBeVisible();
		await page.getByRole("button", { name: /Continue/i }).click();

		// Step 5: Mochi and Struggles
		await expect(page.getByText(/Meet Mochi!/i)).toBeVisible();

		// Set Mochi's name
		await page.getByPlaceholder(/Mochi's name/i).fill("Mochibot");

		// Select Mochi's pronouns
		await page.getByRole("combobox").click();
		await page.getByRole("option", { name: "They/Them" }).click();

		// Select struggles (buttons)
		await page.getByRole("button", { name: "Academic Burnout" }).click();

		await page.getByRole("button", { name: /Complete/i }).click();

		// Verify redirect to home
		await expect(page).toHaveURL(/\/home/, { timeout: 10000 });
	});
});
