import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';

import FagsakSearch from './FagsakSearch';
import PersonInfo from './person/PersonInfo';
import SearchForm from './SearchForm';
import FagsakList from './FagsakList';

describe('<FagsakSearch>', () => {
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

  it('skal kun vise søkefelt før søk er startet', () => {
    const searchFagsakFunction = sinon.spy();
    const wrapper = shallow(<FagsakSearch
      resultat={[]}
      searchFagsakCallback={searchFagsakFunction}
      selectOppgaveCallback={sinon.spy()}
      searchResultReceived={false}
      spinner
      searchStarted
      resetSearch={sinon.spy()}
    />);

    expect(wrapper.find(SearchForm)).to.have.length(1);
    expect(wrapper.find(PersonInfo)).to.have.length(0);
    expect(wrapper.find(FagsakList)).to.have.length(0);
  });
});
