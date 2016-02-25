import React from 'react';
import promisescript from 'promisescript';
/* eslint-disable no-undef, no-underscore-dangle, id-match, id-length, no-console */

let googleScript = null;
export default class GoogleSearch extends React.Component {

  static get propTypes() {
    return {
      enableHistory: React.PropTypes.bool,
      noResultsString: React.PropTypes.string,
      newWindow: React.PropTypes.bool,
      gname: React.PropTypes.string,
      queryParameterName: React.PropTypes.string,
      language: React.PropTypes.string,
      resultsUrl: React.PropTypes.string,
      cx: React.PropTypes.string,
      googleScriptUrl: React.PropTypes.string,
    };
  }

  static get defaultProps() {
    return {
      enableHistory: true,
      noResultsString: `Your query returned no results. Please try a
      different search term. (Did you check your spelling? You can also
        try rephrasing your query or using more general search terms.)`,
      newWindow: false,
      gname: 'economist-search',
      queryParameterName: 'ss',
      language: 'en',
      resultsUrl: 'http://www.economist.com/search/',
      cx: '013751040265774567329:pqjb-wvrj-q',
      googleScriptUrl: 'www.google.com/cse/cse.js',
    };
  }

  constructor(props) {
    super(props);
    this.state = {
      // useFallback by default on SS
      useFallback: (typeof window === 'undefined'),
    };
  }

  componentDidMount() {
    this.ensureScriptHasLoaded()
      .then(() => this.displayGoogleSearch())
      .then(() => this.focusSearchField())
      .catch((err) => {
        console.error(err);
        this.setState({ useFallback: true });
      });
  }

  focusSearchField() {
    try {
      this.googleSearchInput.focus();
    } catch (e) {
      console.error(e);
    }
  }

  displayGoogleSearch() {
    const config = {
      div: 'google-search-box',
      tag: 'searchbox-only',
      attributes: {
        enableHistory: this.props.enableHistory,
        noResultsString: this.props.noResultsString,
        newWindow: this.props.newWindow,
        gname: this.props.gname,
        queryParameterName: this.props.queryParameterName,
        language: this.props.language,
        resultsUrl: this.props.resultsUrl,
      },
    };
    window.google.search.cse.element.render(config);
    this.googleSearchInput = document.querySelector('.search .gsc-search-box input.gsc-input');
  }

  ensureScriptHasLoaded() {
    if (!googleScript) {
      googleScript = new Promise((resolve, reject) => {
        window.__gcse = {
          parsetags: 'explicit',
          callback: resolve,
        };
        // Loading this script it provide us the only additional functionality
        // of autocompletition that is probably achievable by custom code using
        // the Google Search API (Probably paid version).
        const protocol = (document.location.protocol) === 'https:' ? 'https:' : 'http:';
        const src = `${protocol}//${this.props.googleScriptUrl}?cx=${this.props.cx}`;
        promisescript({
          url: src,
          type: 'script',
        }).catch((e) => {
          reject(new Error(`An error occurs loading or executing Google Custom Search: ${e.message}`));
        });
      });
    }
    return googleScript;
  }

  render() {
    return (
      <div className="google-search" id="google-search-box">
        <div className="fallback" style={{ display: (this.state.useFallback) ? 'block' : 'none' }}>
          <form
            acceptCharset="UTF-8"
            method="GET"
            id="search-theme-form"
            action={this.props.resultsUrl}
            className="gsc-input"
          >
            <input
              type="text"
              maxLength="128"
              name={this.props.queryParameterName}
              id="edit-search-theme-form-1"
              title="Enter the terms you wish to search for."
              className="gsc-input"
              ref={(ref) => this.googleSearchInputFallbackInput = ref}
            />
            <input
              id="edit-cx"
              value={this.props.cx}
              type="hidden"
              name="cx"
            />
          </form>
        </div>
      </div>
    );
  }
}
