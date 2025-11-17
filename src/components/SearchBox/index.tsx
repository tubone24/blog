import React, { Component } from "react";
import { navigate, withPrefix } from "gatsby";
import "./index.scss";
import ReactGA from "react-ga4";
import {
  SearchClient,
  SearchIndex,
} from "algoliasearch/dist/algoliasearch-lite";
import { RequestOptions } from "@algolia/transporter";
import { SearchOptions } from "@algolia/client-search";

let algoliasearch: CallableFunction;
let autocomplete: CallableFunction;
let client: SearchClient;
let index: SearchIndex;

if (typeof window !== "undefined") {
  // eslint-disable-next-line global-require
  algoliasearch = require("algoliasearch/lite");
  // eslint-disable-next-line global-require
  autocomplete = require("autocomplete.js");
  client = algoliasearch(
    process.env.GATSBY_ALGOLIA_APP_ID || process.env.STORYBOOK_ALGOLIA_APP_ID,
    process.env.GATSBY_ALGOLIA_SEARCH_API_KEY ||
      process.env.STORYBOOK_ALGOLIA_SEARCH_API_KEY,
  );
  index = client.initIndex(
    process.env.GATSBY_ALGOLIA_INDEX_NAME ||
      process.env.STORYBOOK_ALGOLIA_INDEX_NAME ||
      "posts",
  );
}

// https://github.com/algolia/algoliasearch-client-javascript/issues/1152
const source =
  (index: SearchIndex, parameters: RequestOptions & SearchOptions) =>
  (query: string, cb: CallableFunction) =>
    index
      .search(query, parameters)
      .then((res) => cb(res.hits, res))
      .catch((err) => cb([], err));

class SearchBox extends Component {
  componentDidMount() {
    if (typeof window === "undefined") {
      return;
    }
    autocomplete("#algolia-search-input", { hint: false }, [
      {
        source: source(index, { hitsPerPage: 3 }),
        displayKey: "title",
        templates: {
          suggestion({
            _highlightResult: { title, description },
          }: {
            _highlightResult: {
              title: {
                value: string;
              };
              description: {
                value: string;
              };
            };
          }) {
            return `
                <b><p class="title">${title.value}</p></b>
                <p class="description">${description.value}</p>
                `;
          },
          footer:
            '<div class="branding"><img src="https://i.imgur.com/HXG1uHY.png" alt="Powered by Algolia" decoding="async" /></div>',
        },
      },
    ]).on(
      "autocomplete:selected",
      (event: { _args: { path: string }[] }, suggestion: { url: string }) => {
        navigate(suggestion.url);
        ReactGA.event({
          category: "User",
          // eslint-disable-next-line no-underscore-dangle
          action: `Click Searchbox item: ${event._args[0].path}`,
        });
        // eslint-disable-next-line no-underscore-dangle
        navigate(withPrefix(event._args[0].path));
      },
    );
  }

  render() {
    return (
      <div>
        <p>
          <label htmlFor="algolia-search-input">
            <span className="icon-search" />
            &nbsp;SearchBox
          </label>
        </p>
        <input
          type="search"
          id="algolia-search-input"
          placeholder="Enter the keyword..."
          data-testid="algolia-search-input"
        />
      </div>
    );
  }
}

export default SearchBox;
