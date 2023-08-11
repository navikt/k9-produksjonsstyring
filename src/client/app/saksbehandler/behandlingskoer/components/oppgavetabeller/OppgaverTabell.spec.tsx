import React from 'react';
import { FormattedMessage, IntlShape } from 'react-intl';
import { expect } from 'chai';
import sinon from 'sinon';
import { K9LosApiKeys, RestApiGlobalStatePathsKeys } from 'api/k9LosApi';
import behandlingStatus from 'kodeverk/behandlingStatus';
import behandlingType from 'kodeverk/behandlingType';
import fagsakYtelseType from 'kodeverk/fagsakYtelseType';
import { OppgavekøV1 } from 'saksbehandler/behandlingskoer/oppgavekoTsType';
import DateLabel from 'sharedComponents/DateLabel';
import TableColumn from 'sharedComponents/TableColumn';
import TableRow from 'sharedComponents/TableRow';
import RestApiTestMocker from '../../../../../../../setup/testHelpers/RestApiTestMocker';
import { intlMock, shallowWithIntl } from '../../../../../../../setup/testHelpers/intl-enzyme-test-helper';
import kodeverk from '../../../../../mocks/kodeverk';
import { OppgaverTabell } from './OppgaverTabell';

describe('<OppgaverTabell>', () => {
	const intl: Partial<IntlShape> = {
		...intlMock,
	};
	const valgtKo: OppgavekøV1 = {
		id: '2',
		navn: 'K9',
		behandlingTyper: [],
		fagsakYtelseTyper: [],
		andreKriterier: [],
		skjermet: false,
	};

	const oppgaverTilBehandling = [
		{
			eksternId: '1',
			status: {
				erReservert: false,
			},
			saksnummer: '1',
			behandlingId: 2,
			journalpostId: null,
			personnummer: '123456789',
			navn: 'Espen Utvikler',
			system: 'K9SAK',
			behandlingstype: behandlingType.FORSTEGANGSSOKNAD,
			opprettetTidspunkt: '2019-01-02',
			behandlingsfrist: '2019-03-03',
			erTilSaksbehandling: true,
			fagsakYtelseType: fagsakYtelseType.OMSORGSPENGER,
			behandlingStatus: behandlingStatus.OPPRETTET,
		},
		{
			eksternId: '2',
			status: {
				erReservert: false,
			},
			saksnummer: '2',
			behandlingId: 2,
			journalpostId: null,
			personnummer: '657643535',
			navn: 'Espen Solstråle',
			system: 'FPSAK',
			behandlingstype: behandlingType.FORSTEGANGSSOKNAD,
			opprettetTidspunkt: '2018-01-02',
			behandlingsfrist: '2018-03-03',
			erTilSaksbehandling: true,
			fagsakYtelseType: fagsakYtelseType.OMSORGSPENGER,
			behandlingStatus: behandlingStatus.OPPRETTET,
		},
	];

	it('skal vise kriterievelger og liste over neste oppgaver', () => {
		new RestApiTestMocker()
			.withRestCallRunner(K9LosApiKeys.LEGG_TIL_BEHANDLET_OPPGAVE, {
				startRequest: () => undefined,
				data: undefined,
			})
			.withRestCallRunner(K9LosApiKeys.OPPGAVEKO, { startRequest: () => undefined, data: undefined })
			.withGlobalData(RestApiGlobalStatePathsKeys.KODEVERK, kodeverk)
			.runTest(() => {
				const wrapper = shallowWithIntl(
					<OppgaverTabell
						intl={intl}
						valgtKo={valgtKo}
						reserverOppgave={sinon.spy()}
						valgtOppgavekoId="1"
						oppgaverTilBehandling={oppgaverTilBehandling}
						requestFinished
					/>,
				);

				const tableRows = wrapper.find(TableRow);
				expect(tableRows).has.length(2);

				const columnsRow1 = tableRows.first().find(TableColumn);
				expect(columnsRow1.first().childAt(0).text()).is.eql('Espen Utvikler 123456789');
				expect(columnsRow1.at(1).childAt(0).text()).is.eql('1');
				expect(columnsRow1.at(2).childAt(0).text()).is.eql('Førstegangsbehandling');
				expect(columnsRow1.at(3).find(DateLabel).prop('dateString')).is.eql('2019-01-02');

				const columnsRow2 = tableRows.last().find(TableColumn);
				expect(columnsRow2.first().childAt(0).text()).is.eql('Espen Solstråle 657643535');
				expect(columnsRow2.at(1).childAt(0).text()).is.eql('2');
				expect(columnsRow2.at(2).childAt(0).text()).is.eql('Førstegangsbehandling');
				expect(columnsRow2.at(3).find(DateLabel).prop('dateString')).is.eql('2018-01-02');
			});
	});

	it('skal ikke vise liste når en ikke har oppgaver', () => {
		new RestApiTestMocker()
			.withRestCallRunner(K9LosApiKeys.LEGG_TIL_BEHANDLET_OPPGAVE, {
				startRequest: () => undefined,
				data: undefined,
			})
			.withRestCallRunner(K9LosApiKeys.OPPGAVEKO, { startRequest: () => undefined, data: undefined })
			.withGlobalData(RestApiGlobalStatePathsKeys.KODEVERK, kodeverk)
			.runTest(() => {
				const wrapper = shallowWithIntl(
					<OppgaverTabell
						intl={intl}
						valgtKo={valgtKo}
						reserverOppgave={sinon.spy()}
						valgtOppgavekoId="1"
						oppgaverTilBehandling={[]}
						requestFinished
					/>,
				);

				const message = wrapper.find(FormattedMessage);
				expect(message).has.length(1);
				expect(message.last().prop('id')).is.eql('OppgaverTabell.IngenOppgaver');

				expect(wrapper.find(TableRow)).has.length(0);
			});
	});
});
