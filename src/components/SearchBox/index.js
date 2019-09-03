import React, { Component } from 'react';
import { navigate } from 'gatsby';
import './index.scss';

let algoliasearch; let autocomplete; let client; let
  index;

if (typeof window !== 'undefined') {
  // eslint-disable-next-line global-require
  algoliasearch = require('algoliasearch/lite');
  // eslint-disable-next-line global-require
  autocomplete = require('autocomplete.js');
  client = algoliasearch(
    process.env.GATSBY_ALGOLIA_APP_ID,
    process.env.GATSBY_ALGOLIA_SEARCH_API_KEY,
  );
  console.log(process.env.GATSBY_ALGOLIA_INDEX_NAME);
  index = client.initIndex(process.env.GATSBY_ALGOLIA_INDEX_NAME);
}

class SearchBox extends Component {
  componentDidMount() {
    if (typeof window === 'undefined') {
      return;
    }
    autocomplete('#algolia-search-input', { hint: false }, [
      {
        source: autocomplete.sources.hits(index, { hitsPerPage: 5 }),
        displayKey: 'title',
        templates: {
          suggestion({ _highlightResult: { title, description } }) {
            return `
                <p class="title">${title.value}</p>
                `;
          },
          footer:
            '<div class="branding"><img src="../../../static/assets/search-by-algolia-light-background.svg" /></div>',
        },
      },
    ]).on('autocomplete:selected', (
      event,
      suggestion,
      dataset,
      context,
    ) => {
      navigate(suggestion.url);
    });
  }

  render() {
    return (
      <div style={{ marginBottom: '1rem' }}>
        <input
          type="search"
          id="algolia-search-input"
          placeholder="Search"
          style={{
            border: 'none',
          }}
        />
      </div>
    );
  }
}

export default SearchBox;
