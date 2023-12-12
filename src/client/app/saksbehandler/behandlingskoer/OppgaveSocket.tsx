import { useEffect, useRef, useState } from 'react';
import { RestApiGlobalStatePathsKeys } from 'api/k9LosApi';
import { useGlobalStateRestApiData } from 'api/rest-api-hooks';

interface Props {
	hentOppgaverTilBehandling: ({ id }: { id: string }) => void;
	hentReserverteOppgaver: () => void;
	valgtOppgavekoId?: string;
}

const OppgaveSocket = ({ hentOppgaverTilBehandling, hentReserverteOppgaver, valgtOppgavekoId }: Props) => {
	const socketRef = useRef<WebSocket | null>(null);
	const refreshUrl = useGlobalStateRestApiData<{ verdi?: string }>(RestApiGlobalStatePathsKeys.REFRESH_URL);
	const [retryCount, setRetryCount] = useState(0);
	const lastHandledTimeRef = useRef<number>(0);
	// Calculate the base delay: doubles with each retry.
	const baseDelay = 1000 * 2 ** retryCount;
	// Ensure the delay doesn't exceed 30 seconds (30000 milliseconds).
	const RECONNECT_DELAY = Math.min(baseDelay, 30000);
	const THROTTLE_TIME = 10000;

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const processMessageData = (data: any) => {
		const currentTime = new Date().getTime();
		if (currentTime - lastHandledTimeRef.current < THROTTLE_TIME) return;

		if (data.melding === 'oppdaterReserverte') {
			hentReserverteOppgaver();
		} else if (data.melding === 'oppdaterTilBehandling' && valgtOppgavekoId === data.id) {
			hentOppgaverTilBehandling({ id: valgtOppgavekoId });
		}
		lastHandledTimeRef.current = currentTime;
	};

	const initializeWebSocket = () => {
		if (!refreshUrl.verdi) return;

		const ws = new WebSocket(refreshUrl.verdi);

		ws.onopen = () => {
			// eslint-disable-next-line no-console
			console.log('connected');
			setRetryCount(0);
		};

		ws.onmessage = (evt) => {
			const data = JSON.parse(evt.data);
			if (data && data.melding) {
				processMessageData(data);
			}
		};

		ws.onclose = (event) => {
			if (!event.wasClean) {
				// eslint-disable-next-line no-console
				console.log('Connection interrupted');
				setRetryCount((prev) => prev + 1);
			}
		};

		ws.onerror = (err) => {
			// eslint-disable-next-line no-console
			console.error('Socket encountered an error:', err, 'Closing socket.');
			ws.close();
			setRetryCount((prev) => prev + 1);
		};

		socketRef.current = ws;
	};

	useEffect(() => {
		initializeWebSocket();

		// Cleanup on unmount
		return () => {
			if (socketRef.current) {
				socketRef.current.close();
			}
		};
	}, [refreshUrl.verdi, valgtOppgavekoId]);

	useEffect(() => {
		if (retryCount <= 0) return;

		const timeoutId = setTimeout(initializeWebSocket, RECONNECT_DELAY);

		// eslint-disable-next-line consistent-return
		return () => clearTimeout(timeoutId);
	}, [retryCount]);

	return null;
};

export default OppgaveSocket;
