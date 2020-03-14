import React from 'react';
import PropTypes from 'prop-types';

const Header = (props) => (
  // eslint-disable-next-line react/destructuring-assignment
  <header id="header" style={props.timeout ? { display: 'none' } : {}}>
    <div className="logo">
      <span className="icon fa-diamond" />
    </div>
    <div className="content">
      <div className="inner">
        <h1>Dimension</h1>
        <p>
A fully responsive site template designed by
          <a href="https://html5up.net">HTML5 UP</a>
          {' '}
and released
          <br />

                for free under the
          <a href="https://html5up.net/license">Creative Commons</a>
          {' '}
license.
        </p>
      </div>
    </div>
    <nav>
      <ul>
        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid,no-script-url */}
        <li><a href="javascript:;" onClick={() => { props.onOpenArticle('intro'); }}>Intro</a></li>
        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid,no-script-url */}
        <li><a href="javascript:;" onClick={() => { props.onOpenArticle('work'); }}>Work</a></li>
        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid,no-script-url */}
        <li><a href="javascript:;" onClick={() => { props.onOpenArticle('about'); }}>About</a></li>
        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid,no-script-url */}
        <li><a href="javascript:;" onClick={() => { props.onOpenArticle('contact'); }}>Contact</a></li>
      </ul>
    </nav>
  </header>
);

Header.propTypes = {
  // eslint-disable-next-line react/require-default-props
  onOpenArticle: PropTypes.func,
  // eslint-disable-next-line react/require-default-props
  timeout: PropTypes.bool,
};

export default Header;
