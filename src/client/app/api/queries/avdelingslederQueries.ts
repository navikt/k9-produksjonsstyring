import { UseQueryOptions, useMutation, useQuery, useQueryClient } from 'react-query';
import { OppgavekøV2, OppgavekøV2Enkel, OppgavekøerV2 } from 'types/OppgavekøV2Type';
import apiPaths from 'api/apiPaths';
import { baseURL } from 'api/rest-api/src/axios/initRestMethods';
import { axiosInstance } from 'utils/reactQueryConfig';

// eslint-disable-next-line import/prefer-default-export
export const useAlleKoer = (options = {}) =>
	useQuery<OppgavekøerV2, unknown, OppgavekøV2Enkel[]>({
		queryKey: [apiPaths.hentOppgavekoer],
		select: (v) => v.koer,
		...options,
	});

export const useNyKøMutation = (callback) => {
	const queryClient = useQueryClient();

	return useMutation<OppgavekøV2, unknown, { url: string; body: { tittel: string } }>({
		onSuccess: (data) =>
			Promise.all([queryClient.invalidateQueries(apiPaths.hentOppgavekoer)]).then(() => {
				if (callback) callback(data.id);
			}),
	});
};

export const useOppdaterKøMutation = (callback) => {
	const queryClient = useQueryClient();
	return useMutation<OppgavekøV2, unknown, OppgavekøV2>(
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

export const useKo = (id: string, options: UseQueryOptions<OppgavekøV2>) =>
	useQuery<OppgavekøV2>({
		...options,
		queryKey: [`${apiPaths.hentOppgaveko}${id}`],
	});
