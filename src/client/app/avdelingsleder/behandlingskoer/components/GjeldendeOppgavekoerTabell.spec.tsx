import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';
import { FormattedMessage } from 'react-intl';

import Image from 'sharedComponents/Image';
import behandlingType from 'kodeverk/behandlingType';
import fagsakYtelseType from 'kodeverk/fagsakYtelseType';
import Table from 'sharedComponents/Table';
import TableRow from 'sharedComponents/TableRow';
import TableColumn from 'sharedComponents/TableColumn';
import SletteOppgavekoModal from './SletteOppgavekoModal';
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
      behandlingTyper={behandlingstyper}
      fagsakYtelseTyper={fagsakYtelseTyper}
      hentOppgavekoer={sinon.spy()}
      hentAntallOppgaverTotalt={sinon.spy()}
    />);

    const tekstComp = wrapper.find(FormattedMessage);
    expect(tekstComp).to.have.length(4);
    expect(tekstComp.at(2).prop('id')).to.eql('GjeldendeOppgavekoerTabell.IngenLister');

    expect(wrapper.find(Table)).to.have.length(0);
  });

  it('skal vise to oppgavekoer', () => {
    const oppgavekoer = [{
      id: '1',
      navn: 'Nyansatte',
      sistEndret: '2017-08-31',
      erTilBeslutter: false,
      erRegistrerPapirsoknad: false,
      driftsmeldinger: [],
      skjermet: false,
    }, {
      id: '2',
      navn: 'Kun foreldrepenger',
      sistEndret: '2018-08-31',
      erTilBeslutter: false,
      erRegistrerPapirsoknad: false,
      driftsmeldinger: [],
      skjermet: false,
    }];

    const wrapper = shallow(<GjeldendeOppgavekoerTabell
      oppgavekoer={oppgavekoer}
      setValgtOppgavekoId={sinon.spy()}
      lagNyOppgaveko={sinon.spy()}
      fjernOppgaveko={sinon.spy()}
      behandlingTyper={behandlingstyper}
      fagsakYtelseTyper={fagsakYtelseTyper}
      hentOppgavekoer={sinon.spy()}
      hentAntallOppgaverTotalt={sinon.spy()}
    />);

    expect(wrapper.find(FormattedMessage)).to.have.length(7);
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
      hentOppgavekoer={sinon.spy()}
      hentAntallOppgaverTotalt={sinon.spy()}
    />);

    const leggTilListe = wrapper.find('div#leggTilListe');
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
      hentOppgavekoer={sinon.spy()}
      hentAntallOppgaverTotalt={sinon.spy()}
    />);

    const leggTilListe = wrapper.find('div#leggTilListe');
    expect(leggTilListe).to.have.length(1);

    leggTilListe.prop('onKeyDown')({
      keyCode: 13,
    });

    expect(lagNyOppgavekoFn.calledOnce).to.be.true;
  });

  it('skal ikke legge til ny oppgavekø ved trykk på annen knapp enn enter', () => {
    const oppgavekoer = [];
    const lagNyOppgavekoFn = sinon.spy();

    const wrapper = shallow(<GjeldendeOppgavekoerTabell
      oppgavekoer={oppgavekoer}
      setValgtOppgavekoId={sinon.spy()}
      lagNyOppgaveko={lagNyOppgavekoFn}
      fjernOppgaveko={sinon.spy()}
      behandlingTyper={behandlingstyper}
      fagsakYtelseTyper={fagsakYtelseTyper}
      hentOppgavekoer={sinon.spy()}
      hentAntallOppgaverTotalt={sinon.spy()}
    />);

    const leggTilListe = wrapper.find('div#leggTilListe');
    expect(leggTilListe).to.have.length(1);

    leggTilListe.prop('onKeyDown')({
      keyCode: 10,
    });

    expect(lagNyOppgavekoFn.calledOnce).to.be.false;
  });

  it('skal sette valgt oppgavekø ved trykk på rad i tabell', async () => {
    const oppgavekoer = [{
      id: '1',
      navn: 'Nyansatte',
      sistEndret: '2017-08-31',
      erTilBeslutter: false,
      erRegistrerPapirsoknad: false,
      driftsmeldinger: [],
      skjermet: false,
    }];
    const setValgtOppgavekoIdFn = sinon.spy();

    const wrapper = shallow(<GjeldendeOppgavekoerTabell
      oppgavekoer={oppgavekoer}
      setValgtOppgavekoId={setValgtOppgavekoIdFn}
      lagNyOppgaveko={sinon.spy()}
      fjernOppgaveko={sinon.spy()}
      behandlingTyper={behandlingstyper}
      fagsakYtelseTyper={fagsakYtelseTyper}
      hentOppgavekoer={sinon.spy()}
      hentAntallOppgaverTotalt={sinon.spy()}
    />);

    const rader = wrapper.find(TableRow);
    expect(rader).to.have.length(1);

    await rader.prop('onKeyDown')();

    expect(setValgtOppgavekoIdFn.calledOnce).to.be.true;
  });

  it('skal vise modal for å slette oppgavekø ved trykk på slette-knapp', () => {
    const oppgavekoer = [{
      id: '1',
      navn: 'Nyansatte',
      sistEndret: '2017-08-31',
      erTilBeslutter: false,
      erRegistrerPapirsoknad: false,
      driftsmeldinger: [],
      skjermet: false,
    }];
    const wrapper = shallow(<GjeldendeOppgavekoerTabell
      oppgavekoer={oppgavekoer}
      setValgtOppgavekoId={sinon.spy()}
      lagNyOppgaveko={sinon.spy()}
      fjernOppgaveko={sinon.spy()}
      behandlingTyper={behandlingstyper}
      fagsakYtelseTyper={fagsakYtelseTyper}
      hentOppgavekoer={sinon.spy()}
      hentAntallOppgaverTotalt={sinon.spy()}
    />);

    const rader = wrapper.find(TableRow);
    expect(rader).to.have.length(1);

    const kolonner = rader.first().find(TableColumn);
    const bildeKnapp = kolonner.last().find(Image);
    expect(bildeKnapp).to.have.length(1);

    expect(wrapper.find(SletteOppgavekoModal)).to.have.length(0);

    bildeKnapp.prop('onMouseDown')();

    expect(wrapper.find(SletteOppgavekoModal)).to.have.length(1);
    expect(wrapper.state().valgtOppgaveko).is.eql(oppgavekoer[0]);
  });

  it('skal lukke modal ved trykk på avbryt i modal', () => {
    const oppgavekoer = [{
      id: '1',
      navn: 'Nyansatte',
      sistEndret: '2017-08-31',
      erTilBeslutter: false,
      erRegistrerPapirsoknad: false,
      driftsmeldinger: [],
      skjermet: false,
    }];
    const wrapper = shallow(<GjeldendeOppgavekoerTabell
      oppgavekoer={oppgavekoer}
      setValgtOppgavekoId={sinon.spy()}
      lagNyOppgaveko={sinon.spy()}
      fjernOppgaveko={sinon.spy()}
      behandlingTyper={behandlingstyper}
      fagsakYtelseTyper={fagsakYtelseTyper}
      hentOppgavekoer={sinon.spy()}
      hentAntallOppgaverTotalt={sinon.spy()}
    />);

    const rader = wrapper.find(TableRow);
    const kolonner = rader.first().find(TableColumn);
    const bildeKnapp = kolonner.last().find(Image);

    bildeKnapp.prop('onMouseDown')();

    const modal = wrapper.find(SletteOppgavekoModal);
    expect(modal).to.have.length(1);

    modal.prop('cancel')();

    expect(wrapper.find(SletteOppgavekoModal)).to.have.length(0);
    expect(wrapper.state().valgtOppgaveko).is.undefined;
  });

  it('skal fjerne oppgavekø ved trykk på ok i modal', () => {
    const oppgavekoer = [{
      id: '1',
      navn: 'Nyansatte',
      sistEndret: '2017-08-31',
      erTilBeslutter: false,
      erRegistrerPapirsoknad: false,
      driftsmeldinger: [],
      skjermet: false,
    }];
    const fjernOppgavekoerFn = sinon.spy();
    const wrapper = shallow(<GjeldendeOppgavekoerTabell
      oppgavekoer={oppgavekoer}
      setValgtOppgavekoId={sinon.spy()}
      lagNyOppgaveko={sinon.spy()}
      fjernOppgaveko={fjernOppgavekoerFn}
      behandlingTyper={behandlingstyper}
      fagsakYtelseTyper={fagsakYtelseTyper}
      hentOppgavekoer={sinon.spy()}
      hentAntallOppgaverTotalt={sinon.spy()}
    />);

    const rader = wrapper.find(TableRow);
    const kolonner = rader.first().find(TableColumn);
    const bildeKnapp = kolonner.last().find(Image);

    bildeKnapp.prop('onMouseDown')();

    const modal = wrapper.find(SletteOppgavekoModal);
    expect(modal).to.have.length(1);

    modal.prop('submit')(oppgavekoer[0]);

    expect(wrapper.find(SletteOppgavekoModal)).to.have.length(0);
    expect(wrapper.state().valgtOppgaveko).is.undefined;

    expect(fjernOppgavekoerFn.calledOnce).to.be.true;
    const { args } = fjernOppgavekoerFn.getCalls()[0];
    expect(args).to.have.length(1);
    expect(args[0]).to.eql(oppgavekoer[0].id);
  });

  it('skal vise antall saksbehandlere tilknyttet oppgavekøen', () => {
    const oppgavekoer = [{
      id: '1',
      navn: 'Nyansatte',
      sistEndret: '2017-08-31',
      erTilBeslutter: false,
      skjermet: false,
      erRegistrerPapirsoknad: false,
      driftsmeldinger: [{
        navn: 'Sara',
        brukerIdent: 'fslkjd',
        epost: 'epost',

      }],
    }];

    const wrapper = shallow(<GjeldendeOppgavekoerTabell
      oppgavekoer={oppgavekoer}
      setValgtOppgavekoId={sinon.spy()}
      lagNyOppgaveko={sinon.spy()}
      fjernOppgaveko={sinon.spy()}
      behandlingTyper={behandlingstyper}
      fagsakYtelseTyper={fagsakYtelseTyper}
      hentOppgavekoer={sinon.spy()}
      hentAntallOppgaverTotalt={sinon.spy()}
    />);

    expect(wrapper.find(Table)).to.have.length(1);
    const rader = wrapper.find(TableRow);
    expect(rader).to.have.length(1);

    const kolonnerForRad = rader.first().find(TableColumn);
    expect(kolonnerForRad).to.have.length(7);
    expect(kolonnerForRad.at(3).childAt(0).text()).to.eql('1');
  });
});
