import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';

import { shallowWithIntl } from 'testHelpers/intl-enzyme-test-helper';
import FagsakSearch from './components/FagsakSearch';
import { FagsakSearchIndex } from './FagsakSearchIndex';

describe('<FagsakSearchIndex>', () => {
  const oppgave = {
    status: {
      erReservert: false,
      reservertTilTidspunkt: null,
      erReservertAvInnloggetBruker: false,
      reservertAv: null,
      flyttetReservasjon: null,
    },
    saksnummer: '23456',
    behandlingId: 234,
    personnummer: '23089076787',
    navn: 'Walter',
    system: 'VL',
    behandlingstype: {
      navn: 'Førstegangssøknad',
      kode: 'BT-002',
    },
    behandlingStatus: {
      navn: 'Opprettet',
      kode: 'OPPRE',
    },
    opprettetTidspunkt: '',
    behandlingsfrist: '',
    fagsakYtelseType: {
      navn: 'Omsorgspenger',
      kode: 'OMS',
    },
    erTilSaksbehandling: true,
    eksternId: '',
  };
  const fagsakOppgaver = [oppgave, { ...oppgave, saksnummer: ' 23456' }];

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
    const wrapper = shallowWithIntl(<FagsakSearchIndex
      fagsakOppgaver={fagsakOppgaver}
      searchFagsaker={sinon.spy()}
      searchResultReceived={false}
      searchStarted
      fagsaker={fagsaker}
      kanReservere
      resetFagsakSearch={sinon.spy()}
      goToFagsak={sinon.spy()}
      leggTilBehandletOppgave={sinon.spy()}
      reserverOppgave={sinon.spy()}
      hentReservasjonsstatus={sinon.spy()}
      hentOppgaverForFagsaker={sinon.spy()}
    />);

    const fagsakSearchIndex = wrapper.find(FagsakSearch);
    expect(fagsakSearchIndex).to.have.length(1);
    expect(fagsakSearchIndex.prop('fagsaker')).to.eql(fagsaker);
  });

  it('skal gå til valgt fagsak', () => {
    const goToFagsak = sinon.spy();
    const wrapper = shallowWithIntl(<FagsakSearchIndex
      fagsakOppgaver={fagsakOppgaver}
      searchFagsaker={sinon.spy()}
      searchResultReceived={false}
      searchStarted
      fagsaker={fagsaker}
      kanReservere
      leggTilBehandletOppgave={sinon.spy()}
      resetFagsakSearch={sinon.spy()}
      goToFagsak={goToFagsak}
      reserverOppgave={sinon.spy()}
      hentReservasjonsstatus={sinon.spy()}
      hentOppgaverForFagsaker={sinon.spy()}
    />);

    const fagsakSearchIndex = wrapper.find(FagsakSearch);
    fagsakSearchIndex.prop('selectOppgaveCallback')(oppgave, false);

    expect(goToFagsak.calledOnce).to.be.true;
  });

  it('skal ikke gå direkte til fagsak når søkeresultatet returnerer flere fagsaker', () => {
    const goToFagsak = sinon.spy();
    const wrapper = shallowWithIntl(<FagsakSearchIndex
      searchFagsaker={sinon.spy()}
      searchResultReceived={false}
      leggTilBehandletOppgave={sinon.spy()}
      searchStarted
      kanReservere
      fagsaker={fagsaker}
      resetFagsakSearch={sinon.spy()}
      goToFagsak={goToFagsak}
      reserverOppgave={sinon.spy()}
      hentReservasjonsstatus={sinon.spy()}
      fagsakOppgaver={[]}
      hentOppgaverForFagsaker={sinon.spy()}
    />);

    wrapper.setProps({
      fagsaker,
      searchResultReceived: true,
      searchStarted: false,
    });
    wrapper.update();

    expect(goToFagsak.calledOnce).to.be.false;
  });
});
