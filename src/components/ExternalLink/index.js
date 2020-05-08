import React from 'react';

const ExternalLink = ({
  href, title, target, className, rel,
}) => (
  <a href={href} rel={rel} target={target} className={className}>
    {title}
  </a>
);

ExternalLink.defaultProps = {
  target: '_blank',
  className: '',
  rel: 'external nofollow noopener',
};

export default ExternalLink;
