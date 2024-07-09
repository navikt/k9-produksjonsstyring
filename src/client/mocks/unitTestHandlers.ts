// src/mocks/server.js
import apiPaths from 'api/apiPaths';
import { rest } from 'msw';

export const unitTestHandlers = [
	rest.get(apiPaths.saksbehandler, (req, res, ctx) =>
		res(
			ctx.json({
				brukernavn: 'saksbehandler@nav.no',
				navn: 'Saksbehandler Sara',
				brukerIdent: 'Z123456',
				kanSaksbehandle: true,
				kanVeilede: true,
				kanBeslutte: true,
				kanBehandleKodeEgenAnsatt: true,
				kanBehandleKode6: true,
				kanBehandleKode7: true,
				kanOppgavestyre: true,
				kanReservere: true,
				kanDrifte: true,
			}),
		),
	),
	rest.get('http://localhost:8031/api/driftsmeldinger', (req, res, ctx) =>
		res(
			ctx.json([
				{
					id: '1',
					melding: 'CrashMessage',
					dato: '06-09-2021',
					aktiv: true,
					aktivert: '',
				},
			]),
		),
	),
];
