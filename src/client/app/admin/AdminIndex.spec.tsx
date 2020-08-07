import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import Tabs from 'nav-frontend-tabs';

import LoadingPanel from 'sharedComponents/LoadingPanel';
import { BehandlingskoerIndex } from 'saksbehandler/behandlingskoer/BehandlingskoerIndex';
import IkkeTilgangTilAvdelingslederPanel from './components/IkkeTilgangTilAvdelingslederPanel';
import EndreSaksbehandlereIndex from './driftsmeldinger/EndreDriftsmeldingerIndex';
import EndreBehandlingskoerIndex from './behandlingskoer/EndreBehandlingskoerIndex';
import AvdelingslederDashboard from './components/AvdelingslederDashboard';
import AdminPanels from './AdminPanels';
import { AdminIndex } from './AdminIndex';

describe('<AdminIndex>', () => {
  it('skal vise avdelingsleder dashboard etter at valgt avdeling er satt', () => {
    const location = {
      hash: '23',
      pathname: '/test/',
      state: {},
    };
    const wrapper = shallow(<AdminIndex
      activeAdminPanel={AdminPanels.BEHANDLINGSKOER}
      getDriftsmeldingerPanelLocation={() => location}
      kanOppgavestyre
    />);
    expect(wrapper.find(AvdelingslederDashboard)).to.have.length(1);
  });

  /* it('skal vise alle tre panelene', () => {
    const location = {
      hash: '23',
      pathname: '/test/',
      state: {},
    };
    const wrapper = shallow(<AdminIndex
      activeAvdelingslederPanel={AdminPanels.BEHANDLINGSKOER}
      getAvdelingslederPanelLocation={() => location}
      kanOppgavestyre
    />);

    const tab = wrapper.find(Tabs);
    expect(tab).to.have.length(1);

    const tabs = tab.prop('tabs');
    expect(tabs).to.have.length(3);
    expect(tabs[0].label.props.children.props.id).to.eql('AdminIndex.Behandlingskoer');
    expect(tabs[0].aktiv).is.true;
    expect(tabs[1].label.props.children.props.id).to.eql('AdminIndex.Nokkeltall');
    expect(tabs[1].aktiv).is.false;
    expect(tabs[2].label.props.children.props.id).to.eql('AdminIndex.Saksbehandlere');
    expect(tabs[2].aktiv).is.false;
  }); */

  it('skal rendre panel for oppgavekøer når dette er valgt', () => {
    const location = {
      hash: '23',
      pathname: '/test/',
      state: {},
    };
    const wrapper = shallow(<AdminIndex
      activeAdminPanel={AdminPanels.BEHANDLINGSKOER}
      getDriftsmeldingerPanelLocation={() => location}
      kanOppgavestyre
    />);

    expect(wrapper.find(EndreBehandlingskoerIndex)).to.have.length(1);
  });

  it('skal rendre panel for saksbehandlere når dette er valgt', () => {
    const location = {
      hash: '23',
      pathname: '/test/',
      state: {},
    };
    const wrapper = shallow(<AdminIndex
      activeAdminPanel={AdminPanels.SAKSBEHANDLERE}
      getDriftsmeldingerPanelLocation={() => location}
      kanOppgavestyre
    />);

    expect(wrapper.find(EndreSaksbehandlereIndex)).to.have.length(1);
  });

  /*  it('skal rendre panel for nøkkeltall når dette er valgt', () => {
    const location = {
      hash: '23',
      pathname: '/test/',
      state: {},
    };
    const wrapper = shallow(<AdminIndex
      activeAvdelingslederPanel={AdminPanels.NOKKELTALL}
      getAvdelingslederPanelLocation={() => location}
      kanOppgavestyre
    />);

    expect(wrapper.find(NokkeltallIndex)).to.have.length(1);
  }); */

  it('skal vise at en ikke har tilgang til avdelingsleder-siden', () => {
    const location = {
      hash: '23',
      pathname: '/test/',
      state: {},
    };
    const wrapper = shallow(<AdminIndex
      activeAdminPanel={AdminPanels.NOKKELTALL}
      getDriftsmeldingerPanelLocation={() => location}
      kanOppgavestyre={false}
    />);

    expect(wrapper.find(IkkeTilgangTilAvdelingslederPanel)).to.have.length(1);
  });
});
