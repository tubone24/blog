import React from "react";

const gatsby = jest.requireActual("gatsby");

module.exports = {
  ...gatsby,
  graphql: jest.fn(),
  Link: jest.fn().mockImplementation(
    // these props are invalid for an `a` tag
    ({
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      activeClassName,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      activeStyle,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      getProps,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      innerRef,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      partiallyActive,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      ref,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      replace,
      to,
      ...rest
    }) =>
      React.createElement("a", {
        ...rest,
        href: to,
      })
  ),
  navigate: jest.fn(),
  StaticQuery: jest.fn(),
  useStaticQuery: jest.fn(),
};
