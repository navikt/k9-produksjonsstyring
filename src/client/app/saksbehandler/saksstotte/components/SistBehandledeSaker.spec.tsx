
import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import Lenke from 'nav-frontend-lenker';

import { SistBehandledeSaker } from './SistBehandledeSaker';

describe('<SistBehandledeSaker>', () => {
  it('skal vise sist behandlede saker som lenker i en liste', () => {
    const oppgaver = [{
      eksternId: '3',
      status: {
        erReservert: false,
      },
      saksnummer: '1',
      behandlingId: 1,
      personnummer: '123456789',
      navn: 'Espen Utvikler',
      system: 'K9SAK',
      behandlingstype: {
        kode: 'test',
        navn: 'test',
      },
      behandlingStatus: {
        kode: 'test',
        navn: 'test',
      },
      opprettetTidspunkt: '2018-01-01',
      behandlingsfrist: '2018-01-01',
      fagsakYtelseType: {
        kode: 'test',
        navn: 'test',
      },
      erTilSaksbehandling: true,
    }, {
      eksternId: '4',
      status: {
        erReservert: false,
      },
      saksnummer: '2',
      behandlingId: 2,
      personnummer: '657643535',
      navn: 'Espen Solstråle',
      system: 'K9SAK',
      behandlingstype: {
        kode: 'test',
        navn: 'test',
      },
      behandlingStatus: {
        kode: 'test',
        navn: 'test',
      },
      opprettetTidspunkt: '2018-01-01',
      behandlingsfrist: '2018-01-01',
      fagsakYtelseType: {
        kode: 'test',
        navn: 'test',
      },
      erTilSaksbehandling: true,
    }];

    const wrapper = shallow(<SistBehandledeSaker
      k9sakUrl="www.k9sak.no"
      sistBehandledeSaker={oppgaver}
    />);

    const links = wrapper.find(Lenke);
    expect(links).to.have.length(2);
    expect(links.first().prop('href')).to.eql('www.k9sak.no/fagsak/1/behandling/1/?punkt=default&fakta=default');
    expect(links.first().childAt(0).text()).to.eql('Espen Utvikler 123456789');
    expect(links.last().prop('href')).to.eql('www.k9sak.no/fagsak/2/behandling/2/?punkt=default&fakta=default');
    expect(links.last().childAt(0).text()).to.eql('Espen Solstråle 657643535');
  });

  it('skal ikke vise noen lenker når ingen behandlede saker blir funnet', () => {
    const oppgaver = [];
    const wrapper = shallow(<SistBehandledeSaker
      k9sakUrl="www.k9sak.no"
      sistBehandledeSaker={oppgaver}
    />);

    expect(wrapper.find(Lenke)).to.have.length(0);
  });
});
