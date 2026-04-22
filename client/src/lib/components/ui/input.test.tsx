import { afterEach, describe, expect, it, mock } from "bun:test";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { Input } from "./input";
import React from "react";

describe("Input component", () => {
	afterEach(() => {
		cleanup();
	});

	it("renders correctly", () => {
		render(<Input placeholder="Enter text" />);
		const input = screen.getByPlaceholderText("Enter text");
		expect(input).toBeDefined();
		expect(input.getAttribute("data-slot")).toBe("input");
	});

	it("handles user input", () => {
		const handleChange = mock(() => {});
		render(<Input onChange={handleChange} placeholder="Enter text" />);
		const input = screen.getByPlaceholderText("Enter text");
		fireEvent.change(input, { target: { value: "Hello" } });
		expect(handleChange).toHaveBeenCalledTimes(1);
		// Note: Since this is a controlled vs uncontrolled component test, 
		// we just check if the event was fired.
	});

	it("supports different types", () => {
		render(<Input type="password" placeholder="Password" />);
		const input = screen.getByPlaceholderText("Password");
		expect(input.getAttribute("type")).toBe("password");
	});

	it("can be disabled", () => {
		render(<Input disabled placeholder="Disabled input" />);
		const input = screen.getByPlaceholderText("Disabled input");
		expect(input.hasAttribute("disabled")).toBe(true);
	});

	it("applies custom className", () => {
		render(<Input className="custom-class" placeholder="Input" />);
		const input = screen.getByPlaceholderText("Input");
		expect(input.className).toContain("custom-class");
	});
});
