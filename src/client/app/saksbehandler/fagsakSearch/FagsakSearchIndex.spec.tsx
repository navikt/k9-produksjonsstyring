import React from 'react';
import { expect } from 'chai';

import { K9LosApiKeys, RestApiGlobalStatePathsKeys } from 'api/k9LosApi';
import RestApiTestMocker from 'testHelpers/RestApiTestMocker';
import { shallowWithIntl } from 'testHelpers/intl-enzyme-test-helper';
import { IntlShape } from 'react-intl';
import FagsakSearch from './components/FagsakSearch';
import FagsakSearchIndex from './FagsakSearchIndex';

describe('<FagsakSearchIndex>', () => {
  const navAnsatt = {
    kanSaksbehandle: true,
  };

  const oppgave = {
    saksnummer: '12345',
    sakstype: {
      kode: 'ES',
      navn: 'test',
    },
    status: {
      kode: 'OPPR',
      navn: 'test',
    },
    barnFodt: '10.10.2017',
    person: {
      navn: 'Espen',
      alder: 38,
      personnummer: '123456789',
      kjoenn: 'KVINNE',
      erDod: false,
    },
    opprettet: '13‎.‎02‎.‎2017‎ ‎09‎:‎54‎:‎22',
  };
  const resultat = {
    ikkeTilgang: false,
    oppgaver: [oppgave, { ...oppgave, saksnummer: ' 23456' }],
    person: {
      navn: 'Navn',
      personnummer: '8857575754845',
      kjoenn: 'KVINNE',
    },
  };

  it('skal sette opp søkeskjermbilde for fagsaker', () => {
    new RestApiTestMocker()
      .withRestCallRunner(K9LosApiKeys.SEARCH_FAGSAK, { data: resultat })
      .withRestCallRunner(K9LosApiKeys.RESERVER_OPPGAVE, { startRequest: () => undefined })
      .withRestCallRunner(K9LosApiKeys.LEGG_TIL_BEHANDLET_OPPGAVE, { startRequest: () => undefined })
      .withGlobalData(RestApiGlobalStatePathsKeys.NAV_ANSATT, navAnsatt)
      .runTest(() => {
        const wrapper = shallowWithIntl(<FagsakSearchIndex
          intl={intl as IntlShape}
          k9sakUrl="k9/sak/"
          k9punsjUrl="k9-punsj"
          omsorgspengerUrl="omsorgspenger"
        />);

        const fagsakSearchIndex = wrapper.find(FagsakSearch);
        expect(fagsakSearchIndex).to.have.length(1);
        expect(fagsakSearchIndex.prop('resultat')).to.eql(resultat);
      });
  });
});
