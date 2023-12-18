import React, { FunctionComponent, useCallback, useEffect } from 'react';
import { WrappedComponentProps, injectIntl } from 'react-intl';
import { useQuery } from 'react-query';
import { saksbehandlerKanVelgeNyeKoer } from 'app/envVariablesUtils';
import { OppgavekøV2, OppgavekøV2MedNavn, OppgavekøerV2 as OppgavekøerV2Type } from 'types/OppgavekøV2Type';
import { getK9punsjRef, getK9sakHref } from 'app/paths';
import apiPaths from 'api/apiPaths';
import { K9LosApiKeys } from 'api/k9LosApi';
import { useRestApi } from 'api/rest-api-hooks';
import RestApiState from 'api/rest-api-hooks/src/RestApiState';
import useRestApiRunner from 'api/rest-api-hooks/src/local-data/useRestApiRunner';
import { OppgavekøV1 } from 'saksbehandler/behandlingskoer/oppgavekoTsType';
import Oppgave from 'saksbehandler/oppgaveTsType';
import { get } from 'utils/axios';
import OppgaveSystem from '../../types/OppgaveSystem';
import OppgaveSocket from './OppgaveSocket';
import OppgavekoPanel from './components/OppgavekoPanel';

interface OwnProps {
	k9sakUrl: string;
	k9punsjUrl: string;
	valgtOppgavekoId?: string;
	setValgtOppgavekoId: (id: string) => void;
}

/**
 * BehandlingskoerIndex
 */
const BehandlingskoerIndex: FunctionComponent<OwnProps & WrappedComponentProps> = ({
	k9sakUrl,
	k9punsjUrl,
	setValgtOppgavekoId,
	valgtOppgavekoId,
}) => {
	const { data: oppgavekoerV1 = [] } = useRestApi<OppgavekøV1[]>(K9LosApiKeys.OPPGAVEKO);
	const { data: oppgavekoerV2 } = useQuery<OppgavekøerV2Type>({
		queryKey: [apiPaths.hentOppgavekoer, 'saksbehandler'],
		queryFn: () => get(apiPaths.hentOppgavekoer),
		enabled: saksbehandlerKanVelgeNyeKoer(),
	});

	const mapKøV2 = (kø: OppgavekøV2): OppgavekøV2MedNavn => ({ ...kø, navn: kø.tittel });
	const oppgavekoer = [...oppgavekoerV1, ...(oppgavekoerV2?.koer || []).map(mapKøV2)];
	const {
		startRequest: hentOppgaverTilBehandling,
		state,
		data: oppgaverTilBehandling = [],
	} = useRestApiRunner<Oppgave[]>(K9LosApiKeys.OPPGAVER_TIL_BEHANDLING);
	const { startRequest: getReserverteOppgaver, data: reserverteOppgaver = [] } = useRestApiRunner<Oppgave[]>(
		K9LosApiKeys.RESERVERTE_OPPGAVER,
	);

	const hentReserverteOppgaver = () => getReserverteOppgaver(undefined, true);
	const { startRequest: leggTilBehandletOppgave } = useRestApiRunner(K9LosApiKeys.LEGG_TIL_BEHANDLET_OPPGAVE);

	useEffect(() => {
		hentReserverteOppgaver();
	}, []);

	useEffect(() => {
		if (valgtOppgavekoId) {
			hentOppgaverTilBehandling({ id: valgtOppgavekoId });
		}
	}, [valgtOppgavekoId]);

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

	if (oppgavekoer.length === 0) {
		return null;
	}

	return (
		<>
			<OppgaveSocket
				hentReserverteOppgaver={hentReserverteOppgaver}
				hentOppgaverTilBehandling={hentOppgaverTilBehandling}
				valgtOppgavekoId={valgtOppgavekoId}
			/>
			<OppgavekoPanel
				valgtOppgavekoId={valgtOppgavekoId}
				setValgtOppgavekoId={setValgtOppgavekoId}
				apneOppgave={apneOppgave}
				oppgavekoer={oppgavekoer}
				requestFinished={state === RestApiState.SUCCESS}
				oppgaverTilBehandling={oppgaverTilBehandling}
				reserverteOppgaver={reserverteOppgaver}
				hentReserverteOppgaver={hentReserverteOppgaver}
			/>
		</>
	);
};

export default injectIntl(BehandlingskoerIndex);
