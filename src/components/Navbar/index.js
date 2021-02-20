import React from 'react';
import ReactGA from 'react-ga';

import NavItem from './NavItem';
import ExternalLink from '../ExternalLink';
import './index.scss';
import { navigate, withPrefix } from 'gatsby';

const NavbarClass = [
  'navbar',
  'navbar-expand-md',
  'sticky-top',
  'custom-navbar',
];

const Navbar = () => (
  <nav id="m-navbar" className={`${NavbarClass.join(' ')} navbar-night`}>
    <div className="container">
      <button
        type="button"
        className="navbar-brand btn btn-default"
        onClick={() => {
          ReactGA.event({
            category: 'User',
            action: 'Click navbar logo',
          });
          // gotoPage('/');
          navigate(withPrefix('/'));
        }}
      >
        <img src="/assets/logo3.svg" alt="Japanese IT Developer Blog tubone BOYAKI" width=135 height=45 />
      </button>
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        aria-label="navbar-toggler"
        data-target="#navbarSupportedContent"
      >
        <span className="icon-bars" />
      </button>
      <div
        className="collapse navbar-collapse flex-row-reverse"
        id="navbarSupportedContent"
      >
        <ul className="navbar-nav mr-2">
          <NavItem
            url="/tags/"
            name="Tags"
            key="/tags/"
          />
          <NavItem
            url="/about/"
            name="About"
            key="/about/"
          />
          <NavItem
            url="/contacts/"
            name="Contacts"
            key="/contacts/"
          />
          <ExternalLink className="nav-btn btn btn-link" title="Portfolio" href="https://portfolio.tubone-project24.xyz" />
          <ExternalLink className="nav-btn btn btn-link" title="Note" href="https://note.tubone-project24.xyz" />
          <ExternalLink className="nav-btn btn btn-link" title="FM" href="https://tubone24.github.io/boyakifm/" />
        </ul>
      </div>
    </div>
  </nav>
);

export default Navbar;
