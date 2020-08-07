import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { IntlShape } from 'react-intl';
import { Form } from 'react-final-form';

import { Hovedknapp, Knapp } from 'nav-frontend-knapper';
import { shallowWithIntl, intlMock } from 'testHelpers/intl-enzyme-test-helper';
import { LeggTilDriftsmeldingForm } from './LeggTilDriftsmeldingForm';

describe('<LeggTilSaksbehandlerForm>', () => {
  const intl: Partial<IntlShape> = {
    ...intlMock,
  };
  it('skal vise form for å søke opp driftsmelding men ikke knapper for å legge til og nullstille', () => {
    const formProps = { handleSubmit: sinon.spy() };

    const wrapper = shallowWithIntl(<LeggTilDriftsmeldingForm
      intl={intl as IntlShape}
      finnSaksbehandler={sinon.spy()}
      leggTilSaksbehandler={sinon.spy()}
      resetSaksbehandlerSok={sinon.spy()}
      erLagtTilAllerede={false}
      erSokFerdig={false}
    />).find(Form).renderProp('render')(formProps);

    expect(wrapper.find(Knapp)).to.have.length(1);
    expect(wrapper.find(Hovedknapp)).to.have.length(0);
  });
});
