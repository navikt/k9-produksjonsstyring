import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';

import { shallowWithIntl } from 'testHelpers/intl-enzyme-test-helper';
import HeaderWithErrorPanel from './components/HeaderWithErrorPanel';

import { AppIndex } from './AppIndex';

describe('<AppIndex>', () => {
  it('skal vise hjem-skjermbilde inkludert header men ikke feilmelding', () => {
    const wrapper = shallowWithIntl(<AppIndex
      navAnsattName="Peder"
      showCrashMessage={sinon.spy()}
      removeErrorMessage={sinon.spy()}
      errorMessagesLength={0}
      location={{ search: undefined, state: {} }}
    />);

    const headerComp = wrapper.find(HeaderWithErrorPanel);
    expect(headerComp).to.have.length(1);
    expect(headerComp.prop('navAnsattName')).to.eql('Peder');

    const homeComp = wrapper.find('Home');
    expect(homeComp).to.have.length(1);
    expect(homeComp.prop('nrOfErrorMessages')).is.eql(0);
  });

  it('skal vise hjem-skjermbilde inkludert header og feilmelding', () => {
    const wrapper = shallowWithIntl(<AppIndex
      navAnsattName="Peder"
      showCrashMessage={sinon.spy()}
      removeErrorMessage={sinon.spy()}
      errorMessagesLength={1}
      location={{ search: undefined, state: {} }}
    />);

    const headerComp = wrapper.find(HeaderWithErrorPanel);
    expect(headerComp).to.have.length(1);
    expect(headerComp.prop('navAnsattName')).to.eql('Peder');

    const homeComp = wrapper.find('Home');
    expect(homeComp).to.have.length(1);
    expect(homeComp.prop('nrOfErrorMessages')).is.eql(1);
  });

  it('skal vise query-feilmelding', () => {
    const location = {
      search: '?errormessage=Det+finnes+ingen+sak+med+denne+referansen%3A+266',
      state: {},
    };

    const wrapper = shallowWithIntl(<AppIndex
      navAnsattName="Peder"
      removeErrorMessage={sinon.spy()}
      showCrashMessage={sinon.spy()}
      errorMessagesLength={0}
      location={location}
    />);

    const headerComp = wrapper.find(HeaderWithErrorPanel);
    expect(headerComp.prop('queryStrings')).to.eql({ errormessage: 'Det finnes ingen sak med denne referansen: 266' });

    const homeComp = wrapper.find('Home');
    expect(homeComp.prop('nrOfErrorMessages')).is.eql(1);
  });
});
