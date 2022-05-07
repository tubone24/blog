# Blog

[![Twitter URL](https://img.shields.io/twitter/url/https/blog.tubone-project24.xyz?style=social)](https://twitter.com/intent/tweet?text=LikeThis:&url=https%3A%2F%2Fblog.tubone-project24.xyz)
[![Netlify Status](https://api.netlify.com/api/v1/badges/3751ef40-b145-4249-9657-39d3fb04ae81/deploy-status)](https://app.netlify.com/sites/pensive-lamport-5822d2/deploys)
[![DeployToNetlifyPRD](https://github.com/tubone24/blog/workflows/DeployToNetlifyPRD/badge.svg)](https://github.com/tubone24/blog/actions?query=workflow%3ADeployToNetlifyPRD)
[![Coverage Status](https://coveralls.io/repos/github/tubone24/blog/badge.svg?branch=master)](https://coveralls.io/github/tubone24/blog?branch=master)
[![CodeFactor](https://www.codefactor.io/repository/github/tubone24/blog/badge)](https://www.codefactor.io/repository/github/tubone24/blog)
[![storybook](https://raw.githubusercontent.com/storybookjs/brand/master/badge/badge-storybook.svg)](https://blog-storybook.netlify.app/)
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
  - All Components writen by [TypeScript](https://www.typescriptlang.org/)
  - Use [Bootstrap5](https://getbootstrap.jp/) for CSS Framework
  - Use [Sass(Scss)](https://sass-lang.com/) and Scoped by CSS Modules
  - All articles (Datasource) made by [Markdown](https://www.markdown.jp/what-is-markdown/) and save to this repository
- For Search Engine Optimization, generate header meta tag and OGP
- High Performance, purge CSS to Bootstrap, optimise SVG and minify HTML, CSS and JS
- Google Analytics ~~v3, planning to update to~~ v4
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

- Use [ESLint](https://eslint.org/) and [stylelint](https://stylelint.io/) for lint codes
- Use [EditorConfig](https://editorconfig.org/) formatting and indent
- Use [husky](https://typicode.github.io/husky/#/) run linter before git commit and push
- Use [Jest](https://jestjs.io/ja/) and [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) for Unit and React Component testing
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

```mermaid
flowchart TB
CreateMarkdown -->|WriteArticle| PushMarkdown
PushMarkdown --->|CreatePullRequest| DeployPreview
EditArticle --->|PushMarkdown| DeployPreview
DeployPreview --->|CheckArticle| EditArticle
DeployPreview --->|ReviewOthersArticle| Approved
Approved --->|Merge| DeployProduction
```

## How to develop?

Run at local, execute commands below, and access [http://localhost:8000](http://localhost:8000)

```
$ npm install
$ npm start
```

Or Build Artifact, execute commands below

```
npm run build
```

Fix your code format by TSC, [ESLint](https://eslint.org/) and  [stylelint](https://stylelint.io/)

```
npm run typecheck
npm run format:fix
npm run format-style:fix
```

Testing React Component and Unit testing, execute commands below

And also, you can test Storybook Snapshot test!

```
npm test
npm run test:storybook
npm run test:e2e
```

If you error occurred on gatsby build, execute commands below

```
> Error loading a result for the page query in "/". Query was not run and no cached result was found.

npm run clean
```

## Update Browsers List

```
npm run browserslist:update
```

## Environment variables

Copy `.env.example` to create the `.env` file

```
cp .env.example .env
```

| Key                              | Description                                              | Default | 
| -------------------------------- | -------------------------------------------------------- | ------- | 
| GATSBY_ALGOLIA_ADMIN_API_KEY     | Algolia search's ADMIN API KEY, use index post content   | -       | 
| GATSBY_ALGOLIA_APP_ID            | Algolia search's APP ID                                  | -       | 
| GATSBY_ALGOLIA_INDEX_NAME        | Algolia search's index name                              | posts   | 
| GATSBY_ALGOLIA_SEARCH_API_KEY    | Algolia search's search API KEY, use view search on site | -       | 
| STORYBOOK_ALGOLIA_APP_ID         | Algolia search's ADMIN API KEY, use index post content   | -       | 
| STORYBOOK_ALGOLIA_INDEX_NAME     | Algolia search's APP ID                                  | posts   | 
| STORYBOOK_ALGOLIA_SEARCH_API_KEY | Algolia search's index name                              | -       | 
| GATSBY_GITHUB_CLIENT_ID          | GitHub oAuth Client ID, use Gitalk                       | -       | 
| GATSBY_GITHUB_CLIENT_SECRET      | GitHub oAuth Client Secret, use Gitalk                   | -       | 
| FAUNADB_SERVER_SECRET            | FaunaDB's Secret, use FaunaDB                            | -       | 

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
