import { describe, expect, it } from "bun:test";
import { MCMASTER_RESOURCES, countries, schools } from "./data";

describe("Data structures", () => {
	describe("MCMASTER_RESOURCES", () => {
		it("should have at least 5 resources", () => {
			expect(MCMASTER_RESOURCES.length).toBeGreaterThanOrEqual(5);
		});

		it("should have correct properties for each resource", () => {
			for (const resource of MCMASTER_RESOURCES) {
				expect(resource).toHaveProperty("name");
				expect(resource).toHaveProperty("url");
				expect(resource).toHaveProperty("type");
			}
		});

		it("should contain Student Wellness Centre", () => {
			const wellness = MCMASTER_RESOURCES.find(
				(r) => r.name === "Student Wellness Centre",
			);
			expect(wellness).toBeDefined();
			expect(wellness?.url).toBe("https://wellness.mcmaster.ca/");
		});
	});

	describe("countries", () => {
		it("should not be empty", () => {
			expect(countries.length).toBeGreaterThan(0);
		});

		it("should contain Canada (CA)", () => {
			const canada = countries.find((c) => c.code === "CA");
			expect(canada).toBeDefined();
			expect(canada?.name).toBe("Canada");
		});
	});

	describe("schools", () => {
		it("should be a non-empty array", () => {
			expect(Array.isArray(schools)).toBe(true);
			expect(schools.length).toBeGreaterThan(0);
		});

		it("should contain McMaster University", () => {
			const mcmaster = schools.find((s) => s.name === "McMaster University");
			expect(mcmaster).toBeDefined();
			expect(mcmaster?.city).toBe("Hamilton");
		});

		it("should contain Mohawk College", () => {
			const mohawk = schools.find((s) => s.name === "Mohawk College");
			expect(mohawk).toBeDefined();
			expect(mohawk?.city).toBe("Hamilton");
		});

		it("should have required properties for all schools", () => {
			for (const school of schools) {
				expect(school).toHaveProperty("name");
				expect(school).toHaveProperty("countryCode");
				expect(school).toHaveProperty("city");
			}
		});
	});
});
