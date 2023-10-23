import { useMutation, useQuery, useQueryClient } from 'react-query';
import { OppgavekøV3Enkel, OppgavekøerV3 } from 'types/OppgavekøV2Type';
import apiPaths from 'api/apiPaths';
import { baseURL } from 'api/rest-api/src/axios/initRestMethods';
import OppgaveV3 from 'saksbehandler/OppgaveV3';
import ReservasjonV3 from 'saksbehandler/behandlingskoer/ReservasjonV3Dto';
import { OppgavekøV1 } from 'saksbehandler/behandlingskoer/oppgavekoTsType';
import Oppgave from 'saksbehandler/oppgaveTsType';
import { axiosInstance } from 'utils/reactQueryConfig';

export const useAlleSaksbehandlerKoerV1 = (options = {}) =>
	useQuery<OppgavekøV1[], unknown, OppgavekøV1[]>({
		queryKey: [apiPaths.hentAlleKoerSaksbehandlerV1],
		...options,
	});
export const useAlleSaksbehandlerKoerV3 = (options = {}) =>
	useQuery<OppgavekøerV3, unknown, OppgavekøV3Enkel[]>({
		queryKey: [apiPaths.hentAlleKoerSaksbehandlerV3],
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

export const usePlukkOppgaveMutation = (callback?: (oppgave: OppgaveV3) => void) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: { oppgaveKøId: string }): Promise<OppgaveV3> =>
			axiosInstance.post(`${baseURL()}${apiPaths.hentOppgaveFraNyKo}`, data).then((response) => response.data),
		onSuccess: (data: OppgaveV3) => {
			Promise.all([queryClient.invalidateQueries(apiPaths.saksbehandlerReservasjoner)]).then(() => {
				if (callback) callback(data);
			});
		},
	});
};
