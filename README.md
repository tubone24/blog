# Blog

> Super powerfully all-packaged blog system

[![Twitter URL](https://img.shields.io/twitter/url/https/blog.tubone-project24.xyz?style=social)](https://twitter.com/intent/tweet?text=LikeThis:&url=https%3A%2F%2Fblog.tubone-project24.xyz)
[![Netlify Status](https://api.netlify.com/api/v1/badges/3751ef40-b145-4249-9657-39d3fb04ae81/deploy-status)](https://app.netlify.com/sites/pensive-lamport-5822d2/deploys)
[![DeployToNetlifyPRD](https://github.com/tubone24/blog/workflows/DeployToNetlifyPRD/badge.svg)](https://github.com/tubone24/blog/actions?query=workflow%3ADeployToNetlifyPRD)
[![Coverage Status](https://coveralls.io/repos/github/tubone24/blog/badge.svg?branch=master)](https://coveralls.io/github/tubone24/blog?branch=master)
[![CodeFactor](https://www.codefactor.io/repository/github/tubone24/blog/badge)](https://www.codefactor.io/repository/github/tubone24/blog)
[![storybook](https://raw.githubusercontent.com/storybookjs/brand/master/badge/badge-storybook.svg)](https://blog-storybook.netlify.app/)
[![time tracker](https://wakatime.com/badge/github/tubone24/blog.svg)](https://wakatime.com/badge/github/tubone24/blog)
<a href="https://validator.w3.org/feed/check.cgi?url=https%3A//blog.tubone-project24.xyz/rss.xml"><img src="https://validator.w3.org/feed/images/valid-rss-rogers.png" alt="[Valid RSS]" title="Validate my RSS feed" /></a>
![blog Actions](https://api.meercode.io/badge/tubone24/blog?type=ci-score&lastDay=184)
[![websiteup](https://img.shields.io/website.svg?down_color=red&down_message=down&up_color=green&up_message=up&url=https%3A%2F%2Fblog.tubone-project24.xyz)](https://blog.tubone-project24.xyz)
[![Buy me a coffee](https://camo.githubusercontent.com/3c1dd7a8a20dafe2a0b9b3b14ddaec4b63f73060625d1456761e9fd2e71f82bc/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f42794d6541436f666665652d7475626f6e6532342d627269676874677265656e3f6c6f676f3d4275792532304d6525323041253230436f66666565)](https://www.buymeacoffee.com/tubone24)

## What is this?

This is tubone's Blog by Gatsby and Netlify.

[https://blog.tubone-project24.xyz/](https://blog.tubone-project24.xyz/)

## Preview

[Screenshots](https://github.com/tubone24/blog/tree/screenshot) from the last deployment on the master branch.

### Desktop

Width 1200px

![Desktop Home](https://raw.githubusercontent.com/tubone24/blog/screenshot/docs/screenshot/master/screenshot-ubuntu-latest-1200.png)

### Mobile

Width 400px

<img src="https://github.com/tubone24/blog/blob/screenshot/docs/screenshot/master/screenshot-ubuntu-latest-400.png" width="200px" alt="mobile home" />

### Templated by?

[Gatsby Starter - Calpa's Blog](https://github.com/calpa/gatsby-starter-calpa-blog)

Special, thanks!

## Features

### Structure

- [Gatsby.js v4](https://www.gatsbyjs.com/gatsby-4/), Static site generating
  - Use [Preact](https://preactjs.com/), faster than [React](https://ja.reactjs.org/)
  - All Components writen by [TypeScript](https://www.typescriptlang.org/)
  - Use [Bootstrap5](https://getbootstrap.jp/) for CSS Framework
  - Use [Sass(Scss)](https://sass-lang.com/) and Scoped by CSS Modules
  - All articles (Datasource) made by [Markdown](https://www.markdown.jp/what-is-markdown/) and save to this repository
- For Search Engine Optimization, generate header meta tag and [OGP](https://www.popwebdesign.net/what-is-ogp.html)
- High Performance, [purge CSS](https://purgecss.com/) to [Bootstrap5](https://getbootstrap.jp/), optimise SVG and minify HTML, CSS and JS
- Use [Google Analytics v4](https://support.google.com/analytics/answer/10089681?hl=ja)
- Site inner searching by [Algolia search](https://www.algolia.com/)
- Code syntax highlighting by [Prism.js](https://prismjs.com/)
- [PWA](https://developer.mozilla.org/ja/docs/Web/Progressive_web_apps) Support, and prefetch page-data.json
- Deploy [Netlify](https://www.netlify.com/)
  - Managed by [Terraform Cloud](https://cloud.hashicorp.com/products/terraform) for Netlify settings
- Image hosted by [imgur](https://imgur.com)
- Use [Gitalk](https://gitalk.github.io/) for blog comment system
- Icons used by [Fontawesome](https://fontawesome.com/), and optimised to [Icomoon](https://icomoon.io/)
- Sitemap generate
- RSS feed generate
- Compliant with [a11y](https://waic.jp/docs/WCAG20/Overview.html), top page Lighthouse's accessibility score is 100!
- Use [Sentry](https://sentry.io/welcome/) for detecting error and check performance

### For Developer

- Use [ESLint](https://eslint.org/) and [stylelint](https://stylelint.io/) for lint codes
- Use [EditorConfig](https://editorconfig.org/) formatting and indent
- Use [husky](https://typicode.github.io/husky/#/) run linter before git commit and push
- Use [Jest](https://jestjs.io/ja/) and [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) for Unit and React Component testing
- Use [Snapshot tests](https://storybook.js.org/docs/react/writing-tests/snapshot-testing) for Snapshot tests
- Use [Cypress](https://www.cypress.io/) for End-To-End testing
- Components managed by [Storybook](#storybook)
  - Generate all preview-deploy and production-deploy
- Each production-deploy is measured by [Lighthouse](#lighthouse) and [reports](https://tubone24.github.io/blog/lh/report.html) are output
- Each production-deploy is measured by [Bundle Analyzer](#bundle-analyzer) and [reports](https://tubone24.github.io/blog/ba/index.html) are output
- unused dependencies check by [depcheck](https://www.npmjs.com/package/depcheck) in [depcheck_action](https://github.com/tubone24/depcheck_action)
- Update dependencies by [Renovate](https://www.whitesourcesoftware.com/free-developer-tools/renovate/)
- Detect browser's memory leaks by [memlab](https://github.com/facebookincubator/memlab)
- Detect vulnerability by [Snyk](https://app.snyk.io/)
- Detect vulnerability by [OWASP ZAP](https://www.zaproxy.org/)
- Capture [some width screenshots](https://github.com/tubone24/blog/tree/screenshot) every PR and push master.

### For contributor of articles

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

### Running at local

Run **at local**, execute commands below, and access [http://localhost:8000](http://localhost:8000)

```sh
yarn install
yarn start
```

### Build

Or Build Artifact, execute commands below

```sh
yarn build
```

### lint, format codes

Fix your code format by [TSC](https://www.typescriptlang.org/docs/handbook/compiler-options.html), [ESLint](https://eslint.org/) and  [stylelint](https://stylelint.io/)

```sh
yarn typecheck
yarn format:fix
yarn format-style:fix
```

You can also fix YAML format by [yamllint](https://github.com/adrienverge/yamllint)

```sh
yarn format-yml
```

### Testing

Testing React Component and Unit testing, execute commands below

And also, you can test Storybook Snapshot test!

```sh
yarn test
yarn test:storybook
yarn test:e2e
```

If you want to check testing coverage, execute commands below

```sh
yarn test:cov
```

And also, check your coverage report on PR with [Coveralls](https://coveralls.io/).

[![Coverage Status](https://coveralls.io/repos/github/tubone24/blog/badge.svg?branch=master)](https://coveralls.io/github/tubone24/blog?branch=master)

And more, you can check production test coverage report below.

- jest test report
  - <https://tubone24.github.io/blog/cov/index.html>
- cypress e2e test report
  - <https://tubone24.github.io/blog/e2e-cov/index.html>

### Cleaning

If you error occurred on gatsby build, execute commands below

```sh
$ yarn build
....
....
Error loading a result for the page query in "/". Query was not run and no cached result was found.

$ yarn clean
```

Also, you want to clean dependencies, execute commands below

```sh
yarn clean-all
```

### Update Browsers List

This project use Browsers List, so you can update it

```sh
yarn browserslist:update
```

### benchmark (Lighthouse)

If you want to check benchmark, you can use Lighthouse script below

```sh
yarn benchmark "https://blog.tubone-project24.xyz" $(git rev-parse HEAD)
```

### Storybook

If you want to check storybook, execute commands below

```sh
yarn storybook
```

### memlab

If you want to detect browser's memory leaks, you can use memlab script below

```sh
yarn memlab
```

Or if you want to test against a specific URL, set an environment variable.

```sh
URL=https://63ad31c571f88e60f37399ec--pensive-lamport-5822d2.netlify.app yarn memlab
```

And also, creating PR, you can check memory leak report via GitHub PR Comments.

![memlab leaks report](https://i.imgur.com/JdjbTuo.png)

## Environment variables

Copy `.env.example` to create the `.env` file

```sh
cp .env.example .env
```

| Key                              | Description                                              | Default |
|----------------------------------|----------------------------------------------------------|---------|
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

This repository uses [GitHub Actions](https://github.co.jp/features/actions) as CI. There are two workflows, one for preview deployments and one for production deployments.

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

![lighthouse](https://i.imgur.com/NG260hR.png)

<https://tubone24.github.io/blog/lh/report.html>

Also, create PR, Check Lighthouse score via [pagespeedapi.runpagespeed](https://developers.google.com/speed/docs/insights/rest/v5/pagespeedapi/runpagespeed) and Comment your PR.

![lighthouseScoreWithGitHubComments](https://i.imgur.com/LZmrqgS.png)

## Bundle Analyzer

After production deploy, Run and report Bundle Analyzer.

<https://tubone24.github.io/blog/ba/index.html>

## Deploy at Netlify

Push the button below.

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/tubone24/blog)

## textlint

I use [textlint](https://textlint.github.io/) to proofread my blog text.

```sh
yarn textlint
```

## Infrastructure

### Change Netlify Config

Use Terraform Cloud to change Netlify configuration values.

[Workspace](https://app.terraform.io/app/tubone24-test/workspaces/blog)

## Alert monitoring

Use [Sentry](https://sentry.io/organizations/tubone-project24/projects/)

## Automatic security and vulnerability check

### Detect credentials leak

There is a security risk of credentials getting into the code, but we use [Gitguardian](https://www.gitguardian.com/) to check each PR to make sure they are not mixed in.

### API Based

API request based security check is used by [Brightsec](https://brightsec.com/)

### static code analysis for vulnerability

We use [Snyk](https://app.snyk.io/org/tubone24/project/f01f63e7-832e-45ca-a080-eb4d0da4b8e6) for static code analysis.
In addition to detecting vulnerabilities in the libraries used, we scan code and IaC tools.

If you create PR, check security vulnerability for [snyk CLI](https://docs.snyk.io/snyk-cli) and push PR comment.

![snyk comments](https://i.imgur.com/fEL1cFj.png)

### OWASP ZAP

[OWASP ZAP](https://www.zaproxy.org/) [Full Scan](https://www.zaproxy.org/docs/docker/full-scan/) can be run securely against a locally built Docker container.

The results can be viewed at the following URL

<https://tubone24.github.io/blog/owasp/report.html>

Full Scan of OWASP ZAP has a very long execution time, so manual execution with [workflow_dispatch](https://github.com/tubone24/blog/actions/workflows/owaspzap.yml) is recommended.

## CI Healthy

Last 14 days, CI Score by [meercode.io](https://meercode.io)

### CI Score

![blog Actions](https://api.meercode.io/badge/tubone24/blog?type=ci-score&lastDay=14)

### CI Count

![blog Actions](https://api.meercode.io/badge/tubone24/blog?type=ci-count&lastDay=14)

### CI Success Rate

![blog Actions](https://api.meercode.io/badge/tubone24/blog?type=ci-success-rate&lastDay=14)

## Change log and versioning

This Blog's CHANGELOG integrated [GitHub Releases](https://github.com/tubone24/blog/releases).

And this blog's versioning policy is [semver](https://semver.org/)

- MAJOR version when you make incompatible API changes
- MINOR version when you add functionality in a backwards compatible manner or **create articles**.
- PATCH version when you make backwards compatible bug fixes or **update (include delete) articles**.

## License

- The source code under the MIT LICENSE.
- `src/content` under the CC-BY [![CC-BY](https://i.creativecommons.org/l/by/4.0/88x31.png)](http://creativecommons.org/licenses/by/4.0/)
