import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import Navbar from "./Navbar"
import { navLinks }  from "./Navbar"


const renderNavbar = () =>
  render(
    <MemoryRouter>
      <Navbar />
    </MemoryRouter>
  );

describe("Navbar Component", () => {
  it("renders correct number of navlink buttons with correct links & titles", () => {
    renderNavbar();

    const renderedLinks = screen.getAllByRole("link");

    // Assert link count matches.
    expect(renderedLinks).toHaveLength(navLinks.length);

    // Loop over each navLink, and ensure the title and link destination match.
    navLinks.forEach((navLink, index) => {
      expect(renderedLinks[index]).toHaveTextContent(navLink.label);
	  expect(renderedLinks[index]).toHaveAttribute("href", navLink.to);
    });
  });
});
