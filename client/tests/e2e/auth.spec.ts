import { expect, test } from "@playwright/test";

test.describe("Authentication Flows", () => {
	test("should show error on non-existent email", async ({ page }) => {
		await page.goto("/login");
		await page
			.getByPlaceholder(/m@example.com/i)
			.fill("nonexistent@example.com");
		await page.getByRole("button", { name: /continue/i }).click();

		await expect(
			page.getByText(/No accounts associated with this email/i),
		).toBeVisible();
	});

	test("should transition to password step when email exists", async ({
		page,
	}) => {
		await page.goto("/login");
		await page.getByPlaceholder(/m@example.com/i).fill("test@example.com");
		await page.getByRole("button", { name: /continue/i }).click();

		await expect(page.getByText(/Welcome Back/i)).toBeVisible();
		await expect(page.getByPlaceholder(/Enter your password/i)).toBeVisible();
	});

	test("should handle successful login and redirect", async ({
		page,
		context,
	}) => {
		await page.goto("/login");
		await page.getByPlaceholder(/m@example.com/i).fill("test@example.com");
		await page.getByRole("button", { name: /continue/i }).click();

		await page.getByPlaceholder(/Enter your password/i).fill("password123");

		await context.addCookies([
			{
				name: "session_token",
				value: "dummy-token",
				domain: "localhost",
				path: "/",
			},
		]);

		await page.getByRole("button", { name: /Login/i }).click();

		await expect(page).toHaveURL(/\/home/, { timeout: 10000 });
	});
});
