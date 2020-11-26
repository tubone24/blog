import React, { Component } from 'react';
import { navigate } from 'gatsby';
import './index.scss';
import ReactGA from 'react-ga';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
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
  index = client.initIndex(process.env.GATSBY_ALGOLIA_INDEX_NAME);
}

class SearchBox extends Component {
  componentDidMount() {
    if (typeof window === 'undefined') {
      return;
    }
    autocomplete('#algolia-search-input', { hint: false }, [
      {
        source: autocomplete.sources.hits(index, { hitsPerPage: 3 }),
        displayKey: 'title',
        templates: {
          suggestion({ _highlightResult: { title, description } }) {
            return `
                <b><p class="title">${title.value}</p></b>
                <p class="description">${description.value}</p>
                `;
          },
          footer:
            '<div class="branding"><img src="https://i.imgur.com/HXG1uHY.png"  alt="Powered by Algolia"/></div>',
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
      ReactGA.event({
        category: 'User',
        // eslint-disable-next-line no-underscore-dangle
        action: `Click Searchbox item: ${event._args[0].path}`,
      });
      // eslint-disable-next-line no-underscore-dangle
      gotoPage(event._args[0].path);
    });
  }

  render() {
    return (
      <div style={{ marginBottom: '1rem' }}>
        <p><FontAwesomeIcon icon={['fas', 'search']} />&nbsp;SearchBox</p>
        <input
          type="search"
          id="algolia-search-input"
          placeholder="Search"
          style={{
            border: 'none',
          }}
        />
        <small id="searchboxHelp" className="form-text text-muted">Search your interesting by Algolia in this blog.</small>
      </div>
    );
  }
}

export default SearchBox;
