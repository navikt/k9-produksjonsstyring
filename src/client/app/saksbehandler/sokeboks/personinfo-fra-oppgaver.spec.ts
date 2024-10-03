import { SøkeboksOppgaveDto } from 'saksbehandler/sokeboks/SøkeboksOppgaveDto';
import { personinfoFraOppgaver } from 'saksbehandler/sokeboks/personinfo-fra-oppgaver';

const oppgave: SøkeboksOppgaveDto = {
	navn: '',
	fnr: '',
	kjønn: '',
	dødsdato: '',
	ytelsestype: { kode: '', navn: '', kodeverk: '' },
	behandlingstype: { kode: '', navn: '', kodeverk: '' },
	saksnummer: '',
	oppgaveNøkkel: { oppgaveEksternId: '', oppgaveTypeEksternId: '', områdeEksternId: '' },
	hastesak: false,
	journalpostId: '',
	opprettetTidspunkt: '',
	oppgavestatus: { kode: 'AAPEN', navn: '' },
	oppgavebehandlingsUrl: '',
	reservasjonsnøkkel: '',
	reservertAvSaksbehandlerNavn: '',
	reservertAvSaksbehandlerIdent: '',
	reservertTom: '',
};

describe('personinfoFraOppgaver', () => {
	test('Tom liste', () => {
		expect(personinfoFraOppgaver([])).toEqual({ unik: false });
	});

	test('En i liste', () => {
		expect(personinfoFraOppgaver([{ ...oppgave, navn: 'A', fnr: '1', kjønn: '-', dødsdato: '2020-01-01' }])).toEqual({
			unik: true,
			navn: 'A',
			fnr: '1',
			kjønn: '-',
			dødsdato: '2020-01-01',
		});
	});

	test('Flere like i liste', () => {
		expect(
			personinfoFraOppgaver([
				{ ...oppgave, navn: 'A', fnr: '1', kjønn: '-', dødsdato: '2021-01-01' },
				{ ...oppgave, navn: 'A', fnr: '1', kjønn: '-', dødsdato: '2021-01-01' },
			]),
		).toEqual({
			unik: true,
			navn: 'A',
			fnr: '1',
			kjønn: '-',
			dødsdato: '2021-01-01',
		});
	});

	test('Flere ulike i liste', () => {
		expect(
			personinfoFraOppgaver([
				{ ...oppgave, navn: 'A', fnr: '1', kjønn: '-' },
				{ ...oppgave, navn: 'B', fnr: '2', kjønn: '-' },
			]),
		).toEqual({
			unik: false,
		});
	});
});
