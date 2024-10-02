import { OppgaveNøkkel } from './OppgaveNøkkel';

export default interface EndreOppgaveType {
	oppgaveNøkkel: OppgaveNøkkel;
	begrunnelse?: string;
	reserverTil?: string;
	brukerIdent?: string;
}
