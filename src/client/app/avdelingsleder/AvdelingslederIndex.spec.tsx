import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import Tabs from 'nav-frontend-tabs';
import sinon from 'sinon';
import { RestApiGlobalStatePathsKeys } from 'api/k9LosApi';
import * as useTrackRouteParam from 'app/data/trackRouteParam';
import RestApiTestMocker from 'testHelpers/RestApiTestMocker';
import ReservasjonerIndex from 'avdelingsleder/reservasjoner/ReservasjonerIndex';
import BemanningIndex from 'avdelingsleder/bemanning/BemanningIndex';
import IkkeTilgangTilAvdelingslederPanel from './components/IkkeTilgangTilAvdelingslederPanel';
import EndreBehandlingskoerIndex from './behandlingskoer/EndreBehandlingskoerIndex';
import NokkeltallIndex from './nokkeltall/NokkeltallIndex';
import AvdelingslederPanels from './avdelingslederPanels';
import { AvdelingslederIndex } from './AvdelingslederIndex';

const navAnsatt = {
  kanOppgavestyre: true,
};

const location = {
  hash: '23',
  pathname: '/test/',
  state: {},
  search: '',
};

describe('<AvdelingslederIndex>', () => {
  it('skal vise alle tre panelene', () => {
    const contextStub = sinon.stub(useTrackRouteParam, 'default').callsFake(() => ({
      selected: AvdelingslederPanels.BEHANDLINGSKOER, location,
    }));
    new RestApiTestMocker()
      .withGlobalData(RestApiGlobalStatePathsKeys.NAV_ANSATT, navAnsatt)
      .withDummyRunner()
      .runTest(() => {
        const wrapper = shallow(<AvdelingslederIndex />);

        const tab = wrapper.find(Tabs);
        expect(tab).to.have.length(1);

        const tabs = tab.prop('tabs');
        expect(tabs).to.have.length(3);
        expect(tabs[0].label.props.children.props.id).to.eql('AvdelingslederIndex.Behandlingskoer');
        expect(tabs[0].aktiv).is.true;
        expect(tabs[1].label.props.children.props.id).to.eql('AvdelingslederIndex.Nokkeltall');
        expect(tabs[1].aktiv).is.false;
        expect(tabs[2].label.props.children.props.id).to.eql('AvdelingslederIndex.Reservasjoner');
        expect(tabs[2].aktiv).is.false;
      });
    contextStub.restore();
  });

  it('skal rendre panel for behandlingskoer og saksbehandlere når dette er valgt', () => {
    const contextStub = sinon.stub(useTrackRouteParam, 'default').callsFake(() => ({
      selected: AvdelingslederPanels.BEHANDLINGSKOER, location,
    }));
    new RestApiTestMocker()
      .withGlobalData(RestApiGlobalStatePathsKeys.NAV_ANSATT, navAnsatt)
      .withDummyRunner()
      .runTest(() => {
        const wrapper = shallow(<AvdelingslederIndex />);

        expect(wrapper.find(EndreBehandlingskoerIndex)).to.have.length(1);
        expect(wrapper.find(BemanningIndex)).to.have.length(1);
      });
    contextStub.restore();
  });

  it('skal rendre panel for nøkkeltall når dette er valgt', () => {
    const contextStub = sinon.stub(useTrackRouteParam, 'default').callsFake(() => ({
      selected: AvdelingslederPanels.NOKKELTALL, location,
    }));
    new RestApiTestMocker()
      .withGlobalData(RestApiGlobalStatePathsKeys.NAV_ANSATT, navAnsatt)
      .withDummyRunner()
      .runTest(() => {
        const wrapper = shallow(<AvdelingslederIndex />);

        expect(wrapper.find(NokkeltallIndex)).to.have.length(1);
      });
    contextStub.restore();
  });

  it('skal rendre panel for reservasjoner når dette er valgt', () => {
    const contextStub = sinon.stub(useTrackRouteParam, 'default').callsFake(() => ({
      selected: AvdelingslederPanels.RESERVASJONER, location,
    }));
    new RestApiTestMocker()
      .withGlobalData(RestApiGlobalStatePathsKeys.NAV_ANSATT, navAnsatt)
      .withDummyRunner()
      .runTest(() => {
        const wrapper = shallow(<AvdelingslederIndex />);

        expect(wrapper.find(ReservasjonerIndex)).to.have.length(1);
      });
    contextStub.restore();
  });

  it('skal vise at en ikke har tilgang til avdelingsleder-siden', () => {
    const navAnsattIkkeOppgavestyrer = {
      kanOppgavestyre: false,
    };
    const contextStub = sinon.stub(useTrackRouteParam, 'default').callsFake(() => ({
      selected: AvdelingslederPanels.RESERVASJONER, location,
    }));
    new RestApiTestMocker()
      .withGlobalData(RestApiGlobalStatePathsKeys.NAV_ANSATT, navAnsattIkkeOppgavestyrer)
      .withDummyRunner()
      .runTest(() => {
        const wrapper = shallow(<AvdelingslederIndex />);

        expect(wrapper.find(IkkeTilgangTilAvdelingslederPanel)).to.have.length(1);
      });
    contextStub.restore();
  });
});
