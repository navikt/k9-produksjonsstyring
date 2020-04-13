import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import { Kodeverk } from 'kodeverk/kodeverkTsType';
import { getValgtAvdelingEnhet } from 'app/duck';
import { fetchAvdelingensSaksbehandlere } from '../saksbehandlere/duck';
import {
  fetchAvdelingensOppgavekoer, getAvdelingensOppgavekoer, setValgtOppgavekoId, getValgtOppgavekoId, lagNyOppgaveko, getNyOppgavekoId,
  fjernOppgaveko, lagreOppgavekoNavn, lagreOppgavekoBehandlingstype, knyttSaksbehandlerTilOppgaveko,
  lagreOppgavekoFagsakYtelseType, fetchAntallOppgaverForOppgaveko, fetchAntallOppgaverForAvdeling, lagreOppgavekoAndreKriterier,
} from './duck';
import EndreOppgavekoerPanel from './components/EndreOppgavekoerPanel';
import { Oppgaveko } from './oppgavekoTsType';
import oppgavekoPropType from './oppgavekoPropType';

interface TsProps {
  fetchAvdelingensOppgavekoer: (avdelingEnhet: string) => Oppgaveko[];
  fetchAntallOppgaverForOppgaveko: (oppgavekoId: string, avdelingEnhet: string) => Promise<string>;
  fetchAntallOppgaverForAvdeling: (avdelingEnhet: string) => Promise<string>;
  setValgtOppgavekoId: (oppgavekoId: string) => void;
  lagNyOppgaveko: (avdelingEnhet: string) => void;
  fjernOppgaveko: (oppgavekoId: string, avdelingEnhet: string) => void;
  lagreOppgavekoNavn: (oppgaveko: {oppgavekoId: string; navn: string}, avdelingEnhet: string) => void;
  lagreOppgavekoBehandlingstype: (oppgavekoId: string, behandlingType: Kodeverk, isChecked: boolean, avdelingEnhet: string) => void;
  lagreOppgavekoFagsakYtelseType: (oppgavekoId: string, fagsakYtelseType: string, avdelingEnhet: string) => void;
  knyttSaksbehandlerTilOppgaveko: (oppgavekoId: string, brukerIdent: string, isChecked: boolean, avdelingEnhet: string) => void;
  lagreOppgavekoAndreKriterier: (oppgavekoId: string, andreKriterierType: Kodeverk, isChecked: boolean, skalInkludere: boolean, avdelingEnhet: string) => void;
  oppgavekoer: Oppgaveko[];
  valgtOppgavekoId?: string;
  fetchAvdelingensSaksbehandlere: (avdelingEnhet: string) => void;
  valgtAvdelingEnhet: string;
}

/**
 * EndreBehandlingskoerIndex
 */
export class EndreBehandlingskoerIndex extends Component<TsProps> {
  static propTypes = {
    fetchAvdelingensOppgavekoer: PropTypes.func.isRequired,
    fetchAntallOppgaverForOppgaveko: PropTypes.func.isRequired,
    fetchAntallOppgaverForAvdeling: PropTypes.func.isRequired,
    setValgtOppgavekoId: PropTypes.func.isRequired,
    lagNyOppgaveko: PropTypes.func.isRequired,
    fjernOppgaveko: PropTypes.func.isRequired,
    lagreOppgavekoNavn: PropTypes.func.isRequired,
    lagreOppgavekoBehandlingstype: PropTypes.func.isRequired,
    lagreOppgavekoFagsakYtelseType: PropTypes.func.isRequired,
    knyttSaksbehandlerTilOppgaveko: PropTypes.func.isRequired,
    fetchAvdelingensSaksbehandlere: PropTypes.func.isRequired,
    lagreOppgavekoAndreKriterier: PropTypes.func.isRequired,
    oppgavekoer: PropTypes.arrayOf(oppgavekoPropType),
    valgtOppgavekoId: PropTypes.string,
    valgtAvdelingEnhet: PropTypes.string.isRequired,
  };

  static defaultProps = {
    oppgavekoer: [],
    valgtOppgavekoId: undefined,
  }

  componentDidMount = () => {
    const {
      fetchAvdelingensOppgavekoer: fetchOppgavekoer,
      fetchAvdelingensSaksbehandlere: fetchSaksbehandlere,
      fetchAntallOppgaverForAvdeling: fetchAntallOppgaver,
      valgtAvdelingEnhet,
} = this.props;
    fetchOppgavekoer(valgtAvdelingEnhet);
    fetchSaksbehandlere(valgtAvdelingEnhet);
    fetchAntallOppgaver(valgtAvdelingEnhet);
  }

  render = () => {
    const {
      oppgavekoer, valgtOppgavekoId, setValgtOppgavekoId: setValgtId, lagNyOppgaveko: lagNyListe,
      fjernOppgaveko: fjernListe, lagreOppgavekoNavn: lagreListeNavn, lagreOppgavekoBehandlingstype: lagreListeBehandlingstype,
      knyttSaksbehandlerTilOppgaveko: knyttSaksbehandlerTilListe,
      lagreOppgavekoFagsakYtelseType: lagreListeFagsakYtelseType,
      fetchAvdelingensOppgavekoer: hentAvdelingensOppgavekoer,
      fetchAntallOppgaverForOppgaveko: hentAntallOppgaverForOppgaveko,
      fetchAntallOppgaverForAvdeling: hentAntallOppgaverForAvdeling,
      lagreOppgavekoAndreKriterier: lagreAndreKriterier,
    } = this.props;
    return (
      <EndreOppgavekoerPanel
        oppgavekoer={oppgavekoer}
        setValgtOppgavekoId={setValgtId}
        valgtOppgavekoId={valgtOppgavekoId}
        lagNyOppgaveko={lagNyListe}
        fjernOppgaveko={fjernListe}
        lagreOppgavekoNavn={lagreListeNavn}
        lagreOppgavekoBehandlingstype={lagreListeBehandlingstype}
        lagreOppgavekoFagsakYtelseType={lagreListeFagsakYtelseType}
        lagreOppgavekoAndreKriterier={lagreAndreKriterier}
        knyttSaksbehandlerTilOppgaveko={knyttSaksbehandlerTilListe}
        hentAvdelingensOppgavekoer={hentAvdelingensOppgavekoer}
        hentAntallOppgaverForOppgaveko={hentAntallOppgaverForOppgaveko}
        hentAntallOppgaverForAvdeling={hentAntallOppgaverForAvdeling}
      />
    );
  }
}

const mapStateToProps = (state) => {
  const id = getValgtOppgavekoId(state);
  const nyIdObject = getNyOppgavekoId(state);
  const nyId = nyIdObject ? parseInt(nyIdObject.oppgavekoId, 10) : undefined;
  return {
    oppgavekoer: getAvdelingensOppgavekoer(state),
    valgtOppgavekoId: id !== undefined ? id : nyId,
    valgtAvdelingEnhet: getValgtAvdelingEnhet(state),
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  ...bindActionCreators({
    fetchAvdelingensOppgavekoer,
    setValgtOppgavekoId,
    lagNyOppgaveko,
    fjernOppgaveko,
    lagreOppgavekoNavn,
    lagreOppgavekoBehandlingstype,
    lagreOppgavekoFagsakYtelseType,
    lagreOppgavekoAndreKriterier,
    knyttSaksbehandlerTilOppgaveko,
    fetchAvdelingensSaksbehandlere,
    fetchAntallOppgaverForOppgaveko,
    fetchAntallOppgaverForAvdeling,
  }, dispatch),
});


export default connect(mapStateToProps, mapDispatchToProps)(EndreBehandlingskoerIndex);
