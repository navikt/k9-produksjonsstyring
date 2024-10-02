import React from 'react';
import { FigureInwardIcon, FigureOutwardIcon } from '@navikt/aksel-icons';
import { Detail, Heading } from '@navikt/ds-react';
import { SøkeboksOppgaveDto } from 'saksbehandler/sokeboks/SøkeboksOppgaveDto';
import { personinfoFraOppgaver } from 'saksbehandler/sokeboks/personinfo-fra-oppgaver';
import { dateFormat } from 'utils/dateUtils';

export function PersonInfo(props: { oppgaver: SøkeboksOppgaveDto[] }) {
	const personinfo = personinfoFraOppgaver(props.oppgaver);

	if (!personinfo.unik) {
		// Hvis søkeresultatet er fra ingen eller mer enn én person, ikke vis denne komponenten
		return null;
	}

	const iconCss = 'mr-3 mt-2';
	return (
		<div className="flex">
			{personinfo.kjønn === 'KVINNE' && <FigureOutwardIcon fontSize={30} className={iconCss} />}
			{personinfo.kjønn === 'MANN' && <FigureInwardIcon fontSize={30} className={iconCss} />}

			<div>
				<Heading size="small">{personinfo.navn}</Heading>
				<Detail>{personinfo.fnr}</Detail>
				{personinfo.dødsdato && <Detail>Dødsdato: {dateFormat(personinfo.dødsdato)}</Detail>}
			</div>
		</div>
	);
}
