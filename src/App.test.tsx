import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import App from "./App";

describe("App component", () => {
  it("renders the Navbar", () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    // Check for Navbar logo by alt text
    const logo = screen.getByAltText(/logo/i);
    expect(logo).toBeInTheDocument();
  });
});