import { useMutation, useQuery, useQueryClient } from 'react-query';
import OppgaveV3 from 'types/OppgaveV3';
import { OppgavekøV3Enkel, OppgavekøerV3 } from 'types/OppgavekøV3Type';
import apiPaths from 'api/apiPaths';
import { baseURL } from 'api/rest-api/src/axios/initRestMethods';
import ReservasjonV3, { ReservasjonV3FraKøDto } from 'saksbehandler/behandlingskoer/ReservasjonV3Dto';
import { OppgavekøV1 } from 'saksbehandler/behandlingskoer/oppgavekoTsType';
import Oppgave from 'saksbehandler/oppgaveTsType';
import { axiosInstance } from 'utils/reactQueryConfig';

export const useAntallOppgaverIKoV3 = (koId: string, options = {}) =>
	useQuery<string, unknown, string>({
		queryKey: [apiPaths.antallOppgaverIKoV3(koId)],
		...options,
	});
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

export const useSaksbehandlerNesteTiV3 = (id: string, options = {}) =>
	useQuery<OppgaveV3[], unknown, OppgaveV3[]>({
		queryKey: [apiPaths.hentTiNesteIKoV3(id)],
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

export const usePlukkOppgaveMutation = (callback?: (oppgave: ReservasjonV3FraKøDto) => void) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: { oppgaveKøId: string }): Promise<ReservasjonV3FraKøDto> =>
			axiosInstance
				.post(`${baseURL()}${apiPaths.hentOppgaveFraKoV3(data.oppgaveKøId)}`, data)
				.then((response) => response.data),
		onSuccess: (data: ReservasjonV3FraKøDto) => {
			Promise.all([queryClient.invalidateQueries(apiPaths.saksbehandlerReservasjoner)]).then(() => {
				if (callback) callback(data);
			});
		},
	});
};
