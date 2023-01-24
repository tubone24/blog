import React from "react";

import Transition from "@/components/Transition";
import Navbar from "@/components/Navbar";
import Head from "./Head";
import Footer from "@/components/Footer";
import "./index.scss";

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
