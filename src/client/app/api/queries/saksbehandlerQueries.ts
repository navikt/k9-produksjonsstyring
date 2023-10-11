import { useQuery } from 'react-query';
import { OppgavekøV2Enkel, OppgavekøerV2 } from 'types/OppgavekøV2Type';
import apiPaths from 'api/apiPaths';
import Oppgave from 'saksbehandler/oppgaveTsType';

export const useAlleSaksbehandlerKoer = (options = {}) =>
	useQuery<OppgavekøerV2, unknown, OppgavekøV2Enkel[]>({
		queryKey: [apiPaths.hentAlleKoerSaksbehandler],
		...options,
	});

export const useSaksbehandlerReservasjoner = (options = {}) =>
	useQuery<Oppgave[], unknown, Oppgave[]>({
		queryKey: [apiPaths.saksbehandlerReservasjoner],
		...options,
	});
