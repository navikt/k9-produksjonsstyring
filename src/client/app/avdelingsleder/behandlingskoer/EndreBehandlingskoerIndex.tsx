import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import { Kodeverk } from 'kodeverk/kodeverkTsType';
import k9LosApi from 'api/k9LosApi';
import KoSorteringType from 'kodeverk/KoSorteringTsType';
import { fetchAlleSaksbehandlere } from '../bemanning/duck';
import {
  fetchAlleOppgavekoer,
  getAlleOppgavekoer,
  setValgtOppgavekoId,
  getValgtOppgavekoId,
  lagNyOppgaveko,
  getNyOppgavekoId,
  fjernOppgaveko,
  lagreOppgavekoNavn,
  lagreOppgavekoBehandlingstype,
  lagreOppgavekoSkjermet,
  knyttSaksbehandlerTilOppgaveko,
  lagreOppgavekoFagsakYtelseType,
  fetchAntallOppgaverForOppgaveko,
  fetchAntallOppgaverTotalt,
  lagreOppgavekoSortering,
  lagreOppgavekoSorteringTidsintervallDato,
  lagreOppgavekoAndreKriterier,
  fetchOppgaveko, fetchDagensTall,
} from './duck';
import EndreOppgavekoerPanel from './components/EndreOppgavekoerPanel';
import { Oppgaveko } from './oppgavekoTsType';
import oppgavekoPropType from './oppgavekoPropType';

interface TsProps {
  fetchAlleOppgavekoer: () => Oppgaveko[];
  fetchAntallOppgaverForOppgaveko: (id: string) => Promise<string>;
  fetchAntallOppgaverTotalt: () => Promise<string>;
  setValgtOppgavekoId: (id: string) => void;
  lagNyOppgaveko: () => void;
  fjernOppgaveko: (id: string) => void;
  lagreOppgavekoNavn: (oppgaveko: {id: string; navn: string}) => void;
  lagreOppgavekoBehandlingstype: (id: string, behandlingType: Kodeverk, isChecked: boolean,) => void;
  lagreOppgavekoFagsakYtelseType: (id: string, fagsakYtelseType: string) => void;
  knyttSaksbehandlerTilOppgaveko: (id: string, brukerIdent: string, isChecked: boolean,) => void;
  lagreOppgavekoAndreKriterier: (id: string, andreKriterierType: Kodeverk, isChecked: boolean, inkluder: boolean) => void;
  lagreOppgavekoSorteringTidsintervallDato: (oppgavekoId: string, fomDato: string, tomDato: string) => void;
  lagreOppgavekoSortering: (oppgavekoId: string, oppgavekoSorteringValg: KoSorteringType) => void;
  lagreOppgavekoSkjermet: (id: string, isChecked: boolean) => void;
  oppgavekoer: Oppgaveko[];
  valgtOppgavekoId?: string;
  fetchAlleSaksbehandlere: () => void;
  fetchOppgaveko: (id: string) => Promise<string>;
  fetchDagensTall: () => Promise<string>;
  requestFinished: boolean;
}

/**
 * EndreBehandlingskoerIndex
 */
export class EndreBehandlingskoerIndex extends Component<TsProps> {
  static propTypes = {
    fetchAlleOppgavekoer: PropTypes.func.isRequired,
    fetchAntallOppgaverForOppgaveko: PropTypes.func.isRequired,
    fetchAntallOppgaverTotalt: PropTypes.func.isRequired,
    setValgtOppgavekoId: PropTypes.func.isRequired,
    lagNyOppgaveko: PropTypes.func.isRequired,
    fjernOppgaveko: PropTypes.func.isRequired,
    lagreOppgavekoNavn: PropTypes.func.isRequired,
    lagreOppgavekoBehandlingstype: PropTypes.func.isRequired,
    lagreOppgavekoFagsakYtelseType: PropTypes.func.isRequired,
    knyttSaksbehandlerTilOppgaveko: PropTypes.func.isRequired,
    fetchAlleSaksbehandlere: PropTypes.func.isRequired,
    lagreOppgavekoAndreKriterier: PropTypes.func.isRequired,
    lagreOppgavekoSkjermet: PropTypes.func.isRequired,
    oppgavekoer: PropTypes.arrayOf(oppgavekoPropType),
    valgtOppgavekoId: PropTypes.string,
    fetchOppgaveko: PropTypes.func.isRequired,
  };

  static defaultProps = {
    oppgavekoer: [],
    valgtOppgavekoId: undefined,
  }

  componentDidMount = () => {
    const {
      fetchAlleOppgavekoer: fetchOppgavekoer,
      fetchAlleSaksbehandlere: fetchSaksbehandlere,
      fetchAntallOppgaverTotalt: fetchAntallOppgaver,
      fetchDagensTall: fetchDagens,
    } = this.props;
    fetchOppgavekoer();
    fetchSaksbehandlere();
    fetchAntallOppgaver();
    fetchDagens();
  }

  render = () => {
    const {
      oppgavekoer, valgtOppgavekoId, setValgtOppgavekoId: setValgtId, lagNyOppgaveko: lagNyListe,
      fjernOppgaveko: fjernListe, lagreOppgavekoNavn: lagreListeNavn, lagreOppgavekoBehandlingstype: lagreListeBehandlingstype,
      knyttSaksbehandlerTilOppgaveko: knyttSaksbehandlerTilListe,
      lagreOppgavekoFagsakYtelseType: lagreListeFagsakYtelseType,
      fetchAlleOppgavekoer: hentAlleOppgavekoer,
      fetchAntallOppgaverForOppgaveko: hentAntallOppgaverForOppgaveko,
      lagreOppgavekoAndreKriterier: lagreAndreKriterier,
      lagreOppgavekoSkjermet: lagreSkjermet,
      lagreOppgavekoSortering: lagreSortering,
      lagreOppgavekoSorteringTidsintervallDato: lagreSorteringDato,
      fetchOppgaveko: hentKo, requestFinished,
    } = this.props;
    return (
      <EndreOppgavekoerPanel
        hentKo={hentKo}
        oppgavekoer={oppgavekoer}
        setValgtOppgavekoId={setValgtId}
        valgtOppgavekoId={valgtOppgavekoId}
        lagNyOppgaveko={lagNyListe}
        requestFinished={requestFinished}
        fjernOppgaveko={fjernListe}
        lagreOppgavekoNavn={lagreListeNavn}
        lagreOppgavekoSortering={lagreSortering}
        lagreOppgavekoSorteringTidsintervallDato={lagreSorteringDato}
        lagreOppgavekoBehandlingstype={lagreListeBehandlingstype}
        lagreOppgavekoFagsakYtelseType={lagreListeFagsakYtelseType}
        lagreOppgavekoAndreKriterier={lagreAndreKriterier}
        knyttSaksbehandlerTilOppgaveko={knyttSaksbehandlerTilListe}
        lagreOppgavekoSkjermet={lagreSkjermet}
        hentOppgavekoer={hentAlleOppgavekoer}
        hentAntallOppgaverForOppgaveko={hentAntallOppgaverForOppgaveko}
      />
    );
  }
}

const mapStateToProps = (state) => {
  const id = getValgtOppgavekoId(state);
  const nyIdObject = getNyOppgavekoId(state);
  const nyId = nyIdObject ? nyIdObject.id : undefined;
  return {
    oppgavekoer: getAlleOppgavekoer(state),
    valgtOppgavekoId: id !== undefined ? id : nyId,
    requestFinished: k9LosApi.OPPGAVEKOER.getRestApiFinished()(state),
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  ...bindActionCreators({
    fetchAlleOppgavekoer,
    fetchOppgaveko,
    setValgtOppgavekoId,
    lagNyOppgaveko,
    fjernOppgaveko,
    lagreOppgavekoNavn,
    lagreOppgavekoBehandlingstype,
    lagreOppgavekoFagsakYtelseType,
    lagreOppgavekoAndreKriterier,
    lagreOppgavekoSkjermet,
    knyttSaksbehandlerTilOppgaveko,
    lagreOppgavekoSortering,
    lagreOppgavekoSorteringTidsintervallDato,
    fetchAlleSaksbehandlere,
    fetchDagensTall,
    fetchAntallOppgaverForOppgaveko,
    fetchAntallOppgaverTotalt,
  }, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(EndreBehandlingskoerIndex);
