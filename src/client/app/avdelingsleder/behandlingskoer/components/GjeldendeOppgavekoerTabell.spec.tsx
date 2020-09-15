import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';
import { FormattedMessage } from 'react-intl';
import behandlingType from 'kodeverk/behandlingType';
import fagsakYtelseType from 'kodeverk/fagsakYtelseType';
import Table from 'sharedComponents/Table';
import TableRow from 'sharedComponents/TableRow';
import TableColumn from 'sharedComponents/TableColumn';
import UtvalgskriterierForOppgavekoForm
  from 'avdelingsleder/behandlingskoer/components/oppgavekoForm/UtvalgskriterierForOppgavekoForm';
import { Knapp } from 'nav-frontend-knapper';
import { GjeldendeOppgavekoerTabell } from './GjeldendeOppgavekoerTabell';

describe('<GjeldendeOppgavekoerTabell>', () => {
  const behandlingstyper = [{
    kode: behandlingType.FORSTEGANGSSOKNAD,
    navn: '',
  }, {
    kode: behandlingType.REVURDERING,
    navn: '',
  },
  ];
  const fagsakYtelseTyper = [{
    kode: fagsakYtelseType.OMSORGSPENGER,
    navn: '',
  }, {
    kode: fagsakYtelseType.PLEIEPENGER_SYKT_BARN,
    navn: '',
  },
  ];

  it('skal ikke vise tabell når ingen oppgavekoer finnes', () => {
    const oppgavekoer = [];

    const wrapper = shallow(<GjeldendeOppgavekoerTabell
      oppgavekoer={oppgavekoer}
      setValgtOppgavekoId={sinon.spy()}
      lagNyOppgaveko={sinon.spy()}
      fjernOppgaveko={sinon.spy()}
      hentKo={sinon.spy()}
      behandlingTyper={behandlingstyper}
      fagsakYtelseTyper={fagsakYtelseTyper}
      hentAntallOppgaverForOppgaveko={sinon.spy()}
      knyttSaksbehandlerTilOppgaveko={sinon.spy()}
      lagreOppgavekoAndreKriterier={sinon.spy()}
      lagreOppgavekoBehandlingstype={sinon.spy()}
      lagreOppgavekoFagsakYtelseType={sinon.spy()}
      lagreOppgavekoNavn={sinon.spy()}
      lagreOppgavekoSkjermet={sinon.spy()}
    />);

    const tekstComp = wrapper.find(FormattedMessage);
    expect(tekstComp).to.have.length(2);
    expect(tekstComp.at(1).prop('id')).to.eql('GjeldendeOppgavekoerTabell.IngenLister');

    expect(wrapper.find(Table)).to.have.length(0);
  });

  it('skal vise to oppgavekoer', () => {
    const oppgavekoer = [{
      id: '1',
      navn: 'Nyansatte',
      sistEndret: '2017-08-31',
      erTilBeslutter: false,
      erRegistrerPapirsoknad: false,
      saksbehandlere: [],
      skjermet: false,
      antallBehandlinger: 38,
    }, {
      id: '2',
      navn: 'Kun foreldrepenger',
      sistEndret: '2018-08-31',
      erTilBeslutter: false,
      erRegistrerPapirsoknad: false,
      saksbehandlere: [],
      skjermet: false,
      antallBehandlinger: 54,
    }];

    const wrapper = shallow(<GjeldendeOppgavekoerTabell
      oppgavekoer={oppgavekoer}
      setValgtOppgavekoId={sinon.spy()}
      lagNyOppgaveko={sinon.spy()}
      fjernOppgaveko={sinon.spy()}
      hentKo={sinon.spy()}
      behandlingTyper={behandlingstyper}
      fagsakYtelseTyper={fagsakYtelseTyper}
      hentAntallOppgaverForOppgaveko={sinon.spy()}
      knyttSaksbehandlerTilOppgaveko={sinon.spy()}
      lagreOppgavekoAndreKriterier={sinon.spy()}
      lagreOppgavekoBehandlingstype={sinon.spy()}
      lagreOppgavekoFagsakYtelseType={sinon.spy()}
      lagreOppgavekoNavn={sinon.spy()}
      lagreOppgavekoSkjermet={sinon.spy()}
    />);

    expect(wrapper.find(FormattedMessage)).to.have.length(5);
    expect(wrapper.find(Table)).to.have.length(1);
    const rader = wrapper.find(TableRow);
    expect(rader).to.have.length(2);

    const kolonnerForRad1 = rader.first().find(TableColumn);
    expect(kolonnerForRad1).to.have.length(7);
    expect(kolonnerForRad1.first().childAt(0).text()).to.eql('Nyansatte');

    const kolonnerForRad2 = rader.last().find(TableColumn);
    expect(kolonnerForRad2).to.have.length(7);
    expect(kolonnerForRad2.first().childAt(0).text()).to.eql('Kun foreldrepenger');
  });

  it('skal legge til ny oppgavekø ved musklikk', () => {
    const oppgavekoer = [];
    const lagNyOppgavekoFn = sinon.spy();

    const wrapper = shallow(<GjeldendeOppgavekoerTabell
      oppgavekoer={oppgavekoer}
      setValgtOppgavekoId={sinon.spy()}
      lagNyOppgaveko={lagNyOppgavekoFn}
      fjernOppgaveko={sinon.spy()}
      behandlingTyper={behandlingstyper}
      fagsakYtelseTyper={fagsakYtelseTyper}
      hentKo={sinon.spy()}
      hentAntallOppgaverForOppgaveko={sinon.spy()}
      knyttSaksbehandlerTilOppgaveko={sinon.spy()}
      lagreOppgavekoAndreKriterier={sinon.spy()}
      lagreOppgavekoBehandlingstype={sinon.spy()}
      lagreOppgavekoFagsakYtelseType={sinon.spy()}
      lagreOppgavekoNavn={sinon.spy()}
      lagreOppgavekoSkjermet={sinon.spy()}
    />);

    const leggTilListe = wrapper.find(Knapp).first();
    expect(leggTilListe).to.have.length(1);

    leggTilListe.prop('onClick')();

    expect(lagNyOppgavekoFn.calledOnce).to.be.true;
  });

  it('skal legge til ny oppgavekø ved trykk på enter-knapp', () => {
    const oppgavekoer = [];
    const lagNyOppgavekoFn = sinon.spy();

    const wrapper = shallow(<GjeldendeOppgavekoerTabell
      oppgavekoer={oppgavekoer}
      setValgtOppgavekoId={sinon.spy()}
      lagNyOppgaveko={lagNyOppgavekoFn}
      fjernOppgaveko={sinon.spy()}
      behandlingTyper={behandlingstyper}
      fagsakYtelseTyper={fagsakYtelseTyper}
      hentAntallOppgaverForOppgaveko={sinon.spy()}
      knyttSaksbehandlerTilOppgaveko={sinon.spy()}
      lagreOppgavekoAndreKriterier={sinon.spy()}
      lagreOppgavekoBehandlingstype={sinon.spy()}
      lagreOppgavekoFagsakYtelseType={sinon.spy()}
      lagreOppgavekoNavn={sinon.spy()}
      lagreOppgavekoSkjermet={sinon.spy()}
      hentKo={sinon.spy()}
    />);

    const leggTilListe = wrapper.find(Knapp).first();
    expect(leggTilListe).to.have.length(1);

    leggTilListe.prop('onKeyDown')({
      keyCode: 13,
    });

    expect(lagNyOppgavekoFn.calledOnce).to.be.true;
  });

  it('skal sette valgt oppgavekø ved trykk på rad i tabell', async () => {
    const oppgavekoer = [{
      id: '1',
      navn: 'Nyansatte',
      sistEndret: '2017-08-31',
      erTilBeslutter: false,
      erRegistrerPapirsoknad: false,
      saksbehandlere: [],
      skjermet: false,
      antallBehandlinger: 78,
    }];
    const setValgtOppgavekoIdFn = sinon.spy();

    const wrapper = shallow(<GjeldendeOppgavekoerTabell
      oppgavekoer={oppgavekoer}
      setValgtOppgavekoId={setValgtOppgavekoIdFn}
      hentKo={sinon.spy()}
      lagNyOppgaveko={sinon.spy()}
      fjernOppgaveko={sinon.spy()}
      hentAntallOppgaverForOppgaveko={sinon.spy()}
      knyttSaksbehandlerTilOppgaveko={sinon.spy()}
      lagreOppgavekoAndreKriterier={sinon.spy()}
      lagreOppgavekoBehandlingstype={sinon.spy()}
      lagreOppgavekoFagsakYtelseType={sinon.spy()}
      lagreOppgavekoNavn={sinon.spy()}
      lagreOppgavekoSkjermet={sinon.spy()}
      behandlingTyper={behandlingstyper}
      fagsakYtelseTyper={fagsakYtelseTyper}
    />);

    const rader = wrapper.find(TableRow);
    expect(rader).to.have.length(1);

    await rader.prop('onKeyDown')();

    expect(setValgtOppgavekoIdFn.calledOnce).to.be.true;
  });

  it('skal vise antall saksbehandlere tilknyttet oppgavekøen', () => {
    const oppgavekoer = [{
      id: '1',
      navn: 'Nyansatte',
      sistEndret: '2017-08-31',
      erTilBeslutter: false,
      skjermet: false,
      erRegistrerPapirsoknad: false,
      saksbehandlere: [{
        navn: 'Sara',
        brukerIdent: 'fslkjd',
        epost: 'epost',
        oppgavekoer: ['OMP'],

      }],
      antallBehandlinger: 78,
    }];

    const wrapper = shallow(<GjeldendeOppgavekoerTabell
      oppgavekoer={oppgavekoer}
      setValgtOppgavekoId={sinon.spy()}
      lagNyOppgaveko={sinon.spy()}
      fjernOppgaveko={sinon.spy()}
      hentKo={sinon.spy()}
      hentAntallOppgaverForOppgaveko={sinon.spy()}
      knyttSaksbehandlerTilOppgaveko={sinon.spy()}
      lagreOppgavekoAndreKriterier={sinon.spy()}
      lagreOppgavekoBehandlingstype={sinon.spy()}
      lagreOppgavekoFagsakYtelseType={sinon.spy()}
      lagreOppgavekoNavn={sinon.spy()}
      lagreOppgavekoSkjermet={sinon.spy()}
      behandlingTyper={behandlingstyper}
      fagsakYtelseTyper={fagsakYtelseTyper}
    />);

    expect(wrapper.find(Table)).to.have.length(1);
    const rader = wrapper.find(TableRow);
    expect(rader).to.have.length(1);

    const kolonnerForRad = rader.first().find(TableColumn);
    expect(kolonnerForRad).to.have.length(7);
    expect(kolonnerForRad.at(3).childAt(0).text()).to.eql('1');
  });

  it('skal vise editeringspanel når en har valgt tabellrad', () => {
    const oppgavekoer = [{
      id: '1',
      navn: 'Espen Utvikler',
      sistEndret: '2017-08-31',
      erTilBeslutter: false,
      erRegistrerPapirsoknad: false,
      saksbehandlere: [],
      skjermet: false,
      antallBehandlinger: 78,
    }];

    const wrapper = shallow(<GjeldendeOppgavekoerTabell
      oppgavekoer={oppgavekoer}
      setValgtOppgavekoId={sinon.spy()}
      lagNyOppgaveko={sinon.spy()}
      hentKo={sinon.spy()}
      behandlingTyper={behandlingstyper}
      fagsakYtelseTyper={fagsakYtelseTyper}
      fjernOppgaveko={sinon.spy()}
      lagreOppgavekoNavn={sinon.spy()}
      lagreOppgavekoBehandlingstype={sinon.spy()}
      lagreOppgavekoFagsakYtelseType={sinon.spy()}
      lagreOppgavekoAndreKriterier={sinon.spy()}
      lagreOppgavekoSkjermet={sinon.spy()}
      valgtOppgavekoId="1"
      knyttSaksbehandlerTilOppgaveko={sinon.spy()}
      hentOppgavekonsSaksbehandlere={sinon.spy()}
      hentAntallOppgaverForOppgaveko={sinon.spy()}
      hentAntallOppgaverTotalt={sinon.spy()}
      showSaksbehandlerPanel
    />);

    expect(wrapper.find(UtvalgskriterierForOppgavekoForm)).to.have.length(1);
  });
});
