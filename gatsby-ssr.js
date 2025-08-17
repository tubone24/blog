import React from "react";
import { HelmetProvider } from "react-helmet-async";

export const wrapRootElement = ({ element }) => {
  return <HelmetProvider>{element}</HelmetProvider>;
};
