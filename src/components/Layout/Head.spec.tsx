import { render } from "@testing-library/react";
import React from "react";
import { HelmetProvider } from "react-helmet-async";

import Head from "./Head";

describe("Head", () => {
  it("renders without crashing", () => {
    const { container } = render(
      <HelmetProvider>
        <Head />
      </HelmetProvider>,
    );

    // HelmetProviderでラップされたコンポーネントが正常にレンダリングされることを確認
    expect(container).toBeInTheDocument();
  });
});
