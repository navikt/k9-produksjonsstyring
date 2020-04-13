
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

export const fetchAvdelingensOppgavekoer = (avdelingEnhet: string) => (dispatch: Dispatch) => dispatch(
  k9LosApi.OPPGAVEKOER_FOR_AVDELING.makeRestApiRequest()(
    { avdelingEnhet }, { keepData: true },
  ),
);

export const getAvdelingensOppgavekoer = k9LosApi.OPPGAVEKOER_FOR_AVDELING.getRestApiData();

export const fetchAntallOppgaverForAvdeling = (avdelingEnhet: string) => (dispatch: Dispatch) => dispatch(
    k9LosApi.OPPGAVE_AVDELING_ANTALL.makeRestApiRequest()({ avdelingEnhet }),
);

export const fetchAntallOppgaverForOppgaveko = (oppgavekoId: string, avdelingEnhet: string) => (dispatch: Dispatch) => dispatch(
    k9LosApi.OPPGAVE_ANTALL.makeRestApiRequest()({ oppgavekoId, avdelingEnhet }),
).then(() => dispatch(fetchAntallOppgaverForAvdeling(avdelingEnhet)));


export const getAntallOppgaverForAvdelingResultat = k9LosApi.OPPGAVE_AVDELING_ANTALL.getRestApiData();

export const getAntallOppgaverForOppgavekoResultat = k9LosApi.OPPGAVE_ANTALL.getRestApiData();

// k9LosApi.OPPGAVE_ANTALL.getRestApiData();

export const lagNyOppgaveko = (avdelingEnhet: string) => (dispatch: Dispatch) => dispatch(k9LosApi
  .OPPRETT_NY_OPPGAVEKO.makeRestApiRequest()({ avdelingEnhet }))
  .then(() => dispatch(resetValgtOppgavekoId()))
  .then(() => dispatch(fetchAvdelingensOppgavekoer(avdelingEnhet)));
export const getNyOppgavekoId = k9LosApi.OPPRETT_NY_OPPGAVEKO.getRestApiData();

export const fjernOppgaveko = (oppgavekoId: string, avdelingEnhet: string) => (dispatch: Dispatch) => dispatch(
  k9LosApi.SLETT_OPPGAVEKO.makeRestApiRequest()({ oppgavekoId, avdelingEnhet }),
)
  .then(() => dispatch(resetValgtOppgavekoId()))
  .then(() => dispatch(fetchAvdelingensOppgavekoer(avdelingEnhet)));

export const lagreOppgavekoNavn = (oppgaveko: {oppgavekoId: string; navn: number}, avdelingEnhet: string) => (dispatch: Dispatch) => dispatch(
  k9LosApi.LAGRE_OPPGAVEKO_NAVN.makeRestApiRequest()({ oppgavekoId: oppgaveko.oppgavekoId, navn: oppgaveko.navn, avdelingEnhet }),
).then(() => dispatch(fetchAvdelingensOppgavekoer(avdelingEnhet)));

export const lagreOppgavekoBehandlingstype = (oppgavekoId: string, behandlingType: {}, isChecked: boolean,
  avdelingEnhet: string) => (dispatch: Dispatch) => dispatch(
  k9LosApi.LAGRE_OPPGAVEKO_BEHANDLINGSTYPE.makeRestApiRequest()({
    oppgavekoId,
    avdelingEnhet,
    behandlingType,
    checked: isChecked,
  }),
).then(() => dispatch(fetchAntallOppgaverForOppgaveko(oppgavekoId, avdelingEnhet)))
    .then(() => dispatch(fetchAvdelingensOppgavekoer(avdelingEnhet)));

export const lagreOppgavekoFagsakYtelseType = (oppgavekoId: string, fagsakYtelseType: string, avdelingEnhet: string) => (dispatch: Dispatch) => {
  const data = fagsakYtelseType !== '' ? { oppgavekoId, avdelingEnhet, fagsakYtelseType } : { oppgavekoId, avdelingEnhet };
  return dispatch(k9LosApi.LAGRE_OPPGAVEKO_FAGSAK_YTELSE_TYPE.makeRestApiRequest()(data))
    .then(() => dispatch(fetchAntallOppgaverForOppgaveko(oppgavekoId, avdelingEnhet)))
    .then(() => dispatch(fetchAvdelingensOppgavekoer(avdelingEnhet)));
};

export const lagreOppgavekoSortering = (oppgavekoId: string, oppgavekoSorteringValg: string, avdelingEnhet: string) => (dispatch: Dispatch) => dispatch(
  k9LosApi.LAGRE_OPPGAVEKO_SORTERING.makeRestApiRequest()({ oppgavekoId, oppgavekoSorteringValg, avdelingEnhet }),
).then(() => dispatch(fetchAntallOppgaverForOppgaveko(oppgavekoId, avdelingEnhet)))
    .then(() => dispatch(fetchAvdelingensOppgavekoer(avdelingEnhet)));

export const lagreOppgavekoSorteringErDynamiskPeriode = (oppgavekoId: string, avdelingEnhet: string) => (dispatch: Dispatch<any>) => dispatch(
  k9LosApi.LAGRE_OPPGAVEKO_SORTERING_DYNAMISK_PERIDE.makeRestApiRequest()({ oppgavekoId, avdelingEnhet }),
).then(() => dispatch(fetchAntallOppgaverForOppgaveko(oppgavekoId, avdelingEnhet)))
    .then(() => dispatch(fetchAvdelingensOppgavekoer(avdelingEnhet)));

export const lagreOppgavekoSorteringTidsintervallDato = (oppgavekoId: string, fomDato: string, tomDato: string,
  avdelingEnhet: string) => (dispatch: Dispatch<any>) => dispatch(
  k9LosApi.LAGRE_OPPGAVEKO_SORTERING_TIDSINTERVALL_DATO.makeRestApiRequest()({
 oppgavekoId, avdelingEnhet, fomDato, tomDato,
}),
).then(() => dispatch(fetchAntallOppgaverForOppgaveko(oppgavekoId, avdelingEnhet)))
    .then(() => dispatch(fetchAvdelingensOppgavekoer(avdelingEnhet)));

export const lagreOppgavekoSorteringNumeriskIntervall = (oppgavekoId: string, fra: number, til: number,
  avdelingEnhet: string) => (dispatch: Dispatch<any>) => dispatch(
  k9LosApi.LAGRE_OPPGAVEKO_SORTERING_TIDSINTERVALL_DAGER.makeRestApiRequest()({
    oppgavekoId, fra, til, avdelingEnhet,
  }),
).then(() => dispatch(fetchAntallOppgaverForOppgaveko(oppgavekoId, avdelingEnhet)))
    .then(() => dispatch(fetchAvdelingensOppgavekoer(avdelingEnhet)));

export const lagreOppgavekoAndreKriterier = (oppgavekoId: string, andreKriterierType: string, isChecked: boolean, skalInkludere: boolean,
  avdelingEnhet: string) => (dispatch: Dispatch) => dispatch(
  k9LosApi.LAGRE_OPPGAVEKO_ANDRE_KRITERIER.makeRestApiRequest()({
    oppgavekoId,
    avdelingEnhet,
    andreKriterierType,
    checked: isChecked,
    inkluder: skalInkludere,
  }),
).then(() => dispatch(fetchAntallOppgaverForOppgaveko(oppgavekoId, avdelingEnhet)))
    .then(() => dispatch(fetchAvdelingensOppgavekoer(avdelingEnhet)));

export const knyttSaksbehandlerTilOppgaveko = (oppgavekoId: string, brukerIdent: string, isChecked: boolean,
  avdelingEnhet: string) => (dispatch: Dispatch) => dispatch(
  k9LosApi.LAGRE_OPPGAVEKO_SAKSBEHANDLER.makeRestApiRequest()({
    oppgavekoId,
    brukerIdent,
    checked: isChecked,
    avdelingEnhet,
  }),
).then(() => dispatch(fetchAvdelingensOppgavekoer(avdelingEnhet)));

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
