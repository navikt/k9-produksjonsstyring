import { useMutation, useQuery, useQueryClient } from 'react-query';
import axios from 'axios';
import { OppgavekøV2, OppgavekøerV2 } from 'types/OppgavekøV2Type';
import { apiPaths } from 'api/k9LosApi';

// eslint-disable-next-line import/prefer-default-export
export const useAlleKoer = () =>
	useQuery<OppgavekøerV2, unknown, OppgavekøV2[]>({
		queryKey: [apiPaths.hentOppgavekoer],
		select: (v) => v.koer,
	});

export const useNyKøMutation = (callback) => {
	const queryClient = useQueryClient();

	return useMutation<OppgavekøV2, unknown, { url: string; body: { tittel: string } }>({
		onSuccess: () =>
			queryClient.invalidateQueries(apiPaths.hentOppgavekoer).then(() => {
				if (callback) callback();
			}),
	});
};

export const useOppdaterKøMutation = (callback) =>
	useMutation<OppgavekøV2, unknown, { tittel: string }>(
		(payload) => axios.post(apiPaths.oppdaterOppgaveko, payload).then((res) => res.data),
		{
			onSuccess: () => {
				if (callback) callback();
			},
		},
	);
