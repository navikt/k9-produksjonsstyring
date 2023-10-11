import React, { FunctionComponent, useCallback, useEffect, useMemo, useState } from 'react';
import { WrappedComponentProps, injectIntl } from 'react-intl';
import { OppgavekøV2, OppgavekøV2MedNavn } from 'types/OppgavekøV2Type';
import { getK9punsjRef, getK9sakHref } from 'app/paths';
import { K9LosApiKeys } from 'api/k9LosApi';
import { useAlleSaksbehandlerKoer } from 'api/queries/saksbehandlerQueries';
import { useRestApi } from 'api/rest-api-hooks';
import RestApiState from 'api/rest-api-hooks/src/RestApiState';
import useRestApiRunner from 'api/rest-api-hooks/src/local-data/useRestApiRunner';
import BehandlingskoerContext from 'saksbehandler/BehandlingskoerContext';
import { OppgavekøV1 } from 'saksbehandler/behandlingskoer/oppgavekoTsType';
import Oppgave from 'saksbehandler/oppgaveTsType';
import { saksbehandlerKanVelgeNyeKoer } from '../../featureToggles';
import OppgaveSystem from '../../types/OppgaveSystem';
import OppgavekoPanel from './components/OppgavekoPanel';

interface OwnProps {
	k9sakUrl: string;
	k9punsjUrl: string;
}

/**
 * BehandlingskoerIndex
 */
const BehandlingskoerIndex: FunctionComponent<OwnProps & WrappedComponentProps> = ({ k9sakUrl, k9punsjUrl }) => {
	const [valgtOppgaveKo, setValgtOppgaveKo] = useState<OppgavekøV1 | OppgavekøV2MedNavn>();
	const { data: oppgavekoerV1 = [] } = useRestApi<OppgavekøV1[]>(K9LosApiKeys.OPPGAVEKO);
	const { data: oppgavekoerV2 } = useAlleSaksbehandlerKoer({
		enabled: saksbehandlerKanVelgeNyeKoer(),
	});
	const mapKøV2 = (kø: OppgavekøV2): OppgavekøV2MedNavn => ({ ...kø, navn: kø.tittel });
	const oppgavekoer = [...oppgavekoerV1, ...(oppgavekoerV2 || []).map(mapKøV2)];

	const { startRequest: leggTilBehandletOppgave } = useRestApiRunner(K9LosApiKeys.LEGG_TIL_BEHANDLET_OPPGAVE);

	const openFagsak = (oppgave: Oppgave) => {
		leggTilBehandletOppgave(oppgave);
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
	};

	const openSak = (oppgave: Oppgave) => {
		if (
			oppgave.system === OppgaveSystem.K9SAK ||
			oppgave.system === OppgaveSystem.K9TILBAKE ||
			oppgave.system === OppgaveSystem.PUNSJ ||
			oppgave.system === OppgaveSystem.OMSORGSPENGER
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
	console.log(oppgavekoer);

	const behandlingskoerContextValue = useMemo(
		() => ({
			oppgavekoer,
		}),
		[oppgavekoer],
	);

	if (oppgavekoer.length === 0) {
		return null;
	}

	return (
		<BehandlingskoerContext.Provider value={behandlingskoerContextValue}>
			<OppgavekoPanel apneOppgave={apneOppgave} />
		</BehandlingskoerContext.Provider>
	);
};

export default injectIntl(BehandlingskoerIndex);
