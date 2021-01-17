import React from 'react';
import ReactGA from 'react-ga';

import NavItem from './NavItem';
import ExternalLink from '../ExternalLink';
import { gotoPage } from '../../api/url';
import './index.scss';
import { config } from '../../../data';

const { navbarList = [] } = config;

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
          gotoPage('/');
        }}
      >
        <img src="/assets/logo3.svg" alt="Japanese IT Developer Blog tubone BOYAKI" />
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
          {navbarList.map((item) => (
            <NavItem
              url={item.href}
              name={item.title}
              list={item.list}
              key={item.href}
            />
          ))}
          <ExternalLink className="nav-btn btn btn-link" title="Portfolio" href="https://portfolio.tubone-project24.xyz" />
          <ExternalLink className="nav-btn btn btn-link" title="Note" href="https://note.tubone-project24.xyz" />
          <ExternalLink className="nav-btn btn btn-link" title="FM" href="https://tubone24.github.io/boyakifm/" />
        </ul>
      </div>
    </div>
  </nav>
);

export default Navbar;
