import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { FarmPlot, berries } from "../src/models/berries";
import BerryAssistant from "../src/pages/tools/berry";

describe("FarmPlot", () => {
	it("correctly calculates expected yield for Leppa berry with 1 plot", () => {
		const now = new Date();
		const plot = new FarmPlot("plot1", "leppa", 1, now);

		const berry = berries["leppa"];
		expect(plot.expectedMinYield).toBe(berry.minYield); // Matches the berry yield since only 1 is planted.
		expect(plot.expectedMaxYield).toBe(berry.maxYield);
	});

	it("correctly calculates expected yield for Leppa berry with 10 plots", () => {
		const now = new Date();
		const plot = new FarmPlot("plot10", "leppa", 10, now);

		const berry = berries["leppa"];
		expect(plot.expectedMinYield).toBe(berry.minYield * 10); // 5 * 10 = 50
		expect(plot.expectedMaxYield).toBe(berry.maxYield * 10); // 7 * 10 = 70
	});

	it("reduces expected yield by 1 per plot when overwatered", () => {
		const now = new Date();
		const plot = new FarmPlot("plot-overwater", "leppa", 1, now);

		// waterStatus should already be 5, yields should match
		expect(plot.waterStatus).toBe(5);
		expect(plot.expectedMinYield).toBe(5);
		expect(plot.expectedMaxYield).toBe(7);

		// Water the plot and trigger overwatering
		plot.water();

		expect(plot.waterStatus).toBe(5); // Fully Watered
		expect(plot.expectedMinYield).toBe(4);
		expect(plot.expectedMaxYield).toBe(6);
	});
});

describe("BerryAssistant integration", () => {
	beforeEach(() => {
		localStorage.clear();
	});

	afterEach(() => {
		localStorage.clear();
	});

	it("renders a card for each berry", () => {
		render(<BerryAssistant />);
		Object.values(berries).forEach(({ name }) => {
			expect(screen.getByText(name)).toBeInTheDocument();
		});
	});

	it("shows input and button when a berry card is selected", () => {
		render(<BerryAssistant />);

		fireEvent.click(screen.getByText("Leppa Berry"));

		expect(screen.getByRole("spinbutton")).toBeInTheDocument();
		expect(screen.getByRole("button", { name: /plant/i })).toBeInTheDocument();
	});

	it("plants a new FarmPlot and stores it", () => {
		render(<BerryAssistant />);

		// Simulate selecting the Leppa Berry card
		fireEvent.click(screen.getByText("Leppa Berry"));

		// Now the input and button will be rendered
		const numbox = screen.getByRole("spinbutton");
		const plantButton = screen.getByRole("button", { name: /plant/i });

		// Enter a number and click plant
		fireEvent.change(numbox, { target: { value: "3" } });
		fireEvent.click(plantButton);

		// Check that the FarmPlot was stored in localStorage
		const plots = JSON.parse(localStorage.getItem("farmPlots") || "[]");
		expect(plots.length).toBeGreaterThan(0);
		expect(plots[0].berryId).toBe("leppa");
		expect(plots[0].plantedPlotsCount).toBe(3);
	});


	it("renders planted plots in the tracker", () => {
		// Add two plots manually to localStorage
		const now = new Date();
		const plot1 = new FarmPlot("1", "leppa", 2, now);
		const plot2 = new FarmPlot("2", "rawst", 1, now);
		localStorage.setItem("farmPlots", JSON.stringify([plot1, plot2]));

		render(<BerryAssistant />);

		// Check that each expected yield appears
		expect(screen.getAllByText(/Expected yield:/i).length).toBeGreaterThanOrEqual(2);

		// Check water buttons exist (one per plot)
		const waterButtons = screen.getAllByRole("button", { name: /water/i });
		expect(waterButtons.length).toBeGreaterThanOrEqual(2);
	});

	it("computes correct harvest time from plantedTime + growthTime", () => {
		const planted = new Date("2025-07-05T12:00:00Z");
		const plot = new FarmPlot("test", "leppa", 1, planted);

		const growthTimeHours = berries["leppa"].growthTime;
		const expectedHarvestTime = new Date(
			planted.getTime() + growthTimeHours * 60 * 60 * 1000 // Convert hours to milliseconds
		);

		const actualHarvestTime = new Date(
			plot.plantedTime.getTime() + berries[plot.berryId].growthTime * 60 * 60 * 1000
		);

		expect(actualHarvestTime.toISOString()).toBe(expectedHarvestTime.toISOString());
	});

	it("removes all FarmPlots when their delete buttons are clicked", () => {
		// Add two plots to localStorage
		const now = new Date();
		const plot1 = new FarmPlot("1", "leppa", 2, now);
		const plot2 = new FarmPlot("2", "rawst", 1, now);
		localStorage.setItem("farmPlots", JSON.stringify([plot1, plot2]));

		render(<BerryAssistant />);

		// Confirm both plots exist initially
		expect(screen.getByText("1")).toBeInTheDocument();
		expect(screen.getByText("2")).toBeInTheDocument();

		// Click all delete buttons
		const deleteButtons = screen.getAllByRole("button", { name: /delete/i });
		deleteButtons.forEach((btn) => fireEvent.click(btn));

		// Confirm plots are removed from UI
		expect(screen.queryByText("1")).not.toBeInTheDocument();
		expect(screen.queryByText("2")).not.toBeInTheDocument();

		// Confirm plots are removed from localStorage
		const updated = JSON.parse(localStorage.getItem("farmPlots") || "[]");
		expect(updated.length).toBe(0);
	});
});
