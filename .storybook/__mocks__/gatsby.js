import React from "react"

export const graphql = () => {}

export const Link = ({ activeClassName, activeStyle, getProps, innerRef, partiallyActive, ref, replace, to, ...rest }) =>
  React.createElement("a", { ...rest, href: to })

export const StaticQuery = ({ children }) => children({})

export const useStaticQuery = () => ({})

export const navigate = () => {}

export const withPrefix = (p) => (p && p.startsWith("/") ? p : `/${p || ""}`)

export const Script = ({ children, ...props }) =>
  React.createElement("script", props, children)

export const Slice = ({ alias, ...props }) =>
  React.createElement("div", { "data-slice": alias, ...props })

export const ScriptStrategy = {
  postHydrate: "post-hydrate",
  idle: "idle",
  offMainThread: "off-main-thread",
}
