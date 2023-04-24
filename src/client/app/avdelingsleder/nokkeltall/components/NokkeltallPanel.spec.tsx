import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import BeholdningHistorikkPanel from 'avdelingsleder/nokkeltall/components/beholdningHistorikk/BeholdningHistorikkPanel';
import FerdigstiltePanel from 'avdelingsleder/nokkeltall/components/dagensTallPanel/InngangOgFerdigstiltePanel';
import FerdigstilteHistorikkPanel from 'avdelingsleder/nokkeltall/components/ferdigstilteHistorikk/FerdigstilteHistorikkPanel';
import NyeHistorikkPanel from 'avdelingsleder/nokkeltall/components/nyeHistorikk/NyeHistorikkPanel';
import NokkeltallPanel from './NokkeltallPanel';
import FordelingAvBehandlingstypePanel from './fordelingAvBehandlingstype/FordelingAvBehandlingstypePanel';

describe('<NokkeltallPanel>', () => {
	it('skal vise grafpaneler', () => {
		const wrapper = shallow(<NokkeltallPanel alleOppgaver={[]} ferdigstiltePerDato={[]} />);

		expect(wrapper.find(FerdigstiltePanel)).to.have.length(1);
		expect(wrapper.find(NyeHistorikkPanel)).to.have.length(1);
		expect(wrapper.find(FerdigstilteHistorikkPanel)).to.have.length(1);
		expect(wrapper.find(BeholdningHistorikkPanel)).to.have.length(1);
		expect(wrapper.find(FordelingAvBehandlingstypePanel)).to.have.length(1);
	});
});
