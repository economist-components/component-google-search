import GoogleSearch from '../index.es6';
import React from 'react';
/* eslint-disable newline-after-var, id-length */
describe(`A Google Search component`, () => {
  describe(`is a React component`, () => {
    it('is compatible with React.Component', () => {
      GoogleSearch.should.be.a('function').and.respondTo('render');
    });
    it(`it renders a React element`, () => {
      React.isValidElement(<GoogleSearch/>).should.equal(true);
    });
  });
});

