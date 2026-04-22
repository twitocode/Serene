import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "bun:test";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "./form";
import { Input } from "./input";

describe("Form components", () => {
	afterEach(() => {
		cleanup();
	});

	it("renders a basic form field correctly", () => {
		render(
			<Form>
				<FormField name="test" error={undefined}>
					<FormItem>
						<FormLabel>Username</FormLabel>
						<FormControl>
							<Input placeholder="Enter username" />
						</FormControl>
						<FormDescription>Your public display name.</FormDescription>
						<FormMessage />
					</FormItem>
				</FormField>
			</Form>,
		);

		expect(screen.getByText("Username")).toBeDefined();
		expect(screen.getByPlaceholderText("Enter username")).toBeDefined();
		expect(screen.getByText("Your public display name.")).toBeDefined();
	});

	it("displays error message when error is provided", () => {
		render(
			<Form>
				<FormField name="test" error="Username is required">
					<FormItem>
						<FormLabel>Username</FormLabel>
						<FormControl>
							<Input placeholder="Enter username" />
						</FormControl>
						<FormMessage />
					</FormItem>
				</FormField>
			</Form>,
		);

		const errorMessage = screen.getByText("Username is required");
		expect(errorMessage).toBeDefined();
		expect(errorMessage.getAttribute("data-slot")).toBe("form-message");

		const input = screen.getByPlaceholderText("Enter username");
		expect(input.getAttribute("aria-invalid")).toBe("true");
	});

	it("associates label and description with input via ARIA attributes", () => {
		render(
			<Form>
				<FormField name="test">
					<FormItem>
						<FormLabel>Username</FormLabel>
						<FormControl>
							<Input placeholder="Enter username" />
						</FormControl>
						<FormDescription>Your public display name.</FormDescription>
					</FormItem>
				</FormField>
			</Form>,
		);

		const input = screen.getByPlaceholderText("Enter username");
		const label = screen.getByText("Username");
		const description = screen.getByText("Your public display name.");

		// FormItem generates a unique ID, let's verify attributes exist
		expect(input.getAttribute("id")).toBeDefined();
		expect(label.getAttribute("for")).toBe(input.getAttribute("id"));
		expect(input.getAttribute("aria-describedby")).toContain(
			description.getAttribute("id") || "",
		);
	});

	it("updates aria-describedby when error is present", () => {
		render(
			<Form>
				<FormField name="test" error="Invalid input">
					<FormItem>
						<FormLabel>Username</FormLabel>
						<FormControl>
							<Input placeholder="Enter username" />
						</FormControl>
						<FormDescription>Description</FormDescription>
						<FormMessage />
					</FormItem>
				</FormField>
			</Form>,
		);

		const input = screen.getByPlaceholderText("Enter username");
		const description = screen.getByText("Description");
		const message = screen.getByText("Invalid input");

		const ariaDescribedBy = input.getAttribute("aria-describedby") || "";
		expect(ariaDescribedBy).toContain(description.getAttribute("id") || "");
		expect(ariaDescribedBy).toContain(message.getAttribute("id") || "");
	});
});
