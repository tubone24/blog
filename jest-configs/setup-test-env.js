import "@testing-library/jest-dom/extend-expect";
import "jest-axe/extend-expect";
import "jest-location-mock";

// Mock react-helmet-async for Jest
jest.mock("react-helmet-async", () => {
  const React = require("react");

  const Helmet = ({ children, defaultTitle, titleTemplate, ...otherProps }) => {
    // Filter out helmet-specific props to avoid React warnings
    const filteredProps = Object.fromEntries(
      Object.entries(otherProps).filter(
        ([key]) =>
          ![
            "defer",
            "encodeSpecialCharacters",
            "onChangeClientState",
            "prioritizeSeoTags",
          ].includes(key)
      )
    );
    return React.createElement(
      "div",
      { ...filteredProps, "data-testid": "helmet" },
      children
    );
  };

  const HelmetProvider = ({ children }) => {
    return React.createElement(
      "div",
      { "data-testid": "helmet-provider" },
      children
    );
  };

  return {
    Helmet,
    HelmetProvider,
  };
});
