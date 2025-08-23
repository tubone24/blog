import React from 'react'

// Mock Gatsby's Link component
export const Link = ({ to, children, ...props }) =>
  React.createElement('a', { href: to, ...props }, children)

// Mock navigate
export const navigate = () => {}

// Mock withPrefix
export const withPrefix = (path) => path

// Mock graphql
export const graphql = () => {}

// Mock StaticQuery
export const StaticQuery = ({ render, data }) => render(data)

// Mock useStaticQuery
export const useStaticQuery = () => ({})

// Mock Head component
export const Head = ({ children }) => children

// Default export for gatsby module
export default {
  Link,
  navigate,
  withPrefix,
  graphql,
  StaticQuery,
  useStaticQuery,
  Head,
}