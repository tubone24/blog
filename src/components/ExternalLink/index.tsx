import React from "react";

const ExternalLink = ({
  href,
  title,
  target = "_blank",
  className = "",
  rel = "external nofollow noopener",
}: {
  href: string;
  title: string;
  target?: string;
  className?: string;
  rel?: string;
}) => (
  <a href={href} rel={rel} target={target} className={className}>
    {title}
  </a>
);

export default ExternalLink;
