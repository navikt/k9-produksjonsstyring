import { UseQueryOptions, useMutation, useQuery, useQueryClient } from 'react-query';
import { OppgavekøV3, OppgavekøV3Enkel, OppgavekøerV3 } from 'types/OppgavekøV2Type';
import apiPaths from 'api/apiPaths';
import { baseURL } from 'api/rest-api/src/axios/initRestMethods';
import { axiosInstance } from 'utils/reactQueryConfig';

// eslint-disable-next-line import/prefer-default-export
export const useAlleKoer = (options = {}) =>
	useQuery<OppgavekøerV3, unknown, OppgavekøV3Enkel[]>({
		queryKey: [apiPaths.hentOppgavekoer],
		select: (v) => v.koer,
		...options,
	});

export const useNyKøMutation = (callback) => {
	const queryClient = useQueryClient();

	return useMutation<OppgavekøV3, unknown, { url: string; body: { tittel: string } }>({
		onSuccess: (data) =>
			Promise.all([queryClient.invalidateQueries(apiPaths.hentOppgavekoer)]).then(() => {
				if (callback) callback(data.id);
			}),
	});
};

interface KopierKøPayload {
	kopierFraOppgaveId: string;
	tittel: string;
	taMedQuery: boolean;
	taMedSaksbehandlere: boolean;
}

export const useKopierKøMutation = (callback?: () => void) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: KopierKøPayload) => axiosInstance.post(`${baseURL()}${apiPaths.kopierOppgaveko}`, data),
		onSuccess: () =>
			Promise.all([queryClient.invalidateQueries(apiPaths.hentOppgavekoer)]).then(() => {
				if (callback) callback();
			}),
	});
};

export const useSlettKøMutation = (callback?: () => void) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: string) => axiosInstance.delete(`${baseURL()}${apiPaths.slettOppgaveko}${id}`),
		onSuccess: () =>
			Promise.all([queryClient.invalidateQueries(apiPaths.hentOppgavekoer)]).then(() => {
				if (callback) callback();
			}),
	});
};

export const useOppdaterKøMutation = (callback) => {
	const queryClient = useQueryClient();
	return useMutation<OppgavekøV3, unknown, OppgavekøV3>(
		(payload) =>
			axiosInstance.post(`${baseURL()}${apiPaths.oppdaterOppgaveko}`, { ...payload }).then((res) => res.data),
		{
			onSuccess: (props) => {
				const { id } = props;
				Promise.all([
					queryClient.invalidateQueries(apiPaths.hentOppgavekoer),
					queryClient.invalidateQueries(`${apiPaths.hentOppgaveko}${id}`),
				]).then(() => {
					if (callback) callback();
				});
			},
		},
	);
};

export const useKo = (id: string, options: UseQueryOptions<OppgavekøV3>) =>
	useQuery<OppgavekøV3>({
		...options,
		queryKey: [`${apiPaths.hentOppgaveko}${id}`],
	});
