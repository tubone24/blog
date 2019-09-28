import React from 'react';
import PropTypes from 'prop-types';

const Footer = props => (
  // eslint-disable-next-line react/destructuring-assignment
  <footer id="footer" style={props.timeout ? { display: 'none' } : {}}>
    <p className="copyright">
&copy; Gatsby Starter - Dimension. Design:
      <a href="https://html5up.net">HTML5 UP</a>
. Built with:
      <a href="https://www.gatsbyjs.org/">Gatsby.js</a>
    </p>
  </footer>
);

Footer.propTypes = {
  // eslint-disable-next-line react/require-default-props
  timeout: PropTypes.bool,
};

export default Footer;
