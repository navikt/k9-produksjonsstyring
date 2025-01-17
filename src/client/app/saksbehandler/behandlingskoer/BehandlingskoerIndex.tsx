import React, { FunctionComponent, useCallback, useMemo, useState } from 'react';
import { Loader } from '@navikt/ds-react';
import { saksbehandlerKanVelgeNyeKoer } from 'app/envVariablesUtils';
import { getK9punsjRef, getK9sakHref } from 'app/paths';
import { K9LosApiKeys } from 'api/k9LosApi';
import { useAlleSaksbehandlerKoerV3 } from 'api/queries/saksbehandlerQueries';
import useRestApiRunner from 'api/rest-api-hooks/src/local-data/useRestApiRunner';
import BehandlingskoerContext from 'saksbehandler/BehandlingskoerContext';
import Oppgave from 'saksbehandler/oppgaveTsType';
import { OppgavekøV3, OppgavekøV3MedNavn } from 'types/OppgavekøV3Type';
import OppgaveSystem from '../../types/OppgaveSystem';
import OppgavekoPanel from './components/OppgavekoPanel';

interface OwnProps {
	k9sakUrl: string;
	k9punsjUrl: string;
}

/**
 * BehandlingskoerIndex
 */
const BehandlingskoerIndex: FunctionComponent<OwnProps> = ({ k9sakUrl, k9punsjUrl }) => {
	const [valgtOppgavekoId, setValgtOppgavekoId] = useState('');
	const { data: oppgavekoerV3, isLoading } = useAlleSaksbehandlerKoerV3({
		enabled: saksbehandlerKanVelgeNyeKoer(),
	});

	const mapKøV3 = (kø: OppgavekøV3): OppgavekøV3MedNavn => ({ ...kø, navn: kø.tittel, id: `${kø.id}__V3` });
	const oppgavekoer = oppgavekoerV3.map(mapKøV3);

	const { startRequest: leggTilBehandletOppgave } = useRestApiRunner(K9LosApiKeys.LEGG_TIL_BEHANDLET_OPPGAVE);

	const openFagsak = (oppgave: Oppgave) => {
		leggTilBehandletOppgave(oppgave.oppgaveNøkkel).then(() => {
			switch (oppgave.system) {
				case OppgaveSystem.PUNSJ:
					window.location.assign(getK9punsjRef(k9punsjUrl, oppgave.journalpostId));
					break;
				case OppgaveSystem.K9SAK:
					window.location.assign(getK9sakHref(k9sakUrl, oppgave.saksnummer, oppgave.behandlingId));
					break;
				case OppgaveSystem.K9TILBAKE:
					window.location.assign(getK9sakHref(k9sakUrl, oppgave.saksnummer, oppgave.behandlingId));
					break;
				default:
					window.location.assign(getK9sakHref(k9sakUrl, oppgave.saksnummer, oppgave.behandlingId));
			}
		});
	};

	const openSak = (oppgave: Oppgave) => {
		if (
			oppgave.system === OppgaveSystem.K9SAK ||
			oppgave.system === OppgaveSystem.K9TILBAKE ||
			oppgave.system === OppgaveSystem.PUNSJ
		) {
			openFagsak(oppgave);
		} else throw new Error('Fagsystemet for oppgaven er ukjent');
	};

	const apneOppgave = useCallback(
		(oppgave: Oppgave) => {
			openSak(oppgave);
		},
		[k9sakUrl],
	);

	const behandlingskoerContextValue = useMemo(
		() => ({
			oppgavekoer,
			setValgtOppgavekoId,
			valgtOppgavekoId,
		}),
		[oppgavekoer, valgtOppgavekoId, setValgtOppgavekoId],
	);

	if (isLoading) {
		return <Loader />;
	}

	return (
		<BehandlingskoerContext.Provider value={behandlingskoerContextValue}>
			<OppgavekoPanel apneOppgave={apneOppgave} />
		</BehandlingskoerContext.Provider>
	);
};

export default BehandlingskoerIndex;
