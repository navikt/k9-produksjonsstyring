import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import { K9LosApiKeys, RestApiGlobalStatePathsKeys } from 'api/k9LosApi';
import RestApiTestMocker from 'testHelpers/RestApiTestMocker';
import FagsakSearch from './components/FagsakSearch';
import FagsakSearchIndex from './FagsakSearchIndex';

describe('<FagsakSearchIndex>', () => {
  const navAnsatt = {
    kanSaksbehandle: true,
  };

  const fagsak = {
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
  const fagsaker = { ikkeTilgang: false, fagsaker: [fagsak, { ...fagsak, saksnummer: ' 23456' }] };

  it('skal sette opp søkeskjermbilde for fagsaker', () => {
    new RestApiTestMocker()
      .withRestCallRunner(K9LosApiKeys.SEARCH_FAGSAK, { data: fagsaker })
      .withRestCallRunner(K9LosApiKeys.RESERVER_OPPGAVE, { startRequest: () => undefined })
      .withRestCallRunner(K9LosApiKeys.OPPGAVER_FOR_FAGSAKER, { startRequest: () => undefined })
      .withGlobalData(RestApiGlobalStatePathsKeys.NAV_ANSATT, navAnsatt)
      .runTest(() => {
        const wrapper = shallow(<FagsakSearchIndex
          k9sakUrl="k9/sak/"
        />);

        const fagsakSearchIndex = wrapper.find(FagsakSearch);
        expect(fagsakSearchIndex).to.have.length(1);
        expect(fagsakSearchIndex.prop('fagsaker')).to.eql(fagsaker);
      });
  });
});
