import React from "react";

interface LinkProps {
  to: string;
  className?: string;
  title?: string;
  children: React.ReactNode;
  onClick?: () => void;
}

// gatsby Link の置き換え（<a>ラッパー）
const Link = ({ to, className, title, children, onClick }: LinkProps) => (
  <a href={to} className={className} title={title} onClick={onClick}>
    {children}
  </a>
);

export default Link;
