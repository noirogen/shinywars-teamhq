import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { FarmPlot, berries } from "../src/models/berries";
import { MemoryRouter } from "react-router";
import BerrySelector from "../src/components/BerrySelector";
import BerryTracker from "../src/components/BerryTracker";

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

describe("BerrySelector", () => {
	beforeEach(() => {
		localStorage.clear();
	});

	afterEach(() => {
		localStorage.clear();
	});

	it("renders a card for each berry in the berries map", () => {
		render(<BerrySelector />);
		
		Object.values(berries).forEach(({ name, minYield, maxYield }) => {
			// Check berry name is rendered
			expect(screen.getByText(name)).toBeInTheDocument();
			// Check expected yield string is rendered
			expect(
			screen.getByText(`Expected yield: ${minYield} - ${maxYield}`)
			).toBeInTheDocument();
		});

		// Check input and button presence (assuming one set per berry or globally)
		expect(screen.getByRole("textbox")).toBeInTheDocument();
		expect(screen.getByRole("button", { name: /plant/i })).toBeInTheDocument();
	});

	it("plants a new FarmPlot and stores it", () => {
		render(<BerrySelector />);

		const textbox = screen.getByRole("textbox");
		const plantButton = screen.getByRole("button", { name: /plant/i });

		fireEvent.change(textbox, { target: { value: "3" } });
		fireEvent.click(plantButton);

		// Verify that the data was stored correctly.
		const plots = JSON.parse(localStorage.getItem("farmPlots") || "[]");
		expect(plots.length).toBeGreaterThan(0);
		expect(plots[0].berryId).toBe("leppa");
		expect(plots[0].plantedPlotsCount).toBe(3);
	});
});

describe("BerryTracker", () => {
	beforeEach(() => {
		const now = new Date();
		const plot1 = new FarmPlot("1", "leppa", 2, now);
		const plot2 = new FarmPlot("2", "rawst", 1, now);
		localStorage.setItem("farmPlots", JSON.stringify([plot1, plot2]));
	});

	afterEach(() => {
		localStorage.clear();
	});

	it("renders a card for each FarmPlot in localStorage", () => {
		render(<BerryTracker />);
		
		// Check expected yield text appears (at least once)
		expect(screen.getAllByText(/Expected yield:/i).length).toBeGreaterThanOrEqual(2);
		
		// Check water buttons exist (one per plot)
		const waterButtons = screen.getAllByRole("button", { name: /water/i });
		expect(waterButtons.length).toBeGreaterThanOrEqual(2);
	});

	it("calls water() method when water button clicked", () => {
		// Spy on the water() function, to ensure it is called when the button is pressed.
		const waterSpy = vi.spyOn(FarmPlot.prototype, "water");

		render(<BerryTracker />);

		const buttons = screen.getAllByRole("button", { name: /water/i });
		fireEvent.click(buttons[0]);

		expect(waterSpy).toHaveBeenCalledTimes(1);

		waterSpy.mockRestore();
	});
});