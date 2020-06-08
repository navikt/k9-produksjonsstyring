import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';

import OppgavekoPanel from './components/OppgavekoPanel';
import { BehandlingskoerIndex } from './BehandlingskoerIndex';

describe('<BehandlingskoerIndex>', () => {
  const oppgavekoer = [{
    id: '1',
    navn: 'test',
    behandlingTyper: [{
      kode: 'test',
      navn: 'test',
    }],
    fagsakYtelseTyper: [{
      kode: 'test',
      navn: 'test',
    }],
    andreKriterier: [{
      andreKriterierType: {
        kode: 'test',
        navn: 'test',
      },
      inkluder: true,
    }],
    sortering: {
      sorteringType: {
        kode: 'test',
        navn: 'test',
      },
      fomDato: '2019-01-01',
      tomDato: '2019-01-10',
    },
  }];

  const oppgave = {
    eksternId: '1',
    status: {
      erReservert: false,
    },
    saksnummer: 12343,
    behandlingId: 1,
    personnummer: 1234567891,
    navn: 'Espen Uteligger',
    system: 'K9SAK',
    behandlingstype: {
      kode: 'TEST',
      navn: 'test',
    },
    opprettetTidspunkt: '2018-01-12',
    behandlingsfrist: '2018-01-12',
    fagsakYtelseType: {
      kode: 'TEST',
      navn: 'test',
    },
    erTilSaksbehandling: true,
  };

  it('skal ikke vise behandlingskøer når det ikke finnes oppgavekoer', () => {
    const fetchOppgavekoer = sinon.spy();
    const wrapper = shallow(<BehandlingskoerIndex
      k9sakUrl="www.k9sak.no"
      k9tilbakeUrl="www.k9tilbake.no"
      fetchOppgaverTilBehandling={sinon.spy()}
      fetchReserverteOppgaver={sinon.spy()}
      fetchAlleOppgavekoer={fetchOppgavekoer}
      reserverOppgave={sinon.spy()}
      opphevOppgaveReservasjon={sinon.spy()}
      forlengOppgaveReservasjon={sinon.spy()}
      fetchOppgaverTilBehandlingOppgaver={sinon.spy()}
      flyttReservasjon={sinon.spy()}
      goToUrl={sinon.spy()}
      setValgtOppgavekoId={sinon.spy()}
    />);

    expect(wrapper.find(OppgavekoPanel)).to.have.length(0);
    expect(fetchOppgavekoer.calledOnce).to.be.true;
  });

  it('skal hente behandlingskøer ved lasting av komponent og så vise desse korrekt', () => {
    const fetchOppgavekoer = sinon.spy();
    const wrapper = shallow(<BehandlingskoerIndex
      k9sakUrl="www.k9sak.no"
      k9tilbakeUrl="www.k9tilbake.no"
      fetchOppgaverTilBehandling={sinon.spy()}
      fetchReserverteOppgaver={sinon.spy()}
      fetchAlleOppgavekoer={fetchOppgavekoer}
      reserverOppgave={sinon.spy()}
      opphevOppgaveReservasjon={sinon.spy()}
      forlengOppgaveReservasjon={sinon.spy()}
      fetchOppgaverTilBehandlingOppgaver={sinon.spy()}
      flyttReservasjon={sinon.spy()}
      oppgavekoer={oppgavekoer}
      goToUrl={sinon.spy()}
      setValgtOppgavekoId={sinon.spy()}
    />);

    expect(wrapper.find(OppgavekoPanel)).to.have.length(1);
    expect(fetchOppgavekoer.calledOnce).to.be.true;
  });

  it('skal oppheve reservasjon og så hente reserverte oppgaver på nytt', async () => {
    const opphevOppgaveReservasjonFn = sinon.stub().withArgs(oppgave.eksternId).resolves();
    const fetchReserverteOppgaverFn = sinon.spy();
    const wrapper = shallow(<BehandlingskoerIndex
      k9sakUrl="www.k9sak.no"
      k9tilbakeUrl="www.k9tilbake.no"
      fetchOppgaverTilBehandling={sinon.spy()}
      fetchReserverteOppgaver={fetchReserverteOppgaverFn}
      fetchAlleOppgavekoer={sinon.spy()}
      reserverOppgave={sinon.spy()}
      opphevOppgaveReservasjon={opphevOppgaveReservasjonFn}
      forlengOppgaveReservasjon={sinon.spy()}
      fetchOppgaverTilBehandlingOppgaver={sinon.spy()}
      flyttReservasjon={sinon.spy()}
      oppgavekoer={oppgavekoer}
      goToUrl={sinon.spy()}
      setValgtOppgavekoId={sinon.spy()}
    />);

    const panel = wrapper.find(OppgavekoPanel);
    expect(panel).to.have.length(1);

    const oppgaveId = '1';
    const begrunnelse = 'Dette er en begrunnelse';
    const id = '1';
    wrapper.setState({ id });
    await panel.prop('opphevOppgaveReservasjon')(oppgaveId, begrunnelse);

    expect(opphevOppgaveReservasjonFn.calledOnce).to.be.true;
    const { args } = opphevOppgaveReservasjonFn.getCalls()[0];
    expect(args).to.have.length(2);
    expect(args[0]).to.eql(oppgaveId);
    expect(args[1]).to.eql(begrunnelse);

    expect(fetchReserverteOppgaverFn.calledOnce).to.be.true;
    const { args: args2 } = fetchReserverteOppgaverFn.getCalls()[0];
    expect(args2).to.have.length(1);
    expect(args2[0]).to.eql(id);
  });

  it('skal forlenge reservasjon og så hente reserverte oppgaver på nytt', async () => {
    const forlengOppgaveReservasjonFn = sinon.stub().withArgs(oppgave.eksternId).resolves();
    const fetchReserverteOppgaverFn = sinon.spy();
    const wrapper = shallow(<BehandlingskoerIndex
      k9sakUrl="www.k9sak.no"
      k9tilbakeUrl="www.k9tilbake.no"
      fetchOppgaverTilBehandling={sinon.spy()}
      fetchReserverteOppgaver={fetchReserverteOppgaverFn}
      fetchAlleOppgavekoer={sinon.spy()}
      reserverOppgave={sinon.spy()}
      opphevOppgaveReservasjon={sinon.spy()}
      forlengOppgaveReservasjon={forlengOppgaveReservasjonFn}
      fetchOppgaverTilBehandlingOppgaver={sinon.spy()}
      flyttReservasjon={sinon.spy()}
      oppgavekoer={oppgavekoer}
      goToUrl={sinon.spy()}
      setValgtOppgavekoId={sinon.spy()}
    />);

    const panel = wrapper.find(OppgavekoPanel);
    expect(panel).to.have.length(1);

    const oppgaveId = '1';
    const id = '1';
    wrapper.setState({ id });
    await panel.prop('forlengOppgaveReservasjon')(oppgaveId);

    expect(forlengOppgaveReservasjonFn.calledOnce).to.be.true;
    const { args } = forlengOppgaveReservasjonFn.getCalls()[0];
    expect(args).to.have.length(1);
    expect(args[0]).to.eql(oppgaveId);

    expect(fetchReserverteOppgaverFn.calledOnce).to.be.true;
    const { args: args2 } = fetchReserverteOppgaverFn.getCalls()[0];
    expect(args2).to.have.length(1);
    expect(args2[0]).to.eql(id);
  });

  it('skal flytte reservasjon og så hente reserverte oppgaver på nytt', async () => {
    const flyttReservasjonFn = sinon.stub().withArgs(oppgave.eksternId).resolves();
    const fetchReserverteOppgaverFn = sinon.spy();
    const wrapper = shallow(<BehandlingskoerIndex
      k9sakUrl="www.k9sak.no"
      k9tilbakeUrl="www.k9tilbake.no"
      fetchOppgaverTilBehandling={sinon.spy()}
      fetchReserverteOppgaver={fetchReserverteOppgaverFn}
      fetchAlleOppgavekoer={sinon.spy()}
      reserverOppgave={sinon.spy()}
      opphevOppgaveReservasjon={sinon.spy()}
      forlengOppgaveReservasjon={sinon.spy()}
      fetchOppgaverTilBehandlingOppgaver={sinon.spy()}
      flyttReservasjon={flyttReservasjonFn}
      oppgavekoer={oppgavekoer}
      goToUrl={sinon.spy()}
      setValgtOppgavekoId={sinon.spy()}
    />);

    const panel = wrapper.find(OppgavekoPanel);
    expect(panel).to.have.length(1);

    const oppgaveId = '1';
    const brukerIdent = 'T122334';
    const begrunnelse = 'Dette er en begrunnelse';
    const id = '1';
    wrapper.setState({ id });
    await panel.prop('flyttReservasjon')(oppgaveId, brukerIdent, begrunnelse);

    expect(flyttReservasjonFn.calledOnce).to.be.true;
    const { args } = flyttReservasjonFn.getCalls()[0];
    expect(args).to.have.length(3);
    expect(args[0]).to.eql(oppgaveId);
    expect(args[1]).to.eql(brukerIdent);
    expect(args[2]).to.eql(begrunnelse);

    expect(fetchReserverteOppgaverFn.calledOnce).to.be.true;
    const { args: args2 } = fetchReserverteOppgaverFn.getCalls()[0];
    expect(args2).to.have.length(1);
    expect(args2[0]).to.eql(id);
  });
});
