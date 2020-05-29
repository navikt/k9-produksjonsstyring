import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';

import { Form } from 'react-final-form';

import { Hovedknapp, Knapp } from 'nav-frontend-knapper';
import { shallowWithIntl, intlMock } from 'testHelpers/intl-enzyme-test-helper';
import { LeggTilSaksbehandlerForm } from './LeggTilSaksbehandlerForm';

describe('<LeggTilSaksbehandlerForm>', () => {
  it('skal vise form for å søke opp saksbehandlere men ikke knapper for å legge til og nullstille', () => {
    const formProps = { handleSubmit: sinon.spy() };

    const wrapper = shallowWithIntl(<LeggTilSaksbehandlerForm
      intl={intlMock}
      finnSaksbehandler={sinon.spy()}
      leggTilSaksbehandler={sinon.spy()}
      resetSaksbehandlerSok={sinon.spy()}
      erLagtTilAllerede={false}
      erSokFerdig={false}
    />).find(Form).drill((props) => props.render(formProps)).shallow();

    expect(wrapper.find(Knapp)).to.have.length(1);
    expect(wrapper.find(Hovedknapp)).to.have.length(0);
  });
});
