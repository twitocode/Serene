import { afterEach, describe, expect, it, mock, beforeEach } from "bun:test";
import { render, screen, cleanup, fireEvent, waitFor } from "@testing-library/react";
import { LoginForm } from "./login-form";
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			retry: false,
		},
	},
});

// Mock onboarding check
mock.module("@/lib/server/onboarding-server", () => ({
	checkOnboarding: mock(async () => ({ completed: true })),
}));

describe("LoginForm", () => {
	beforeEach(() => {
		queryClient.clear();
	});

	afterEach(() => {
		cleanup();
	});

	const renderWithClient = (ui: React.ReactElement) => {
		return render(
			<QueryClientProvider client={queryClient}>
				{ui}
			</QueryClientProvider>
		);
	};

	it("renders email input initially", () => {
		renderWithClient(<LoginForm />);
		expect(screen.getByPlaceholderText(/m@example.com/i)).toBeDefined();
		expect(screen.getByRole("button", { name: /continue/i })).toBeDefined();
	});

	it("transitions to password step when email exists", async () => {
		// Mock checkEmail to return exists: true
		mock.module("@/lib/auth", () => ({
			auth: {
				checkEmail: mock(async () => ({ isSuccess: true, data: { exists: true } })),
				signIn: mock(async () => ({ isSuccess: true })),
			},
		}));

		renderWithClient(<LoginForm />);

		const emailInput = screen.getByPlaceholderText(/m@example.com/i);
		fireEvent.change(emailInput, { target: { value: "test@example.com" } });
		fireEvent.click(screen.getByRole("button", { name: /continue/i }));

		await waitFor(() => {
			expect(screen.getByPlaceholderText(/Enter your password/i)).toBeDefined();
		});
	});

	it("shows error when email does not exist", async () => {
		// Mock checkEmail to return exists: false
		mock.module("@/lib/auth", () => ({
			auth: {
				checkEmail: mock(async () => ({ isSuccess: true, data: { exists: false } })),
			},
		}));

		renderWithClient(<LoginForm />);

		const emailInput = screen.getByPlaceholderText(/m@example.com/i);
		fireEvent.change(emailInput, { target: { value: "nonexistent@example.com" } });
		fireEvent.click(screen.getByRole("button", { name: /continue/i }));

		await waitFor(() => {
			expect(screen.getByText(/No accounts associated with this email/i)).toBeDefined();
		});
	});
});
