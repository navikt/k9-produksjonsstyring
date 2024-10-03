import _ from 'lodash';
import { SøkeboksOppgaveDto } from 'saksbehandler/sokeboks/SøkeboksOppgaveDto';

type PersoninfoFraOppgaverReturverdi =
	| { unik: false }
	| { unik: true; fnr: string; navn: string; kjønn: string; dødsdato?: string };

export function personinfoFraOppgaver(oppgaver: SøkeboksOppgaveDto[]): PersoninfoFraOppgaverReturverdi {
	const personer = _.chain(oppgaver)
		.map(({ fnr, navn, kjønn, dødsdato }) => ({
			navn,
			fnr,
			kjønn,
			dødsdato,
		}))
		.uniqBy('fnr')
		.value();

	if (personer.length !== 1) {
		return { unik: false };
	}

	return {
		unik: true,
		...personer[0],
	};
}
