
import k9LosApi from 'api/k9LosApi';

/* Action creators */
export const fetchBehandledeOppgaver = k9LosApi.BEHANDLEDE_OPPGAVER.makeRestApiRequest();
export const getBehandledeOppgaver = k9LosApi.BEHANDLEDE_OPPGAVER.getRestApiData();
