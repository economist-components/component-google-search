import 'babel-polyfill';
import GoogleSearch from '../src';
import React from 'react';
import chai from 'chai';
import chaiSpies from 'chai-spies';
import chaiEnzyme from 'chai-enzyme';
import { shallow } from 'enzyme';
chai.use(chaiEnzyme()).should();
chai.use(chaiSpies);

describe('GoogleSearch', () => {
  let comp = null;
  beforeEach(() => {
    comp = new GoogleSearch({}, {}, {});
  });

  it('is compatible with React.Component', () => {
    GoogleSearch.should.be.a('function')
      .and.respondTo('render');
  });

  it('renders a React element', () => {
    React.isValidElement(<GoogleSearch />).should.equal(true);
  });

  it('checks for correct state when client-rendering', () => {
    // Shallow was used rather than mount, otherwise the component is mounted
    // twice in the example, as the Google APIs are called twice.
    const wrapper = shallow(<GoogleSearch />);
    wrapper.state().useFallback.should.equal(false);
  });

  describe('componentWillMount', () => {
    const oldMathRandom = Math.random;
    afterEach(() => {
      Math.random = oldMathRandom;
    });
    it('calls setState with this.props.divID', () => {
      comp.props.divID = 'test-div-id';
      comp.setState = chai.spy();
      comp.componentWillMount();
      comp.setState.should.have.been.called.with({
        divID: 'test-div-id',
        useFallback: (typeof window === 'undefined'),
      });
    });
    it('calls setState with a random hash if this.props.divID is not present', () => {
      comp.props.divID = null;
      Math.random = () => 0.1234;
      const multipliedAndInHex = (1234).toString(16);
      comp.setState = chai.spy();
      comp.componentWillMount();
      comp.setState.should.have.been.called.with({
        divID: `google-search-box-${ multipliedAndInHex }`,
        useFallback: (typeof window === 'undefined'),
      });
    });
  });

  describe('focusSearchField', () => {
    beforeEach(() => {
      comp.googleSearchInput = { focus: chai.spy() };
    });
    it('focuses the element when the autoFocus prop is true', () => {
      comp.props.autoFocus = true;
      comp.focusSearchField();
      comp.googleSearchInput.focus.should.have.been.called.once();
    });
    it('doesn\'t focus the element if props.autoFocus is false', () => {
      comp.props.autoFocus = false;
      comp.focusSearchField();
      comp.googleSearchInput.focus.should.not.have.been.called();
    });
    it('doesn\'t focus the element if this.unmounted is true', () => {
      comp.unmounted = true;
      comp.googleSearchInput.focus.should.not.have.been.called();
    });
  });

  describe('loadScript', () => {
    it('returns this.props.loadGoogleCustomSearch when passed', () => {
      /* eslint-disable no-empty-function, no-unused-vars */
      const neverResolve = new Promise((resolve) => {});
      /* eslint-enable no-empty-function, no-unused-vars */
      comp.props.loadGoogleCustomSearch = chai.spy(() => neverResolve);
      const loadedScript = comp.loadScript();
      comp.props.loadGoogleCustomSearch.should.have.been.called();
      loadedScript.should.equal(neverResolve);
    });
  });
});

