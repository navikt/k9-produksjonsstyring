import k9LosApi from 'api/k9LosApi';
import { Dispatch } from 'redux';
import Oppgave from 'saksbehandler/oppgaveTsType';

/* Action creators */
export const fetchBehandledeOppgaver = k9LosApi.BEHANDLEDE_OPPGAVER.makeRestApiRequest();
export const getBehandledeOppgaver = k9LosApi.BEHANDLEDE_OPPGAVER.getRestApiData();
