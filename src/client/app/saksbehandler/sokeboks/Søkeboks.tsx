import React from 'react';
import { useSøkOppgaveV3 } from 'api/queries/saksbehandlerQueries';
import { SøkForm } from 'saksbehandler/sokeboks/SøkForm';
import { SøkResultat } from 'saksbehandler/sokeboks/SøkResultat';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';

export function Søkeboks() {
	const { isLoading, mutate: utførSøk, data, reset: nullstillSøk } = useSøkOppgaveV3();

	return (
		<>
			<SøkForm utførSøk={utførSøk} loading={isLoading} nullstillSøk={nullstillSøk} />
			<VerticalSpacer sixteenPx />
			<SøkResultat oppgaver={data} />
		</>
	);
}
