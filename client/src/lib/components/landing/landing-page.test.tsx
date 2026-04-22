import { afterEach, describe, expect, it } from "bun:test";
import { cleanup, render, screen } from "@testing-library/react";
import React from "react";
import LandingPage from "./landing-page";

describe("LandingPage", () => {
	afterEach(() => {
		cleanup();
	});

	it("renders the main headline", () => {
		render(<LandingPage />);
		expect(screen.getByText(/A gentler way through/i)).toBeDefined();
		expect(screen.getByText(/stressful semesters/i)).toBeDefined();
	});

	it("renders the 'Get Started' button", () => {
		render(<LandingPage />);
		const getStartedButton = screen.getByRole("button", {
			name: /get started/i,
		});
		expect(getStartedButton).toBeDefined();
	});

	it("renders the 'I already have an account' button", () => {
		render(<LandingPage />);
		const loginButton = screen.getByRole("button", {
			name: /i already have an account/i,
		});
		expect(loginButton).toBeDefined();
	});

	it("renders the pillars", () => {
		render(<LandingPage />);
		expect(screen.getByText(/Evidence-informed/i)).toBeDefined();
		expect(screen.getByText(/Student-first/i)).toBeDefined();
		expect(screen.getByText(/Privacy-minded/i)).toBeDefined();
	});

	it("renders the navbar and footer", () => {
		render(<LandingPage />);
		// Multiple 'Serene' texts might exist (logo in nav and footer)
		expect(screen.getAllByText(/Serene/i).length).toBeGreaterThan(0);
		// Footer text
		expect(screen.getByText(/Made with/i)).toBeDefined();
		expect(screen.getByText(/for students/i)).toBeDefined();
	});
});
