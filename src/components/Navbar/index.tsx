import React from "react";
import ReactGA from "react-ga";
import { navigate, withPrefix } from "gatsby";

import NavItem from "./NavItem";
import ExternalLink from "../ExternalLink";
import "./index.scss";

const NavbarClass = [
  "navbar",
  "navbar-expand-md",
  "sticky-top",
  "custom-navbar",
];

const Navbar = () => (
  <nav
    id="m-navbar"
    className={`${NavbarClass.join(" ")} navbar-night`}
    title="navbar"
  >
    <div className="container">
      <button
        type="button"
        className="navbar-brand btn btn-default"
        onClick={() => {
          ReactGA.event({
            category: "User",
            action: "Click navbar logo",
          });
          navigate(withPrefix("/"));
        }}
      >
        <img src="/assets/logo3.svg" alt="" width="135" height="45" />
        <h1 className="visually-hidden">
          Japanese IT Developer's Blog tubone BOYAKI
        </h1>
      </button>
      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        aria-label="navbar-toggler"
        data-bs-target="#navbarSupportedContent"
      >
        <span className="icon-bars" />
      </button>
      <div
        className="collapse navbar-collapse flex-row-reverse"
        id="navbarSupportedContent"
        role="navigation"
      >
        <ul className="navbar-nav mr-2">
          <li>
            <NavItem url="/tags/" name="Tags" key="/tags/" />
          </li>
          <li>
            <NavItem url="/about/" name="About" key="/about/" />
          </li>
          <li>
            <ExternalLink
              className="nav-btn btn btn-link"
              title="Contact"
              href="https://portfolio.tubone-project24.xyz/#contact"
            />
          </li>
          <li>
            <ExternalLink
              className="nav-btn btn btn-link"
              title="Portfolio"
              href="https://portfolio.tubone-project24.xyz"
            />
          </li>
          <li>
            <ExternalLink
              className="nav-btn btn btn-link"
              title="Note"
              href="https://note.tubone-project24.xyz"
            />
          </li>
          <li>
            <ExternalLink
              className="nav-btn btn btn-link"
              title="FM"
              href="https://tubone24.github.io/boyakifm/"
            />
          </li>
        </ul>
      </div>
    </div>
  </nav>
);

export default Navbar;
