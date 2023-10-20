import { useMutation, useQuery, useQueryClient } from 'react-query';
import { OppgavekøV2Enkel, OppgavekøerV2 } from 'types/OppgavekøV2Type';
import apiPaths from 'api/apiPaths';
import { baseURL } from 'api/rest-api/src/axios/initRestMethods';
import ReservasjonV3Dto from 'saksbehandler/behandlingskoer/ReservasjonV3Dto';
import { axiosInstance } from 'utils/reactQueryConfig';

export const useAlleSaksbehandlerKoer = (options = {}) =>
	useQuery<OppgavekøerV2, unknown, OppgavekøV2Enkel[]>({
		queryKey: [apiPaths.hentAlleKoerSaksbehandler],
		...options,
	});

export const useSaksbehandlerReservasjoner = (options = {}) =>
	useQuery<ReservasjonV3Dto[], unknown, ReservasjonV3Dto[]>({
		queryKey: [apiPaths.saksbehandlerReservasjoner],
		...options,
	});

export const usePlukkOppgaveMutation = (callback?: () => void) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: { oppgaveKøId: string }) =>
			axiosInstance.post(`${baseURL()}${apiPaths.hentOppgaveFraNyKo}`, data),
		onSuccess: (data) => {
			console.log(data);
			Promise.all([queryClient.invalidateQueries(apiPaths.saksbehandlerReservasjoner)]).then(() => {
				if (callback) callback();
			});
		},
	});
};
