import React from "react";

import Transition from "@/components/Transition";
import Navbar from "@/components/Navbar";
import Head from "./Head";
import Footer from "@/components/Footer";
import "./index.scss";

if (typeof window !== "undefined") {
  // Make scroll behavior of internal links smooth
  // eslint-disable-next-line global-require,@typescript-eslint/no-var-requires
  require("smooth-scroll")("a", { offset: 60 });
}

const Layout = ({
  children,
  location,
}: {
  children: React.ReactNode;
  location: {
    pathname: string;
  };
}) => (
  <div className="layout">
    <Head />
    <Navbar />
    <Transition location={location}>
      <div className="container-fluid">{children}</div>
    </Transition>
    <Footer />
  </div>
);

export default Layout;
