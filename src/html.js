import React from 'react';
import PropTypes from 'prop-types';

const HTML = ({
  htmlAttributes,
  headComponents,
  bodyAttributes,
  preBodyComponents,
  body,
  postBodyComponents,
}) => (
  <html {...htmlAttributes} lang="ja">
    <head>
      <meta charSet="utf-8" />
      <meta httpEquiv="x-ua-compatible" content="ie=edge" />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1, shrink-to-fit=no"
      />
      {headComponents}
    </head>
    <body {...bodyAttributes}>
      {preBodyComponents}
      <div
        key="body"
        id="___gatsby"
        dangerouslySetInnerHTML={{ __html: body }}
      />
      {postBodyComponents}
      <script
        src="vendors/js/jquery-3.2.1.slim.min.js"
      />
      <script
        src="vendors/js/popper.min.js"
      />
      <script
        src="vendors/js/bootstrap.min.js"
      />
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/fancybox/3.2.1/jquery.fancybox.min.css"
      />
      <script src="vendors/js/jquery.fancybox.min.js" />
    </body>
  </html>
);

HTML.propTypes = {
  htmlAttributes: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  headComponents: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  bodyAttributes: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  preBodyComponents: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  body: PropTypes.string,
  postBodyComponents: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
};

HTML.defaultProps = {
  body: '',
  htmlAttributes: {},
  headComponents: null,
  bodyAttributes: {},
  preBodyComponents: null,
  postBodyComponents: null,
};

export default HTML;
