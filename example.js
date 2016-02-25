'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _index = require('./index');

var _index2 = _interopRequireDefault(_index);

exports['default'] = _react2['default'].createElement(
  'div',
  { className: 'search__example-container' },
  _react2['default'].createElement(
    'table',
    null,
    _react2['default'].createElement(
      'tbody',
      null,
      _react2['default'].createElement(
        'tr',
        null,
        _react2['default'].createElement(
          'td',
          { style: { width: '100%', color: 'white' } },
          'Just some placeholder text'
        ),
        _react2['default'].createElement(
          'td',
          null,
          _react2['default'].createElement(_index2['default'], null)
        )
      )
    )
  )
);
module.exports = exports['default'];