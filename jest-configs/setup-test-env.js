import "@testing-library/jest-dom/extend-expect";
import "jest-axe/extend-expect";

// Jest 30 compatible location mock
// jsdom 21+ made window.location non-configurable, so we can't use Object.defineProperty
// Instead, we'll delete and recreate it for each test
beforeEach(() => {
  delete window.location;
  window.location = new URL("http://localhost");
});
