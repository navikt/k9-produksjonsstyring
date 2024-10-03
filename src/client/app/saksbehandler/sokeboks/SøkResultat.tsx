import React from 'react';
import { OppgaveTabell } from 'saksbehandler/sokeboks/OppgaveTabell';
import { PersonInfo } from 'saksbehandler/sokeboks/PersonInfo';
import { SøkeboksOppgaveDto } from 'saksbehandler/sokeboks/SøkeboksOppgaveDto';

export function SøkResultat(props: { oppgaver: SøkeboksOppgaveDto[] | undefined }) {
	if (props.oppgaver === undefined) {
		return null;
	}
	if (props.oppgaver.length === 0) {
		return 'Søket ga ingen treff';
	}

	return (
		<div>
			<PersonInfo oppgaver={props.oppgaver} />
			<OppgaveTabell oppgaver={props.oppgaver} />
		</div>
	);
}
