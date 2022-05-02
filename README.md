# Blog

[![Twitter URL](https://img.shields.io/twitter/url/https/blog.tubone-project24.xyz?style=social)](https://twitter.com/intent/tweet?text=LikeThis:&url=https%3A%2F%2Fblog.tubone-project24.xyz)
[![Netlify Status](https://api.netlify.com/api/v1/badges/3751ef40-b145-4249-9657-39d3fb04ae81/deploy-status)](https://app.netlify.com/sites/pensive-lamport-5822d2/deploys)
[![DeployToNetlifyPreview](https://github.com/tubone24/blog/workflows/DeployToNetlifyPreview/badge.svg)](https://github.com/tubone24/blog/actions?query=workflow%3ADeployToNetlifyPreview)
[![DeployToNetlifyPRD](https://github.com/tubone24/blog/workflows/DeployToNetlifyPRD/badge.svg)](https://github.com/tubone24/blog/actions?query=workflow%3ADeployToNetlifyPRD)
[![CodeFactor](https://www.codefactor.io/repository/github/tubone24/blog/badge)](https://www.codefactor.io/repository/github/tubone24/blog)
[![time tracker](https://wakatime.com/badge/github/tubone24/blog.svg)](https://wakatime.com/badge/github/tubone24/blog)
<a href="https://validator.w3.org/feed/check.cgi?url=https%3A//blog.tubone-project24.xyz/rss.xml"><img src="https://validator.w3.org/feed/images/valid-rss-rogers.png" alt="[Valid RSS]" title="Validate my RSS feed" /></a>
[![websiteup](https://img.shields.io/website.svg?down_color=red&down_message=down&up_color=green&up_message=up&url=https%3A%2F%2Fblog.tubone-project24.xyz)](https://blog.tubone-project24.xyz)

## What is this?

This is tubone's Blog by Gatsby and Netlify.

[https://blog.tubone-project24.xyz/](https://blog.tubone-project24.xyz/)

![Home Page](https://i.imgur.com/NyU0Bhy.png)

### Templated by?

[Gatsby Starter - Calpa's Blog](https://github.com/calpa/gatsby-starter-calpa-blog])

Special, thanks!

## Features

#### Structure

- Gatsby.js v4, Static site generating
  - Use [Preact](https://preactjs.com/), faster than [React](https://ja.reactjs.org/)
  - All Components writen by TypeScript
  - Use [Bootstrap5](https://getbootstrap.jp/) for CSS Framework
  - Use [Sass(Scss)](https://sass-lang.com/) and Scoped by CSS Modules
  - All articles (Datasource) made by [Markdown](https://www.markdown.jp/what-is-markdown/) and save to this repository
- For Search Engine Optimization, generate header meta tag and OGP
- High Performance, purge CSS to Bootstrap, optimise SVG and minify HTML, CSS and JS
- Google Analytics v3, planning to update to v4
- Site searching by Algolia search
- Code syntax highlighting by [Prism.js](https://prismjs.com/)
- PWA Support, and prefetch page-data.json
- Deploy Netlify
- Image hosted by [imgur](https://imgur.com)
- Use [Gitalk](https://gitalk.github.io/) for blog comment system
- Icons used by Fontawesome, and optimised to [Icomoon](https://icomoon.io/)
- Sitemap generate
- RSS feed generate
- Compliant with [a11y](https://waic.jp/docs/WCAG20/Overview.html), top page Lighthouse's accessibility score is 100!
- Use [Sentry](https://sentry.io/welcome/) for detecting error and check performance

#### For Developer

- Use [ESLint](https://eslint.org/) and [stylelint](https://stylelint.io/) for format codes
- Use [EditorConfig](https://editorconfig.org/)
- Use [Cypress](https://www.cypress.io/) for End-To-End testing
- Components managed by [Storybook](#storybook)
  - Generate all preview-deploy and production-deploy
- Each production-deploy is measured by [Lighthouse](#Lighthouse) and [reports](https://tubone24.github.io/blog/lh/report.html) are output
- Each production-deploy is measured by [Bundle Analyzer](#bundle-analyzer) and [reports](https://tubone24.github.io/blog/ba/index.html) are output
- unused dependencies check by [depcheck](https://www.npmjs.com/package/depcheck) in [depcheck_action](https://github.com/tubone24/depcheck_action)
- Update dependencies by [Renovate](https://www.whitesourcesoftware.com/free-developer-tools/renovate/)

#### For contributor of articles

- Post articles in `/src/content/*.md`, and Create [GitHub Pull Request](https://docs.github.com/ja/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/about-pull-requests) to master branch
  - Deploy netlify in preview environment and check your articles
- Or use [Netlify CMS](https://www.netlifycms.org/) in `/admin/`
- Use [textlint](#textlint) before merge master by GitHub Actions

## How to develop?

Run at local, execute commands below, and access [http://localhost:8000](http://localhost:8000)

```
$ npm install
$ npm start
```

## CI/CD

This repository uses GitHub Actions as CI. There are two workflows, one for preview deployments and one for production deployments.

[![DeployToNetlifyPreview](https://github.com/tubone24/blog/workflows/DeployToNetlifyPreview/badge.svg)](https://github.com/tubone24/blog/actions?query=workflow%3ADeployToNetlifyPreview)
[![DeployToNetlifyPRD](https://github.com/tubone24/blog/workflows/DeployToNetlifyPRD/badge.svg)](https://github.com/tubone24/blog/actions?query=workflow%3ADeployToNetlifyPRD)

## Code with Codesandbox

Use the button below to code with the blog system:

[![Edit blog](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/github/tubone24/blog/tree/master/)

## Storybook

The components used in my blog are managed using Storybook.

<https://blog-storybook.netlify.app/>

![storybook](https://i.imgur.com/I5euw3q.png)

## Lighthouse

After production deploy, Run and report Lighthouse.

<https://tubone24.github.io/blog/lh/report.html>

## Bundle Analyzer

After production deploy, Run and report Bundle Analyzer.

<https://tubone24.github.io/blog/ba/index.html>

## Deploy at Netlify

Push the button below.

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/tubone24/blog)

## textlint

I use [textlint](https://textlint.github.io/) to proofread my blog text.

```
npm run textlint
```
