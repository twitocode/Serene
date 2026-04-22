import { afterEach, beforeEach, describe, expect, it, mock } from "bun:test";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
	cleanup,
	fireEvent,
	render,
	screen,
	waitFor,
} from "@testing-library/react";
import type React from "react";
import { SignupForm } from "./signup-form";

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

describe("SignupForm", () => {
	beforeEach(() => {
		queryClient.clear();
	});

	afterEach(() => {
		cleanup();
	});

	const renderWithClient = (ui: React.ReactElement) => {
		return render(
			<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>,
		);
	};

	it("renders email input initially", () => {
		renderWithClient(<SignupForm />);
		expect(screen.getByPlaceholderText(/m@example.com/i)).toBeDefined();
		expect(screen.getByRole("button", { name: /continue/i })).toBeDefined();
	});

	it("transitions to password step when email does not exist", async () => {
		// Mock checkEmail to return exists: false
		mock.module("@/lib/auth", () => ({
			auth: {
				checkEmail: mock(async () => ({
					isSuccess: true,
					data: { exists: false },
				})),
				signUp: mock(async () => ({ isSuccess: true })),
			},
		}));

		renderWithClient(<SignupForm />);

		const emailInput = screen.getByPlaceholderText(/m@example.com/i);
		fireEvent.change(emailInput, { target: { value: "newuser@example.com" } });
		fireEvent.click(screen.getByRole("button", { name: /continue/i }));

		await waitFor(() => {
			expect(screen.getByLabelText(/Password/i)).toBeDefined();
			expect(screen.getByPlaceholderText(/Enter your password/i)).toBeDefined();
		});
	});

	it("shows error when email already exists", async () => {
		// Mock checkEmail to return exists: true
		mock.module("@/lib/auth", () => ({
			auth: {
				checkEmail: mock(async () => ({
					isSuccess: true,
					data: { exists: true },
				})),
			},
		}));

		renderWithClient(<SignupForm />);

		const emailInput = screen.getByPlaceholderText(/m@example.com/i);
		fireEvent.change(emailInput, { target: { value: "existing@example.com" } });
		fireEvent.click(screen.getByRole("button", { name: /continue/i }));

		await waitFor(() => {
			expect(screen.getByText(/Account already exists/i)).toBeDefined();
		});
	});
});
