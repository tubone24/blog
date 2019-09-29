import React, { Component } from 'react';
import { navigate } from 'gatsby';
import './index.scss';

import { gotoPage } from '../../api/url';

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
                <b><p class="title">${title.value}</p></b>
                <p class="description">${description.value}</p>
                `;
          },
          footer:
            '<div class="branding"><img src="https://i.imgur.com/MIPOSCQ.png"  alt="Powered by Algolia"/></div>',
        },
      },
    ]).on('autocomplete:selected', (
      event,
      suggestion,
      // eslint-disable-next-line no-unused-vars
      dataset,
      // eslint-disable-next-line no-unused-vars
      context,
    ) => {
      navigate(suggestion.url);
      console.log(event, suggestion, dataset, context);
      // eslint-disable-next-line no-underscore-dangle
      gotoPage(event._args[0].path);
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
