
import { Dispatch } from 'redux';

import k9LosApi from 'api/k9LosApi';

/* Action types */
const actionType = name => `saksliste/${name}`;
const SET_VALGT_OPPGAVEKO_ID = actionType('SET_VALGT_OPPGAVEKO_ID');
const RESET_VALGT_OPPGAVEKO_ID = actionType('RESET_VALGT_OPPGAVEKO_ID');

/* Action creators */
export const setValgtOppgavekoId = (valgtOppgavekoId: string) => ({
  type: SET_VALGT_OPPGAVEKO_ID,
  payload: valgtOppgavekoId,
});


export const resetValgtOppgavekoId = () => ({
  type: RESET_VALGT_OPPGAVEKO_ID,
});

export const fetchAlleOppgavekoer = () => (dispatch: Dispatch) => dispatch(
  k9LosApi.OPPGAVEKOER.makeRestApiRequest()(
    { }, { keepData: true },
  ),
);

export const getAlleOppgavekoer = k9LosApi.OPPGAVEKOER.getRestApiData();

export const fetchAntallOppgaverTotalt = () => (dispatch: Dispatch) => dispatch(
    k9LosApi.OPPGAVE_ANTALL_TOTALT.makeRestApiRequest()({ }),
);

export const fetchAntallOppgaverForOppgaveko = (id: string) => (dispatch: Dispatch) => dispatch(
    k9LosApi.OPPGAVE_ANTALL.makeRestApiRequest()({ id }),
).then(() => dispatch(fetchAntallOppgaverTotalt()));


export const getAntallOppgaverTotaltResultat = k9LosApi.OPPGAVE_ANTALL_TOTALT.getRestApiData();

export const getAntallOppgaverForOppgavekoResultat = k9LosApi.OPPGAVE_ANTALL.getRestApiData();

// k9LosApi.OPPGAVE_ANTALL.getRestApiData();

export const lagNyOppgaveko = () => (dispatch: Dispatch) => dispatch(k9LosApi
  .OPPRETT_NY_OPPGAVEKO.makeRestApiRequest()({ }))
  .then(() => dispatch(resetValgtOppgavekoId()))
  .then(() => dispatch(fetchAlleOppgavekoer()));

export const getNyOppgavekoId = k9LosApi.OPPRETT_NY_OPPGAVEKO.getRestApiData();

export const fjernOppgaveko = (id: string) => (dispatch: Dispatch) => dispatch(
  k9LosApi.SLETT_OPPGAVEKO.makeRestApiRequest()({ id }),
)
  .then(() => dispatch(resetValgtOppgavekoId()))
  .then(() => dispatch(fetchAlleOppgavekoer()));

export const lagreOppgavekoNavn = (oppgaveko: {id: string; navn: number}) => (dispatch: Dispatch) => dispatch(
  k9LosApi.LAGRE_OPPGAVEKO_NAVN.makeRestApiRequest()({ id: oppgaveko.id, navn: oppgaveko.navn }),
).then(() => dispatch(fetchAlleOppgavekoer()));

export const lagreOppgavekoBehandlingstype = (id: string, behandlingType: {}, isChecked: boolean) => (dispatch: Dispatch) => dispatch(
  k9LosApi.LAGRE_OPPGAVEKO_BEHANDLINGSTYPE.makeRestApiRequest()({
    id,
    behandlingType,
    checked: isChecked,
  }),
).then(() => dispatch(fetchAntallOppgaverForOppgaveko(id)))
    .then(() => dispatch(fetchAlleOppgavekoer()));

export const lagreOppgavekoFagsakYtelseType = (id: string, fagsakYtelseType: string) => (dispatch: Dispatch) => {
  const data = fagsakYtelseType !== '' ? { id, fagsakYtelseType } : { id };
  return dispatch(k9LosApi.LAGRE_OPPGAVEKO_FAGSAK_YTELSE_TYPE.makeRestApiRequest()(data))
    .then(() => dispatch(fetchAntallOppgaverForOppgaveko(id)))
    .then(() => dispatch(fetchAlleOppgavekoer()));
};

export const lagreOppgavekoSortering = (id: string, oppgavekoSorteringValg: string) => (dispatch: Dispatch) => dispatch(
  k9LosApi.LAGRE_OPPGAVEKO_SORTERING.makeRestApiRequest()({ id, oppgavekoSorteringValg }),
).then(() => dispatch(fetchAntallOppgaverForOppgaveko(id)))
    .then(() => dispatch(fetchAlleOppgavekoer()));

export const lagreOppgavekoSorteringTidsintervallDato = (id: string, fomDato: string, tomDato: string) => (dispatch: Dispatch<any>) => dispatch(
  k9LosApi.LAGRE_OPPGAVEKO_SORTERING_TIDSINTERVALL_DATO.makeRestApiRequest()({
 id, fomDato, tomDato,
}),
).then(() => dispatch(fetchAntallOppgaverForOppgaveko(id)))
    .then(() => dispatch(fetchAlleOppgavekoer()));

export const lagreOppgavekoAndreKriterier = (id: string, andreKriterierType: string, isChecked: boolean,
                                             skalInkludere: boolean) => (dispatch: Dispatch) => dispatch(
  k9LosApi.LAGRE_OPPGAVEKO_ANDRE_KRITERIER.makeRestApiRequest()({
    id,
    andreKriterierType,
    checked: isChecked,
    inkluder: skalInkludere,
  }),
).then(() => dispatch(fetchAntallOppgaverForOppgaveko(id)))
    .then(() => dispatch(fetchAlleOppgavekoer()));

export const knyttSaksbehandlerTilOppgaveko = (id: string, brukerIdent: string, isChecked: boolean) => (dispatch: Dispatch) => dispatch(
  k9LosApi.LAGRE_OPPGAVEKO_SAKSBEHANDLER.makeRestApiRequest()({
    id,
    brukerIdent,
    checked: isChecked,
  }),
).then(() => dispatch(fetchAlleOppgavekoer()));

/* Reducer */
const initialState = {
  valgtOppgavekoId: undefined,
};

interface StateTsProp {
  valgtOppgavekoId?: string;
}

interface ActionTsProp {
  type: string;
  payload?: any;
}

export const organiseringAvOppgavekoerReducer = (state: StateTsProp = initialState, action: ActionTsProp = { type: '' }) => {
  switch (action.type) {
    case SET_VALGT_OPPGAVEKO_ID:
      return {
        ...state,
        valgtOppgavekoId: action.payload,
      };
    case RESET_VALGT_OPPGAVEKO_ID:
      return initialState;
    default:
      return state;
  }
};

const getOrganiseringAvOppgavekoerContext = state => state.default.organiseringAvOppgavekoerContext;
export const getValgtOppgavekoId = (state: any) => getOrganiseringAvOppgavekoerContext(state).valgtOppgavekoId;
