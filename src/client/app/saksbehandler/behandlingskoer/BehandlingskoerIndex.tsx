import React, { FunctionComponent, useCallback, useEffect, useRef, useState } from 'react';
import { WrappedComponentProps, injectIntl } from 'react-intl';
import { useQuery } from 'react-query';
import { OppgavekøV2, OppgavekøV2MedNavn, OppgavekøerV2 as OppgavekøerV2Type } from 'types/OppgavekøV2Type';
import { getK9punsjRef, getK9sakHref, getOmsorgspengerRef } from 'app/paths';
import apiPaths from 'api/apiPaths';
import { K9LosApiKeys, RestApiGlobalStatePathsKeys } from 'api/k9LosApi';
import { useRestApi } from 'api/rest-api-hooks';
import RestApiState from 'api/rest-api-hooks/src/RestApiState';
import useGlobalStateRestApiData from 'api/rest-api-hooks/src/global-data/useGlobalStateRestApiData';
import useRestApiRunner from 'api/rest-api-hooks/src/local-data/useRestApiRunner';
import { OppgavekøV1 } from 'saksbehandler/behandlingskoer/oppgavekoTsType';
import Oppgave from 'saksbehandler/oppgaveTsType';
import { get } from 'utils/axios';
import { saksbehandlerKanVelgeNyeKoer } from '../../featureToggles';
import OppgaveSystem from '../../types/OppgaveSystem';
import OppgavekoPanel from './components/OppgavekoPanel';

interface OwnProps {
	k9sakUrl: string;
	k9punsjUrl: string;
	omsorgspengerUrl: string;
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
	omsorgspengerUrl,
}) => {
	const refreshUrl = useGlobalStateRestApiData<{ verdi?: string }>(RestApiGlobalStatePathsKeys.REFRESH_URL);
	const [lastHandledTime, setLastHandledTime] = useState(0);
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

	const handleEvent = (e: MessageEvent) => {
		const data = JSON.parse(e.data);
		if (data.melding === 'oppdaterReserverte') {
			hentReserverteOppgaver();
		} else if (data.melding === 'oppdaterTilBehandling') {
			if (valgtOppgavekoId === data.id) {
				hentOppgaverTilBehandling({ id: valgtOppgavekoId });
			}
		}
	};
	useEffect(() => {
		hentReserverteOppgaver();
	}, []);

	useEffect(() => {
		if (valgtOppgavekoId) {
			hentOppgaverTilBehandling({ id: valgtOppgavekoId });
		}
	}, [valgtOppgavekoId]);

	// Use useRef to store the WebSocket instance
	const socketRef = useRef(null);

	useEffect(() => {
		// Initialize the WebSocket
		socketRef.current = new WebSocket(refreshUrl.verdi);

		socketRef.current.onopen = () => {
			// eslint-disable-next-line no-console
			console.log('connected');
		};

		socketRef.current.onmessage = (evt) => {
			const currentTime = new Date().getTime();
			// Check if it's been more than 10 seconds since the last time
			if (currentTime - lastHandledTime >= 10000) {
				handleEvent(evt);
				setLastHandledTime(currentTime);
			}
		};

		socketRef.current.onclose = (event) => {
			// eslint-disable-next-line no-console
			if (event.wasClean) {
				console.log(`Closed cleanly, code=${event.code}, reason=${event.reason}`);
			} else {
				console.log('Connection died');
			}
		};

		socketRef.current.onerror = (err) => {
			// eslint-disable-next-line no-console
			console.error('Socket encountered error: ', err, 'Closing socket');
			socketRef.current.close();
		};

		// Clean up the WebSocket when the component is unmounted
		return () => {
			if (socketRef.current) {
				socketRef.current.close();
			}
		};
	}, [valgtOppgavekoId, lastHandledTime]);

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
			case OppgaveSystem.OMSORGSPENGER:
				window.location.assign(getOmsorgspengerRef(omsorgspengerUrl, oppgave.saksnummer));
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
	);
};

export default injectIntl(BehandlingskoerIndex);
