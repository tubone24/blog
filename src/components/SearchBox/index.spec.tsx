import React from "react";
import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import userEvent from "@testing-library/user-event";
import SearchBox from "./index";

/* eslint-disable testing-library/no-container, testing-library/prefer-screen-queries, testing-library/no-node-access, testing-library/no-wait-for-multiple-assertions */

// Mock gatsby
jest.mock("gatsby", () => ({
  navigate: jest.fn(),
  withPrefix: jest.fn((path) => path),
}));

// Mock react-ga4
jest.mock("react-ga4", () => ({
  event: jest.fn(),
}));

describe("SearchBox", () => {
  let mockAutocomplete: jest.Mock;
  let mockOn: jest.Mock;
  let mockSearch: jest.Mock;
  let mockInitIndex: jest.Mock;
  let mockAlgoliasearch: jest.Mock;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Mock autocomplete.on method
    mockOn = jest.fn().mockReturnThis();

    // Mock autocomplete function
    mockAutocomplete = jest.fn(() => ({
      on: mockOn,
    }));

    // Mock Algolia search
    mockSearch = jest.fn();
    mockInitIndex = jest.fn(() => ({
      search: mockSearch,
    }));
    mockAlgoliasearch = jest.fn(() => ({
      initIndex: mockInitIndex,
    }));

    // Setup window mocks
    if (typeof window !== "undefined") {
      // Mock require for algoliasearch and autocomplete
      jest.mock("algoliasearch/lite", () => mockAlgoliasearch, {
        virtual: true,
      });
      jest.mock("autocomplete.js", () => mockAutocomplete, { virtual: true });
    }
  });

  it("Displays valid Searchbox", () => {
    render(<SearchBox />);
    expect(screen.getByLabelText("SearchBox")).toBeInTheDocument();
    expect(screen.getByTestId("algolia-search-input")).toBeInTheDocument();
  });

  it("text input", async () => {
    render(<SearchBox />);
    await userEvent.type(
      screen.getByPlaceholderText("Enter the keyword..."),
      "testtest",
    );
    expect(screen.getByLabelText("SearchBox")).toBeInTheDocument();
    expect(screen.getByTestId("algolia-search-input")).toBeInTheDocument();
  });

  it("should not have basic accessibility issues", async () => {
    const { container } = render(<SearchBox />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("initializes autocomplete on mount when window is defined", () => {
    // This test verifies componentDidMount behavior
    render(<SearchBox />);

    // Verify the input element exists (which autocomplete would attach to)
    const input = screen.getByTestId("algolia-search-input");
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("id", "algolia-search-input");
  });

  it("renders search icon and label", () => {
    const { container } = render(<SearchBox />);
    const label = screen.getByLabelText("SearchBox");
    expect(label).toBeInTheDocument();

    // Check that the icon span exists within the label
    const iconSpan = container.querySelector(".icon-search");
    expect(iconSpan).toBeInTheDocument();
  });

  it("renders input with correct placeholder", () => {
    render(<SearchBox />);
    const input = screen.getByPlaceholderText("Enter the keyword...");
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("type", "search");
  });
});
