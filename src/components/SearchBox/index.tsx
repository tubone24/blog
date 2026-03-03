import React, { Component } from "react";
import "./index.scss";
import ReactGA from "react-ga4";
import type { SearchClient, SearchIndex } from "algoliasearch";
import type { RequestOptions } from "@algolia/transporter";
import type { SearchOptions } from "@algolia/client-search";

// https://github.com/algolia/algoliasearch-client-javascript/issues/1152
const source =
  (index: SearchIndex, parameters: RequestOptions & SearchOptions) =>
  (query: string, cb: CallableFunction) =>
    index
      .search(query, parameters)
      .then((res) => cb(res.hits, res))
      .catch((err) => cb([], err));

class SearchBox extends Component {
  async componentDidMount() {
    if (typeof window === "undefined") {
      return;
    }

    try {
      const algoliasearchModule = await import("algoliasearch/lite");
      const algoliasearch = algoliasearchModule.default || algoliasearchModule;
      const autocompleteModule = await import("autocomplete.js");
      const autocomplete = autocompleteModule.default || autocompleteModule;

      const client: SearchClient = algoliasearch(
        import.meta.env.PUBLIC_ALGOLIA_APP_ID ||
          process.env.STORYBOOK_ALGOLIA_APP_ID,
        import.meta.env.PUBLIC_ALGOLIA_SEARCH_API_KEY ||
          process.env.STORYBOOK_ALGOLIA_SEARCH_API_KEY,
      );
      const index = client.initIndex(
        import.meta.env.PUBLIC_ALGOLIA_INDEX_NAME ||
          process.env.STORYBOOK_ALGOLIA_INDEX_NAME ||
          "posts",
      );

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
          window.location.href = suggestion.url;
          ReactGA.event({
            category: "User",
            // eslint-disable-next-line no-underscore-dangle
            action: `Click Searchbox item: ${event._args[0].path}`,
          });
          // eslint-disable-next-line no-underscore-dangle
          window.location.href = event._args[0].path;
        },
      );
    } catch (err) {
      console.error("Failed to initialize Algolia search:", err);
    }
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
