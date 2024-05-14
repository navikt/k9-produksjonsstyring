import { UseQueryOptions, useMutation, useQuery, useQueryClient } from 'react-query';
import { OppgavekøV3, OppgavekøV3Enkel, OppgavekøerV3 } from 'types/OppgavekøV3Type';
import apiPaths from 'api/apiPaths';
import { axiosInstance } from 'utils/reactQueryConfig';
import Reservasjon from 'avdelingsleder/reservasjoner/reservasjonTsType';
import { OppgaveNøkkel } from 'types/OppgaveNøkkel';

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
			queryClient.invalidateQueries(apiPaths.hentOppgavekoer).then(() => {
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

export const useAvdelingslederReservasjoner = (options: UseQueryOptions<Reservasjon[], unknown, Reservasjon[]> = {}) =>
	useQuery<Reservasjon[], unknown, Reservasjon[]>({
		queryKey: [apiPaths.avdelinglederReservasjoner],
		...options,
	});

export const useAvdelingslederOpphevReservasjoner = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data: { oppgaveNøkler: Array<OppgaveNøkkel>; begrunnelse: string }) =>
			axiosInstance.post(apiPaths.avdelingslederOpphevReservasjoner, data),
		onSuccess: () => queryClient.invalidateQueries(apiPaths.avdelinglederReservasjoner),
	});
};

export const useAvdelingslederFlyttReservasjoner = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data: {
			oppgaveNøkler: Array<OppgaveNøkkel>;
			begrunnelse: string;
			reservertTilDato: string;
			brukerIdent: string;
		}) => axiosInstance.post(apiPaths.avdelingslederFlyttReservasjoner, data),
		onSuccess: () => queryClient.invalidateQueries(apiPaths.avdelinglederReservasjoner),
	});
};

export const useKopierKøMutation = (callback?: () => void) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: KopierKøPayload) => axiosInstance.post(`${apiPaths.kopierOppgaveko}`, data),
		onSuccess: () =>
			queryClient.invalidateQueries(apiPaths.hentOppgavekoer).then(() => {
				if (callback) callback();
			}),
	});
};

export const useSlettKøMutation = (callback?: () => void) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: string) => axiosInstance.delete(`${apiPaths.slettOppgaveko}${id}`),
		onSuccess: () =>
			queryClient.invalidateQueries(apiPaths.hentOppgavekoer).then(() => {
				if (callback) callback();
			}),
	});
};

export const useOppdaterKøMutation = (callback) => {
	const queryClient = useQueryClient();
	return useMutation<OppgavekøV3, unknown, OppgavekøV3>(
		(payload) => axiosInstance.post(`${apiPaths.oppdaterOppgaveko}`, { ...payload }).then((res) => res.data),
		{
			onSuccess: (props) => {
				const { id } = props;
				Promise.all([
					queryClient.invalidateQueries(apiPaths.hentOppgavekoer),
					queryClient.invalidateQueries(apiPaths.hentOppgaveko(id)),
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
		queryKey: [apiPaths.hentOppgaveko(id)],
	});
