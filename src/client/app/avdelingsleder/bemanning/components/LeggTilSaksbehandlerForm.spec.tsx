import React from 'react';
import { Form } from 'react-final-form';
import { IntlShape } from 'react-intl';
import { expect } from 'chai';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';
import sinon from 'sinon';
import { intlMock, shallowWithIntl } from '../../../../../../setup/testHelpers/intl-enzyme-test-helper';
import { LeggTilSaksbehandlerForm } from './LeggTilSaksbehandlerForm';

describe('<LeggTilSaksbehandlerForm>', () => {
  const intl: IntlShape = {
    ...intlMock,
  };
  it('skal vise form for å søke opp saksbehandlere men ikke knapper for å legge til og nullstille', () => {
    const formProps = { handleSubmit: sinon.spy() };

    const wrapper = shallowWithIntl(
      <LeggTilSaksbehandlerForm
        intl={intl}
        finnSaksbehandler={sinon.spy()}
        leggTilSaksbehandler={sinon.spy()}
        resetSaksbehandlerSok={sinon.spy()}
        erLagtTilAllerede={false}
        erSokFerdig={false}
      />,
    )
      .find(Form)
      .renderProp('render')(formProps);

    expect(wrapper.find(Knapp)).to.have.length(1);
    expect(wrapper.find(Hovedknapp)).to.have.length(0);
  });
});
