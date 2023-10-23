import { useMutation, useQuery, useQueryClient } from 'react-query';
import { OppgavekøV2Enkel, OppgavekøerV2 } from 'types/OppgavekøV2Type';
import apiPaths from 'api/apiPaths';
import { baseURL } from 'api/rest-api/src/axios/initRestMethods';
import ReservasjonV3 from 'saksbehandler/behandlingskoer/ReservasjonV3Dto';
import Oppgave from 'saksbehandler/oppgaveTsType';
import { axiosInstance } from 'utils/reactQueryConfig';

export const useAlleSaksbehandlerKoer = (options = {}) =>
	useQuery<OppgavekøerV2, unknown, OppgavekøV2Enkel[]>({
		queryKey: [apiPaths.hentAlleKoerSaksbehandler],
		...options,
	});

export const useSaksbehandlerNesteTiV1 = (id: string, options = {}) =>
	useQuery<Oppgave[], unknown, Oppgave[]>({
		queryKey: [apiPaths.saksbehandlerNesteOppgaver(id)],
		...options,
	});
export const useSaksbehandlerReservasjoner = (options = {}) =>
	useQuery<ReservasjonV3[], unknown, ReservasjonV3[]>({
		queryKey: [apiPaths.saksbehandlerReservasjoner],
		...options,
	});

export const usePlukkOppgaveMutation = (callback?: () => void) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: { oppgaveKøId: string }) =>
			axiosInstance.post(`${baseURL()}${apiPaths.hentOppgaveFraNyKo}`, data),
		onSuccess: () => {
			Promise.all([queryClient.invalidateQueries(apiPaths.saksbehandlerReservasjoner)]).then(() => {
				if (callback) callback();
			});
		},
	});
};
