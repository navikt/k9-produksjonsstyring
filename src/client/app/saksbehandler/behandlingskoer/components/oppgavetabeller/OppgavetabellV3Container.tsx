import React, { useContext } from 'react';
import { ErrorMessage, Loader } from '@navikt/ds-react';
import { useSaksbehandlerNesteTiV3 } from 'api/queries/saksbehandlerQueries';
import BehandlingskoerContext from 'saksbehandler/BehandlingskoerContext';
import { erKoV3, getKoId } from 'saksbehandler/behandlingskoer/utils';
import OppgaverTabellV3 from './OppgaverTabellV3';

export const OppgavetabellV3Container = () => {
	const { valgtOppgavekoId } = useContext(BehandlingskoerContext);

	const { data, isLoading, error } = useSaksbehandlerNesteTiV3(getKoId(valgtOppgavekoId), {
		enabled: !!valgtOppgavekoId && erKoV3(valgtOppgavekoId),
	});

	if (isLoading) {
		return <Loader />;
	}

	if (error) {
		return <ErrorMessage>Feil ved henting av oppgaver</ErrorMessage>;
	}

	return <OppgaverTabellV3 oppgaver={data} />;
};
