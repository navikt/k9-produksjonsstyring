import React from 'react';
import { IntlShape } from 'react-intl';
import { expect } from 'chai';
import moment from 'moment';
import behandlingType from 'kodeverk/behandlingType';
import ReactECharts from 'sharedComponents/echart/ReactEcharts';
import { intlMock, shallowWithIntl } from '../../../../../../../../setup/testHelpers/intl-enzyme-test-helper';
import NyeOgFerdigstilteOppgaverForSisteSyvGraf from './NyeOgFerdigstilteOppgaverForSisteSyvGraf';

describe('<NyeOgFerdigstilteOppgaverForSisteSyvGraf>', () => {
	const intl: IntlShape = {
		...intlMock,
	};

	const nyeOgFerdigstilteOppgaver = [
		{
			behandlingType: {
				kode: behandlingType.FORSTEGANGSSOKNAD,
				navn: 'Navn',
			},
			fagsakYtelseType: {
				kode: 'PSB',
				navn: 'Pleiepenger',
			},
			antallNye: 1,
			antallFerdigstilte: 6,
			antallFerdigstilteMine: 1,
			dato: moment().subtract(3, 'days').format(),
		},
	];

	it('skal vise ReactEchartGraf', () => {
		const wrapper = shallowWithIntl(
			<NyeOgFerdigstilteOppgaverForSisteSyvGraf.WrappedComponent
				intl={intl}
				height={200}
				nyeOgFerdigstilteOppgaver={nyeOgFerdigstilteOppgaver}
			/>,
		);

		const graf = wrapper.find(ReactECharts);
		expect(graf).to.have.length(1);
	});
});
