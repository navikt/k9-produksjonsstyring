import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import { Kodeverk } from 'kodeverk/kodeverkTsType';
import { getValgtAvdelingEnhet } from 'app/duck';
import { fetchAlleSaksbehandlere } from '../saksbehandlere/duck';
import {
  fetchAlleOppgavekoer, getAlleOppgavekoer, setValgtOppgavekoId, getValgtOppgavekoId, lagNyOppgaveko, getNyOppgavekoId,
  fjernOppgaveko, lagreOppgavekoNavn, lagreOppgavekoBehandlingstype, knyttSaksbehandlerTilOppgaveko,
  lagreOppgavekoFagsakYtelseType, fetchAntallOppgaverForOppgaveko, fetchAntallOppgaverTotalt, lagreOppgavekoAndreKriterier,
} from './duck';
import EndreOppgavekoerPanel from './components/EndreOppgavekoerPanel';
import { Oppgaveko } from './oppgavekoTsType';
import oppgavekoPropType from './oppgavekoPropType';

interface TsProps {
  fetchAlleOppgavekoer: () => Oppgaveko[];
  fetchAntallOppgaverForOppgaveko: (oppgavekoId: string) => Promise<string>;
  fetchAntallOppgaverTotalt: () => Promise<string>;
  setValgtOppgavekoId: (oppgavekoId: string) => void;
  lagNyOppgaveko: () => void;
  fjernOppgaveko: (oppgavekoId: string) => void;
  lagreOppgavekoNavn: (oppgaveko: {oppgavekoId: string; navn: string}) => void;
  lagreOppgavekoBehandlingstype: (oppgavekoId: string, behandlingType: Kodeverk, isChecked: boolean,) => void;
  lagreOppgavekoFagsakYtelseType: (oppgavekoId: string, fagsakYtelseType: string) => void;
  knyttSaksbehandlerTilOppgaveko: (oppgavekoId: string, brukerIdent: string, isChecked: boolean,) => void;
  lagreOppgavekoAndreKriterier: (oppgavekoId: string, andreKriterierType: Kodeverk, isChecked: boolean, skalInkludere: boolean) => void;
  oppgavekoer: Oppgaveko[];
  valgtOppgavekoId?: string;
  fetchAlleSaksbehandlere: () => void;
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
    oppgavekoer: PropTypes.arrayOf(oppgavekoPropType),
    valgtOppgavekoId: PropTypes.string,
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
} = this.props;
    fetchOppgavekoer();
    fetchSaksbehandlere();
    fetchAntallOppgaver();
  }

  render = () => {
    const {
      oppgavekoer, valgtOppgavekoId, setValgtOppgavekoId: setValgtId, lagNyOppgaveko: lagNyListe,
      fjernOppgaveko: fjernListe, lagreOppgavekoNavn: lagreListeNavn, lagreOppgavekoBehandlingstype: lagreListeBehandlingstype,
      knyttSaksbehandlerTilOppgaveko: knyttSaksbehandlerTilListe,
      lagreOppgavekoFagsakYtelseType: lagreListeFagsakYtelseType,
      fetchAlleOppgavekoer: hentAlleOppgavekoer,
      fetchAntallOppgaverForOppgaveko: hentAntallOppgaverForOppgaveko,
      fetchAntallOppgaverTotalt: hentAntallOppgaverTotalt,
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
        hentOppgavekoer={hentAlleOppgavekoer}
        hentAntallOppgaverForOppgaveko={hentAntallOppgaverForOppgaveko}
        hentAntallOppgaverTotalt={hentAntallOppgaverTotalt}
      />
    );
  }
}

const mapStateToProps = (state) => {
  const id = getValgtOppgavekoId(state);
  const nyIdObject = getNyOppgavekoId(state);
  const nyId = nyIdObject ? nyIdObject.oppgavekoId : undefined;
  return {
    oppgavekoer: getAlleOppgavekoer(state),
    valgtOppgavekoId: id !== undefined ? id : nyId,
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  ...bindActionCreators({
    fetchAlleOppgavekoer,
    setValgtOppgavekoId,
    lagNyOppgaveko,
    fjernOppgaveko,
    lagreOppgavekoNavn,
    lagreOppgavekoBehandlingstype,
    lagreOppgavekoFagsakYtelseType,
    lagreOppgavekoAndreKriterier,
    knyttSaksbehandlerTilOppgaveko,
    fetchAlleSaksbehandlere,
    fetchAntallOppgaverForOppgaveko,
    fetchAntallOppgaverTotalt,
  }, dispatch),
});


export default connect(mapStateToProps, mapDispatchToProps)(EndreBehandlingskoerIndex);
