// Import necessary utilities and components
import React from 'react';
import { fireEvent, waitFor, screen } from '@testing-library/react';
import FagsakSearchIndex from './FagsakSearchIndex';
import apiPaths from 'api/apiPaths';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { unitTestHandlers } from 'mocks/unitTestHandlers';
import { renderWithAllProviders } from '../../../../../setup/testHelpers/testUtils';
import userEvent from '@testing-library/user-event';

const server = setupServer(...createHandlers());
// Optionally, you can add specific handlers for tests
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('FagsakSearchIndex', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	// Scenario 1: oppgave is reserved by another user
	it('handles oppgave reserved by another user', async () => {
		const { getByText, getByRole, debug } = renderWithAllProviders(
			<FagsakSearchIndex k9punsjUrl="test" k9sakUrl="test" />,
		);
		await userEvent.type(getByText('Saksnummer, fødselsnummer/D-nummer eller journalpostID'), '5YC1S');
		// check if the search button is visible, enabled and then click it
		const searchButton = getByRole('button', { name: 'Søk' });
		debug();
		expect(searchButton).toBeEnabled();
		userEvent.click(searchButton);
		await waitFor(() => getByText('5YC1S (2024)'));
	});
});

function createHandlers() {
	return [
		...unitTestHandlers,
		rest.post(apiPaths.sok, (req, res, ctx) => {
			return res(
				ctx.json({
					ikkeTilgang: false,
					person: null,
					oppgaver: [
						{
							status: {
								erReservert: true,
								reservertTilTidspunkt: '2024-07-11T23:59:00',
								erReservertAvInnloggetBruker: false,
								reservertAv: 'Z123456',
								reservertAvNavn: 'Saksbehandler Sara',
								flyttetReservasjon: null,
								kanOverstyres: false,
								beskjed: null,
							},
							behandlingId: null,
							journalpostId: null,
							saksnummer: '5YC1S',
							navn: 'ForkortetNavn',
							system: 'K9SAK',
							personnummer: '012345678901',
							behandlingstype: {
								kode: 'BT-002',
								navn: 'Førstegangsbehandling',
								kodeverk: 'ae0034',
							},
							fagsakYtelseType: {
								kode: 'PSB',
								navn: 'Pleiepenger sykt barn',
								kodeverk: 'FAGSAK_YTELSE_TYPE',
							},
							behandlingStatus: {
								kode: 'UTRED',
								navn: 'Utredes',
								kodeverk: 'BEHANDLING_TYPE',
							},
							erTilSaksbehandling: true,
							opprettetTidspunkt: '2024-07-09T09:35:58',
							behandlingsfrist: '2024-08-20T00:00:00',
							eksternId: 'eeae15c0-0011-4ace-a8af-7ddc523c38a5',
							tilBeslutter: false,
							utbetalingTilBruker: false,
							avklarArbeidsforhold: false,
							selvstendigFrilans: false,
							søktGradering: false,
							fagsakPeriode: {
								fom: '2024-06-11',
								tom: '2024-08-11',
							},
							paaVent: null,
							merknad: null,
							oppgaveNøkkel: {
								oppgaveEksternId: 'eeae15c0-0011-4ace-a8af-7ddc523c38a5',
								oppgaveTypeEksternId: 'V1Oppgave',
								områdeEksternId: 'V1Oppgave',
							},
							endretAvNavn: null,
						},
					],
				}),
			);
		}),
	];
}
