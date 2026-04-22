import { expect, test } from "@playwright/test";

test.describe("Landing Page", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("/");
	});

	test("should display the hero section and title", async ({ page }) => {
		await expect(page).toHaveTitle(/Serene/);
		await expect(
			page.getByText(/A gentler way through stressful semesters/i),
		).toBeVisible();
	});

	test("should have functional CTA buttons", async ({ page }) => {
		const getStarted = page.getByRole("button", { name: /get started/i });
		await expect(getStarted).toBeVisible();

		const login = page.getByRole("button", {
			name: /i already have an account/i,
		});
		await expect(login).toBeVisible();

		// Clicking get started should open the signup page
		await getStarted.click();
		await expect(page).toHaveURL(/\/signup/);
	});

	test("should have a visible navbar with logo", async ({ page }) => {
		// Use a more specific locator to avoid strict mode violations
		await expect(page.getByRole("navigation").first()).toBeVisible();
		await expect(
			page.getByRole("link", { name: /serene/i }).first(),
		).toBeVisible();
	});

	test("should display pillars of the platform", async ({ page }) => {
		await expect(page.getByText(/Evidence-informed/i)).toBeVisible();
		await expect(page.getByText(/Student-first/i)).toBeVisible();
		await expect(page.getByText(/Privacy-minded/i)).toBeVisible();
	});
});
