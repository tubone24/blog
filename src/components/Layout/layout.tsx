import React from "react";

import Transition from "@/components/Transition";
import Navbar from "@/components/Navbar";
import Head from "./Head";
import Footer from "@/components/Footer";
import "./index.scss";

const Layout = ({
  children,
  location,
  isPostPage,
}: {
  children: React.ReactNode;
  location: {
    pathname: string;
  };
  isPostPage?: boolean;
}) => {
  // isPostPageが明示的に渡されていない場合、pathnameから判定
  // ブログポストページは /20XX-XX-XX のようなパターンを持つ
  const isPost = isPostPage ?? /^\/20\d{2}-/.test(location.pathname);

  return (
    <div className="layout">
      <Head />
      <Navbar isPostPage={isPost} />
      <Transition location={location}>
        <div className="container-fluid">{children}</div>
      </Transition>
      <Footer />
    </div>
  );
};

export default Layout;
