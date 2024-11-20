import { UseMutationOptions, UseQueryOptions, useMutation, useQuery, useQueryClient } from 'react-query';
import NavAnsatt from 'app/navAnsattTsType';
import apiPaths from 'api/apiPaths';
import { SaksbehandlerEnkel } from 'avdelingsleder/bemanning/saksbehandlerTsType';
import ReservasjonV3, { ReservasjonV3FraKøDto } from 'saksbehandler/behandlingskoer/ReservasjonV3Dto';
import { OppgavekøV1 } from 'saksbehandler/behandlingskoer/oppgavekoTsType';
import { SokeResultat } from 'saksbehandler/fagsakSearch/sokeResultatTsType';
import { OppgaveStatus } from 'saksbehandler/oppgaveStatusTsType';
import Oppgave from 'saksbehandler/oppgaveTsType';
import { SøkeboksOppgaveDto } from 'saksbehandler/sokeboks/SøkeboksOppgaveDto';
import EndreOppgaveType from 'types/EndreOppgaveType';
import { OppgaveNøkkel } from 'types/OppgaveNøkkel';
import OppgaveV3 from 'types/OppgaveV3';
import { OppgavekøV3Enkel } from 'types/OppgavekøV3Type';
import { axiosInstance } from 'utils/reactQueryConfig';

export const useInnloggetSaksbehandler = (options: UseQueryOptions<NavAnsatt, Error> = {}) =>
	useQuery(apiPaths.saksbehandler, options);
export const useGetAlleSaksbehandlere = (options: UseQueryOptions<SaksbehandlerEnkel[], Error> = {}) =>
	useQuery<SaksbehandlerEnkel[], Error>(apiPaths.hentSaksbehandlereSomSaksbehandler, options);

export const useAntallOppgaverIKoV3UtenReserverte = (
	koId: string,
	options: UseQueryOptions<{ antallUtenReserverte: number }, Error, { antallUtenReserverte: number }> = {},
) =>
	useQuery<{ antallUtenReserverte: number }, Error, { antallUtenReserverte: number }>({
		queryKey: [apiPaths.antallOppgaverIKoV3UtenReserverte(koId)],
		...options,
	});

export const useAlleSaksbehandlerKoerV1 = (options: UseQueryOptions<OppgavekøV1[], Error> = {}) =>
	useQuery<OppgavekøV1[], Error>({
		queryKey: [apiPaths.hentAlleKoerSaksbehandlerV1],
		...options,
	});

export const useAlleSaksbehandlerKoerV3 = (options: UseQueryOptions<OppgavekøV3Enkel[], Error> = {}) =>
	useQuery<OppgavekøV3Enkel[], Error>({
		queryKey: [apiPaths.hentAlleKoerSaksbehandlerV3],
		...options,
	});

export const useSaksbehandlerNesteTiV3 = (id: string, options: UseQueryOptions<OppgaveV3[], Error> = {}) =>
	useQuery<OppgaveV3[], Error, OppgaveV3[]>({
		queryKey: [apiPaths.hentTiNesteIKoV3(id)],
		...options,
	});

export const useSaksbehandlerNesteTiV1 = (id: string, options: UseQueryOptions<Oppgave[], Error> = {}) =>
	useQuery<Oppgave[], Error, Oppgave[]>({
		queryKey: [apiPaths.saksbehandlerNesteOppgaver(id)],
		...options,
	});

export const useSaksbehandlerReservasjoner = (options: UseQueryOptions<ReservasjonV3[], Error> = {}) =>
	useQuery<ReservasjonV3[], Error, ReservasjonV3[]>({
		queryKey: [apiPaths.saksbehandlerReservasjoner],
		...options,
	});
export const useSøk = (options: UseMutationOptions<SokeResultat, Error, string> = {}) =>
	useMutation({
		...options,
		mutationFn: (searchString: string): Promise<SokeResultat> =>
			axiosInstance.post(apiPaths.sok, { searchString }).then((response) => response.data),
	});

export const useReserverOppgaveMutation = (onSuccess?: () => void) => {
	const queryClient = useQueryClient();
	return useMutation({
		onSuccess: () => {
			queryClient.refetchQueries(apiPaths.saksbehandlerReservasjoner);
			queryClient.refetchQueries(apiPaths.avdelinglederReservasjoner);
			if (onSuccess) onSuccess();
		},
		mutationFn: (oppgaveNøkkel: OppgaveNøkkel): Promise<OppgaveStatus> =>
			axiosInstance.post(apiPaths.reserverOppgave, { oppgaveNøkkel }).then((response) => response.data),
	});
};

export const useEndreReservasjoner = (onSuccess?: () => void) => {
	const queryClient = useQueryClient();
	return useMutation<OppgaveStatus, Error, EndreOppgaveType[]>({
		mutationFn: (data) => axiosInstance.post(apiPaths.endreReservasjoner, data),
		onSuccess: () => {
			queryClient.refetchQueries(apiPaths.saksbehandlerReservasjoner);
			queryClient.refetchQueries(apiPaths.avdelinglederReservasjoner);
			if (onSuccess) onSuccess();
		},
	});
};
export const usePlukkOppgaveMutation = (callback?: (oppgave: ReservasjonV3FraKøDto) => void) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: { oppgaveKøId: string }): Promise<ReservasjonV3FraKøDto> =>
			axiosInstance.post(`${apiPaths.hentOppgaveFraKoV3(data.oppgaveKøId)}`, data).then((response) => response.data),
		onSuccess: (data: ReservasjonV3FraKøDto) => {
			queryClient.invalidateQueries(apiPaths.saksbehandlerReservasjoner).then(() => {
				if (callback) callback(data);
			});
		},
	});
};

export const useOpphevReservasjoner = (onSuccess?: () => void) => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data: Array<{ oppgaveNøkkel: OppgaveNøkkel }>) =>
			axiosInstance.post(apiPaths.opphevReservasjoner, data),
		onSuccess: () => {
			queryClient.invalidateQueries(apiPaths.saksbehandlerReservasjoner);
			queryClient.invalidateQueries(apiPaths.avdelinglederReservasjoner);
			if (onSuccess) onSuccess();
		},
	});
};

export const useSøkOppgaveV3 = () =>
	useMutation({
		mutationFn: (searchString: string): Promise<SøkeboksOppgaveDto[]> =>
			axiosInstance.post(apiPaths.sokV3, { searchString }).then((response) => response.data),
	});
