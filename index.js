'use strict';

exports.__esModule = true;

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _promisescript = require('promisescript');

var _promisescript2 = _interopRequireDefault(_promisescript);

/* eslint-disable no-undef, no-underscore-dangle, id-match, id-length, no-console */

var googleScript = null;

var GoogleSearch = (function (_React$Component) {
  _inherits(GoogleSearch, _React$Component);

  _createClass(GoogleSearch, null, [{
    key: 'propTypes',
    get: function get() {
      return {
        enableHistory: _react2['default'].PropTypes.bool,
        noResultsString: _react2['default'].PropTypes.string,
        newWindow: _react2['default'].PropTypes.bool,
        gname: _react2['default'].PropTypes.string,
        queryParameterName: _react2['default'].PropTypes.string,
        language: _react2['default'].PropTypes.string,
        resultsUrl: _react2['default'].PropTypes.string,
        cx: _react2['default'].PropTypes.string,
        googleScriptUrl: _react2['default'].PropTypes.string
      };
    }
  }, {
    key: 'defaultProps',
    get: function get() {
      return {
        enableHistory: true,
        noResultsString: 'Your query returned no results. Please try a\n      different search term. (Did you check your spelling? You can also\n        try rephrasing your query or using more general search terms.)',
        newWindow: false,
        gname: 'economist-search',
        queryParameterName: 'ss',
        language: 'en',
        resultsUrl: 'http://www.economist.com/search/',
        cx: '013751040265774567329:pqjb-wvrj-q',
        googleScriptUrl: 'www.google.com/cse/cse.js'
      };
    }
  }]);

  function GoogleSearch(props) {
    _classCallCheck(this, GoogleSearch);

    _React$Component.call(this, props);
    this.state = {
      // useFallback by default on SS
      useFallback: typeof window === 'undefined'
    };
  }

  GoogleSearch.prototype.componentDidMount = function componentDidMount() {
    var _this = this;

    this.ensureScriptHasLoaded().then(function () {
      return _this.displayGoogleSearch();
    }).then(function () {
      return _this.focusSearchField();
    })['catch'](function (err) {
      console.error(err);
      _this.setState({ useFallback: true });
    });
  };

  GoogleSearch.prototype.focusSearchField = function focusSearchField() {
    try {
      this.googleSearchInput.focus();
    } catch (e) {
      console.error(e);
    }
  };

  GoogleSearch.prototype.displayGoogleSearch = function displayGoogleSearch() {
    var config = {
      div: 'google-search-box',
      tag: 'searchbox-only',
      attributes: {
        enableHistory: this.props.enableHistory,
        noResultsString: this.props.noResultsString,
        newWindow: this.props.newWindow,
        gname: this.props.gname,
        queryParameterName: this.props.queryParameterName,
        language: this.props.language,
        resultsUrl: this.props.resultsUrl
      }
    };
    window.google.search.cse.element.render(config);
    this.googleSearchInput = document.querySelector('.search .gsc-search-box input.gsc-input');
  };

  GoogleSearch.prototype.ensureScriptHasLoaded = function ensureScriptHasLoaded() {
    var _this2 = this;

    if (!googleScript) {
      googleScript = new Promise(function (resolve, reject) {
        window.__gcse = {
          parsetags: 'explicit',
          callback: resolve
        };
        // Loading this script it provide us the only additional functionality
        // of autocompletition that is probably achievable by custom code using
        // the Google Search API (Probably paid version).
        var protocol = document.location.protocol === 'https:' ? 'https:' : 'http:';
        var src = protocol + '//' + _this2.props.googleScriptUrl + '?cx=' + _this2.props.cx;
        _promisescript2['default']({
          url: src,
          type: 'script'
        })['catch'](function (e) {
          reject(new Error('An error occurs loading or executing Google Custom Search: ' + e.message));
        });
      });
    }
    return googleScript;
  };

  GoogleSearch.prototype.render = function render() {
    var _this3 = this;

    return _react2['default'].createElement(
      'div',
      { className: 'google-search', id: 'google-search-box' },
      _react2['default'].createElement(
        'div',
        { className: 'fallback', style: { display: this.state.useFallback ? 'block' : 'none' } },
        _react2['default'].createElement(
          'form',
          {
            acceptCharset: 'UTF-8',
            method: 'GET',
            id: 'search-theme-form',
            action: this.props.resultsUrl,
            className: 'gsc-input'
          },
          _react2['default'].createElement('input', {
            type: 'text',
            maxLength: '128',
            name: this.props.queryParameterName,
            id: 'edit-search-theme-form-1',
            title: 'Enter the terms you wish to search for.',
            className: 'gsc-input',
            ref: function (ref) {
              return _this3.googleSearchInputFallbackInput = ref;
            }
          }),
          _react2['default'].createElement('input', {
            id: 'edit-cx',
            value: this.props.cx,
            type: 'hidden',
            name: 'cx'
          })
        )
      )
    );
  };

  return GoogleSearch;
})(_react2['default'].Component);

exports['default'] = GoogleSearch;
module.exports = exports['default'];