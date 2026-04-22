import { afterEach, describe, expect, it, mock } from "bun:test";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { Button } from "./button";
import React from "react";

describe("Button component", () => {
	afterEach(() => {
		cleanup();
	});

	it("renders children correctly", () => {
		render(<Button>Click me</Button>);
		expect(screen.getByText("Click me")).toBeDefined();
	});

	it("handles click events", () => {
		const handleClick = mock(() => {});
		render(<Button onClick={handleClick}>Click me</Button>);
		fireEvent.click(screen.getByText("Click me"));
		expect(handleClick).toHaveBeenCalledTimes(1);
	});

	it("applies variant classes", () => {
		const { rerender } = render(<Button variant="destructive">Destructive</Button>);
		const button = screen.getByText("Destructive");
		expect(button.getAttribute("data-variant")).toBe("destructive");
		
		rerender(<Button variant="outline">Outline</Button>);
		expect(button.getAttribute("data-variant")).toBe("outline");
	});

	it("applies size classes", () => {
		const { rerender } = render(<Button size="sm">Small</Button>);
		const button = screen.getByText("Small");
		expect(button.getAttribute("data-size")).toBe("sm");
		
		rerender(<Button size="lg">Large</Button>);
		expect(button.getAttribute("data-size")).toBe("lg");
	});

	it("is disabled when disabled prop is true", () => {
		const handleClick = mock(() => {});
		render(<Button disabled onClick={handleClick}>Disabled</Button>);
		const button = screen.getByText("Disabled");
		expect(button.hasAttribute("disabled")).toBe(true);
		fireEvent.click(button);
		expect(handleClick).toHaveBeenCalledTimes(0);
	});

	it("renders as a slot when asChild is true", () => {
		render(
			<Button asChild>
				<a href="/test">Link Button</a>
			</Button>
		);
		const link = screen.getByRole("link", { name: /link button/i });
		expect(link).toBeDefined();
		expect(link.getAttribute("href")).toBe("/test");
		expect(link.getAttribute("data-slot")).toBe("button");
	});
});
