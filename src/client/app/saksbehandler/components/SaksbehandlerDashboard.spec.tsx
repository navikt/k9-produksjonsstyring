import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import * as useRestApiData from 'api/rest-api-hooks/src/global-data/useGlobalStateRestApiData';
import BehandlingskoerIndex from '../behandlingskoer/BehandlingskoerIndex';
import FagsakSearchIndex from '../fagsakSearch/FagsakSearchIndex';
import SaksstotteIndex from '../saksstotte/SaksstotteIndex';
import { SaksbehandlerDashboard } from './SaksbehandlerDashboard';

describe('<SaksbehandlerDashboard>', () => {
	let contextStub;

	it('skal vise dashboard uten fagsak-søk', () => {
		contextStub = sinon.stub(useRestApiData, 'default').callsFake(() => 'url');

		const wrapper = shallow(<SaksbehandlerDashboard valgtOppgavekoId="1" setValgtOppgavekoId={() => undefined} />);

		expect(wrapper.find(BehandlingskoerIndex)).to.have.length(1);
		expect(wrapper.find(SaksstotteIndex)).to.have.length(1);

		contextStub.restore();
	});

	it('skal vise dashboard med fagsak-søk', () => {
		contextStub = sinon.stub(useRestApiData, 'default').callsFake(() => 'url');

		const wrapper = shallow(<SaksbehandlerDashboard valgtOppgavekoId="1" setValgtOppgavekoId={() => undefined} />);

		expect(wrapper.find(FagsakSearchIndex)).to.have.length(1);
		expect(wrapper.find(BehandlingskoerIndex)).to.have.length(1);
		expect(wrapper.find(SaksstotteIndex)).to.have.length(1);

		contextStub.restore();
	});
});
