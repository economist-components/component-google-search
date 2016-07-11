/* global window, document */
import React from 'react';
import ReactDom from 'react-dom';
import promisescript from 'promisescript';

function randomHex() {
  return Math.floor(Math.random() * 10000).toString(16);  // eslint-disable-line no-magic-numbers
}

let googleScript = null;
export default class GoogleSearch extends React.Component {
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
      cx: '013751040265774567329:pqjb-wvrj-q', // eslint-disable-line id-length
      googleScriptUrl: 'www.google.com/cse/cse.js',
      autoFocus: true,
    };
  }

  constructor(...args) {
    super(...args);
    this.unmounted = false;
  }

  componentWillMount() {
    this.setState({
      divID: this.props.divID || `google-search-box-${ randomHex() }`,
      // useFallback by default on SS
      useFallback: (typeof window === 'undefined'),
    });
  }

  componentDidMount() {
    this.ensureScriptHasLoaded()
      .then(() => {
        if (this.unmounted) {
          return;
        }
        this.displayGoogleSearch();
        this.focusSearchField();
      })
      .catch((exception) => {
        console.error(exception); // eslint-disable-line no-console
        if (!this.unmounted) {
          this.setState({ useFallback: true });
        }
      });
  }

  componentWillUnmount() {
    this.unmounted = true;
  }

  focusSearchField() {
    if (this.props.autoFocus !== true) {
      return;
    }
    try {
      this.googleSearchInput.focus();
    } catch (exception) {
      console.error(exception); // eslint-disable-line no-console
    }
  }

  displayGoogleSearch() {
    const config = {
      div: this.state.divID,
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
    this.googleSearchInput =
      ReactDom.findDOMNode(this).querySelector('input[name=search]');
  }

  loadScript() {
    if (this.props.loadGoogleCustomSearch) {
      return this.props.loadGoogleCustomSearch();
    }
    return new Promise((resolve, reject) => {
      window.__gcse = { // eslint-disable-line no-underscore-dangle, id-match
        parsetags: 'explicit',
        callback: resolve, // eslint-disable-line id-blacklist
      };
      // Loading this script it provide us the only additional functionality
      // of autocompletition that is probably achievable by custom code using
      // the Google Search API (Probably paid version).
      const protocol = (document.location.protocol) === 'https:' ? 'https:' : 'http:';
      const src = `${ protocol }//${ this.props.googleScriptUrl }?cx=${ this.props.cx }`;
      promisescript({
        url: src,
        type: 'script',
      }).catch((exception) => {
        reject(new Error(`An error occurs loading or executing Google Custom Search: ${ exception.message }`));
      });
    });
  }

  ensureScriptHasLoaded() {
    if (!googleScript) {
      googleScript = this.loadScript();
    }
    return googleScript;
  }

  render() {
    return (
      <div className="google-search" id={this.state.divID} role="search">
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

if (process.env.NODE_ENV !== 'production') {
  GoogleSearch.propTypes = {
    enableHistory: React.PropTypes.bool,
    noResultsString: React.PropTypes.string,
    newWindow: React.PropTypes.bool,
    gname: React.PropTypes.string,
    queryParameterName: React.PropTypes.string,
    language: React.PropTypes.string,
    resultsUrl: React.PropTypes.string,
    cx: React.PropTypes.string, // eslint-disable-line id-length
    googleScriptUrl: React.PropTypes.string,
    autoFocus: React.PropTypes.bool,
    divID: React.PropTypes.string,
    loadGoogleCustomSearch: React.PropTypes.func,
  };
}
