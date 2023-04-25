/* eslint-disable import/no-mutable-exports */
import { rest } from 'msw';
import { apiPaths } from 'api/k9LosApi';
import avdelningsledareReservasjoner from './avdelningsledareReservasjoner';
import behandlingerSomGårAvVent from './behandlingerSomGårAvVent';
import behandlingerSomGårAvVentÅrsaker from './behandlingerSomGårAvVentÅrsaker';
import behandlingerUnderArbeid from './behandlingerUnderArbeid';
import dagensTall from './dagensTall';
import ferdigstilteHistorikk from './ferdigstilteHistorikk';
import kodeverk from './kodeverk';
import løsteAksjonspunkterPerEnhet from './løsteAksjonspunkterPerEnhet';
import { giRandomDato } from './mockUtils';
import nyeOgFerdigstilteOppgaver from './nyeOgFerdigstilteOppgaver';
import nyeOgFerdigstilteOppgaverMedStonadstype from './nyeOgFerdigstilteOppgaverMedStonadstype';
import saksbehandlerOppgaveko from './saksbehandlerOppgaveko';
import saksbehandlerOppgaver from './saksbehandlerOppgaver';
import saksbehandlerReservasjoner from './saksbehandlerReservasjoner';
import saksbehandlereIOppgaveko from './saksbehandlereIOppgaveko';
import soek from './soek';

// Alle handlers som ligger direkte i dette arrayet vil gjelde
// Requesten treffer handlerne i stedet for eventuelle eksisterende APIer
// f.eks hvis vi har handlere til alle APIene vi bruker her, vil vi aldri treffe den faktiske backenden når vi kjører opp lokalt.
// Derfor burde nok ting kun legges i dette arrayet midlertidig
let handlers = [];

export const developmentHandlers = {
	ferdigstilteHistorikk: rest.get('/api/avdelingsleder/nokkeltall/ferdigstilte-historikk', (req, res, ctx) =>
		res(ctx.json(giRandomDato(ferdigstilteHistorikk, 14))),
	),
	dagensTall: rest.get('/api/avdelingsleder/nokkeltall//dagens-tall', (req, res, ctx) => res(ctx.json(dagensTall))),
	allePaaVent: rest.get('/api/avdelingsleder/nokkeltall/alle-paa-vent_v2', (req, res, ctx) =>
		res(ctx.json({ påVent: behandlingerSomGårAvVent, påVentMedVenteårsak: behandlingerSomGårAvVentÅrsaker })),
	),
	nyeOgFerdigstilteOppgaver: rest.get('/api/saksbehandler/nokkeltall/nye-og-ferdigstilte-oppgaver', (req, res, ctx) =>
		res(ctx.json(giRandomDato(nyeOgFerdigstilteOppgaver, 7))),
	),
	behandlingerUnderArbeid: rest.get('/api/avdelingsleder/nokkeltall/behandlinger-under-arbeid', (req, res, ctx) =>
		res(ctx.json(behandlingerUnderArbeid)),
	),
	beholdningPerDato: rest.get('/api/avdelingsleder/nokkeltall/beholdning-historikk', (req, res, ctx) =>
		res(ctx.json(giRandomDato(ferdigstilteHistorikk, 14))),
	),
	nyePerDato: rest.get('/api/avdelingsleder/nokkeltall/nye-historikk', (req, res, ctx) =>
		res(ctx.json(giRandomDato(ferdigstilteHistorikk, 14))),
	),
	nyeFerdigstilteOppsummering: rest.get(
		'/api/avdelingsleder/nokkeltall/nye-ferdigstilte-oppsummering',
		(req, res, ctx) => res(ctx.json(giRandomDato(nyeOgFerdigstilteOppgaverMedStonadstype, 7))),
	),
	saksbehandler: rest.get('/api/saksbehandler', (req, res, ctx) =>
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
	k9SakUrl: rest.get('/api/konfig/k9-sak-url', (req, res, ctx) => res(ctx.json({ verdi: 'http://localhost:8080' }))),
	k9PunsjUrl: rest.get('/api/konfig/k9-punsj-url', (req, res, ctx) =>
		res(ctx.json({ verdi: 'http://localhost:8080' })),
	),
	omsorgspengerUrl: rest.get('/api/konfig/omsorgspenger-url', (req, res, ctx) =>
		res(ctx.json({ verdi: 'http://localhost:8080' })),
	),
	refreshUrl: rest.get('/api/konfig/refresh-url', (req, res, ctx) =>
		res(
			ctx.json({
				verdi: 'ws://localhost:8020/ws',
			}),
		),
	),
	driftsmeldinger: rest.get('/api/driftsmeldinger', (req, res, ctx) => res(ctx.json([]))),
	behandlede: rest.get('/api/saksbehandler/nokkeltall/behandlede', (req, res, ctx) => res(ctx.json([]))),
	kodeverk: rest.get('/api/kodeverk', (req, res, ctx) => res(ctx.json(kodeverk))),
	aksjonspunkterPerEnhet: rest.get(
		'/api/avdelingsleder/nokkeltall/aksjonspunkter-per-enhet-historikk',
		(req, res, ctx) => res(ctx.json(giRandomDato(løsteAksjonspunkterPerEnhet, 7))),
	),
	avdelinglederReservasjoner: rest.get('/api/avdelingsleder/reservasjoner', (req, res, ctx) =>
		res(ctx.json(avdelningsledareReservasjoner)),
	),
	saksbehandlerReservasjoner: rest.get('/api/saksbehandler/oppgaver/reserverte', (req, res, ctx) =>
		res(ctx.json(saksbehandlerReservasjoner)),
	),
	saksbehandlerOppgaver: rest.get('/api/saksbehandler/oppgaver', (req, res, ctx) =>
		res(ctx.json(saksbehandlerOppgaver)),
	),
	saksbehandlereIOppgaveko: rest.get('/api/saksbehandler/oppgaveko/saksbehandlere', (req, res, ctx) =>
		res(ctx.json(saksbehandlereIOppgaveko)),
	),
	oppgaver: rest.get('/api/saksbehandler/oppgaver/antall', (req, res, ctx) => res(ctx.json(10))),
	oppgavekoer: rest.get('/api/saksbehandler/oppgaveko', (req, res, ctx) => res(ctx.json(saksbehandlerOppgaveko))),
	sok: rest.post('/api/fagsak/sok', (req, res, ctx) => res(ctx.json(soek))),
	saksbehandlere: rest.get(`/api${apiPaths.hentSaksbehandlere}`, (req, res, ctx) =>
		res(
			ctx.json([
				{ navn: 'Ping Pong Paul', brukernavn: 'M088876', epost: 'pingpongpaul@nav.no' },
				{ navn: 'Strenge Stian', brukernavn: 'M111111', epost: 'saksbehandler1@nav.no' },
				{ navn: 'Grusomme Geir', brukernavn: 'M113111', epost: 'saksbehandler111@nav.no' },
				{ navn: 'Super Hans', brukernavn: 'M011111', epost: 'saksbehandler11671@nav.no' },
				{ navn: 'Helmut Hageberg', brukernavn: 'M222222', epost: 'saksbehandler2@nav.no' },
				{ navn: 'Avslå Altesen', brukernavn: 'M333333', epost: 'saksbehandler3@nav.no' },
				{ navn: 'Conrad Coinflip', brukernavn: 'M444444', epost: 'saksbehandler4@nav.no' },
				{ navn: 'Freddy Fradrag', brukernavn: 'M212121', epost: 'saksbehandler41@nav.no' },
				{
					navn: 'Jeg Har Mange Navn Og Bruker Helst Alle',
					brukernavn: 'M555555',
					epost: 'saksbehandler5@nav.no',
				},
				{ navn: 'Hacker Jørgen', brukernavn: 'M666666', epost: 'saksbehandler6@nav.no' },
				{ navn: 'Jorge Hermansen', brukernavn: 'M777777', epost: 'saksbehandler7@nav.no' },
				{ navn: 'Rettferdige Reidun', brukernavn: 'M888888', epost: 'saksbehandler8@nav.no' },
				{ navn: 'Ronny Filtersen', brukernavn: 'M999999', epost: 'saksbehandler9@nav.no' },
				{ navn: 'Bungalo Bernt', brukernavn: 'M010101', epost: 'saksbehandler10@nav.no' },
				{ navn: 'Tommy Tilbakekreving', brukernavn: 'M323212', epost: 'saksbehandler1103@nav.no' },
				{ navn: 'Benny Balltre', brukernavn: 'M323212', epost: 'saksbehandler11909@nav.no' },
				{ navn: 'Ken Kneskål', brukernavn: 'M010111', epost: 'saksbehandler11@nav.no' },
			]),
		),
	),
	oppgavemodellV2OpprettKø: rest.post(`/api${apiPaths.opprettOppgaveko}`, async (req, res, ctx) => {
		const data = await req.json();
		return res(
			ctx.json({
				id: '1',
				tittel: data.tittel,
			}),
		);
	}),
	oppgavemodellV2OppdaterKø: rest.post(`/api${apiPaths.oppdaterOppgaveko}`, async (req, res, ctx) => {
		const data = await req.json();
		return res(
			ctx.json({
				id: '1',
				tittel: 'Beskrivende tittel',
				beskrivelse: 'godt forklart tekst om hva formålet med køen er',
				oppgavequery: [],
				saksbehandlere: [],
				sistEndret: 'dato',
				...data,
				versjon: data.versjon ? data.versjon + 1 : 1,
			}),
		);
	}),
	oppgavemodellV2HentKø: rest.get(`/api${apiPaths.hentOppgaveko}/*`, async (req, res, ctx) =>
		res(
			ctx.json({
				id: '1',
				tittel: 'Beskrivende tittel',
				beskrivelse: 'godt forklart tekst om hva formålet med køen er',
				oppgaveQuery: [],
				saksbehandlere: [],
				antallOppgaver: 5,
				sistEndret: 'dato',

				versjon: 1,
			}),
		),
	),
	oppgavemodellV2HentAlleKø: rest.get(`/api${apiPaths.hentOppgavekoer}`, async (req, res, ctx) =>
		res(
			ctx.json([
				{
					id: '1',
					tittel: 'Beskrivende tittel',
					beskrivelse: 'godt forklart tekst om hva formålet med køen er',
					oppgaveQuery: {
						filtere: [],
						select: [],
						order: [],
						limit: 10,
						id: 'da62a94f-2370-4cee-84b3-c6c5d5371c74',
					},
					saksbehandlere: ['saksbehandler1103@nav.no', 'saksbehandler11909@nav.no', 'saksbehandler11@nav.no'],
					antallOppgaver: 5,
					sistEndret: 'dato',
					versjon: 1,
				},
				{
					id: '2',
					tittel: 'Kø 2',
					beskrivelse:
						'godt forklart tekst om hva formålet med køen er. og den skal være lang lang lang lang lang lang lang lang ' +
						'lang lang lang lang lang lang lang lang lang lang lang lang lang lang lang lang lang lang lang lang lang lang' +
						'lang lang lang lang lang lang lang |lang lang lang lang lang lang lang lang lang lang lang lang lang lang lang lang lang lang lang ' +
						'slang lang lang lang lang lang lang lang lang lang lang lang lang lang lang lang lang lang lang lang lang lang lang lang',
					oppgaveQuery: {
						filtere: [],
						select: [],
						order: [],
						limit: 10,
						id: 'da62a94f-2370-4cee-84b3-c6c5d5371c74',
					},
					saksbehandlere: [],
					antallOppgaver: 1002,
					sistEndret: 'dato',

					versjon: 1,
				},
				{
					id: '3',
					tittel: 'Kø 3',
					beskrivelse: 'godt forklart tekst om hva formålet med køen er',
					oppgaveQuery: {
						filtere: [],
						select: [],
						order: [],
						limit: 10,
						id: 'da62a94f-2370-4cee-84b3-c6c5d5371c74',
					},
					saksbehandlere: [],
					antallOppgaver: 0,
					sistEndret: 'dato',
					versjon: 1,
				},
			]),
		),
	),
};

if (process.env.MSW_MODE === 'dev') {
	handlers = handlers.concat(Object.values(developmentHandlers));
}

export default handlers;
