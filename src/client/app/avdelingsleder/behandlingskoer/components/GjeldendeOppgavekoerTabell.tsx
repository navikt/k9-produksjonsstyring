
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import {
  Normaltekst, Undertekst, Element, Undertittel,
} from 'nav-frontend-typografi';

import { getKodeverk } from 'kodeverk/duck';
import { Kodeverk } from 'kodeverk/kodeverkTsType';
import kodeverkPropType from 'kodeverk/kodeverkPropType';
import kodeverkTyper from 'kodeverk/kodeverkTyper';
import Image from 'sharedComponents/Image';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import Table from 'sharedComponents/Table';
import TableRow from 'sharedComponents/TableRow';
import TableColumn from 'sharedComponents/TableColumn';
import DateLabel from 'sharedComponents/DateLabel';
import addCircleIcon from 'images/add-circle.svg';
import removeIcon from 'images/remove.svg';
import { Column, Row } from 'nav-frontend-grid';
import SletteOppgavekoModal from './SletteOppgavekoModal';
import { Oppgaveko } from '../oppgavekoTsType';
import oppgavekoPropType from '../oppgavekoPropType';
import { getAntallOppgaverTotaltResultat } from '../duck';

import styles from './gjeldendeOppgavekoerTabell.less';

const headerTextCodes = [
  'GjeldendeOppgavekoerTabell.Listenavn',
  'GjeldendeOppgavekoerTabell.Stonadstype',
  'GjeldendeOppgavekoerTabell.Behandlingtype',
  'GjeldendeOppgavekoerTabell.AntallSaksbehandlere',
  'GjeldendeOppgavekoerTabell.AntallBehandlinger',
  'GjeldendeOppgavekoerTabell.SistEndret',
  'EMPTY_1',
];

interface TsProps {
  oppgavekoer: Oppgaveko[];
  setValgtOppgavekoId: (id: string) => void;
  lagNyOppgaveko: () => void;
  fjernOppgaveko: (id: string) => void;
  valgtOppgavekoId?: string;
  behandlingTyper: Kodeverk[];
  fagsakYtelseTyper: Kodeverk[];
  hentOppgavekoer: () => Oppgaveko[];
  oppgaverTotalt?: number;
  hentAntallOppgaverTotalt: () => Promise<string>;
}

interface StateTsProps {
  valgtOppgaveko?: Oppgaveko;
}

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * GjeldendeOppgavekoerTabell
 */
export class GjeldendeOppgavekoerTabell extends Component<TsProps, StateTsProps> {
  nodes: any[];

  static propTypes = {
    oppgavekoer: PropTypes.arrayOf(oppgavekoPropType).isRequired,
    setValgtOppgavekoId: PropTypes.func.isRequired,
    lagNyOppgaveko: PropTypes.func.isRequired,
    fjernOppgaveko: PropTypes.func.isRequired,
    valgtOppgavekoId: PropTypes.string,
    behandlingTyper: PropTypes.arrayOf(kodeverkPropType).isRequired,
    fagsakYtelseTyper: PropTypes.arrayOf(kodeverkPropType).isRequired,
    hentOppgavekoer: PropTypes.func.isRequired,
    oppgaverTotalt: PropTypes.number,
    hentAntallOppgaverTotalt: PropTypes.func.isRequired,
  };

  static defaultProps = {
    valgtOppgavekoId: undefined,
  }

  constructor(props: TsProps) {
    super(props);

    this.state = {
      valgtOppgaveko: undefined,
    };
    this.nodes = [];
  }

  componentDidMount = () => {
    const {
      hentAntallOppgaverTotalt,
    } = this.props;
    hentAntallOppgaverTotalt();
  }

  setValgtOppgaveko = async (event: Event, id: string) => {
    const { setValgtOppgavekoId, hentOppgavekoer } = this.props;
    if (this.nodes.some((node) => node && node.contains(event.target))) {
      return;
    }

    // Må vente 100 ms før en byttar behandlingskø i tabell. Dette fordi lagring av navn skjer som blur-event. Så i tilfellet
    // der en endrer navn og så trykker direkte på en annen behandlingskø vil ikke lagringen skje før etter at ny kø er valgt.
    await wait(100);

    setValgtOppgavekoId(id);
    hentOppgavekoer();
  }

  lagNyOppgaveko = (event: KeyboardEvent) => {
    if (event.keyCode === 13) {
      const { lagNyOppgaveko } = this.props;
      lagNyOppgaveko();
    }
  };

  visFjernOppgavekoModal = (valgtOppgaveko: Oppgaveko) => {
    this.setState((prevState) => ({ ...prevState, valgtOppgaveko }));
  }

  closeSletteModal = () => {
    this.setState((prevState) => ({ ...prevState, valgtOppgaveko: undefined }));
  }

  fjernOppgaveko = (oppgaveko: Oppgaveko) => {
    const {
      fjernOppgaveko,
    } = this.props;
    this.closeSletteModal();
    fjernOppgaveko(oppgaveko.id);
  }

  formatStonadstyper = (valgteFagsakYtelseTyper?: Kodeverk[]) => {
    if (!valgteFagsakYtelseTyper || valgteFagsakYtelseTyper.length === 0) {
      return <FormattedMessage id="GjeldendeOppgavekoerTabell.Alle" />;
    }

    const { fagsakYtelseTyper } = this.props;
    return valgteFagsakYtelseTyper.map((fyt) => {
      const type = fagsakYtelseTyper.find((def) => def.kode === fyt.kode);
      return type ? type.navn : '';
    }).join(', ');
  };

  formatBehandlingstyper = (valgteBehandlingTyper?: Kodeverk[]) => {
    const { behandlingTyper } = this.props;

    if (!valgteBehandlingTyper || valgteBehandlingTyper.length === 0
      || valgteBehandlingTyper.length === behandlingTyper.length) {
      return <FormattedMessage id="GjeldendeOppgavekoerTabell.Alle" />;
    }

    return valgteBehandlingTyper.map((bt) => {
      const type = behandlingTyper.find((def) => def.kode === bt.kode);
      return type ? type.navn : '';
    }).join(', ');
  };

  render = () => {
    const {
      oppgavekoer, valgtOppgavekoId, lagNyOppgaveko, oppgaverTotalt,
    } = this.props;
    const {
      valgtOppgaveko,
    } = this.state;

    return (
      <>

        <Row>
          <Column xs="9">
            <Element>
              <FormattedMessage id="GjeldendeOppgavekoerTabell.GjeldendeLister" />
            </Element>
          </Column>
          <Column xs="3">
            <div className={styles.grayBox}>
              <Normaltekst>
                <FormattedMessage id="GjeldendeOppgavekoerTabell.OppgaverTotalt" />
                <Undertittel>{oppgaverTotalt || '0'}</Undertittel>
              </Normaltekst>
            </div>
          </Column>
        </Row>
        {oppgavekoer.length === 0 && (
          <>
            <VerticalSpacer eightPx />
            <Normaltekst><FormattedMessage id="GjeldendeOppgavekoerTabell.IngenLister" /></Normaltekst>
            <VerticalSpacer eightPx />
          </>
        )}
        {oppgavekoer.length > 0 && (
        <Table headerTextCodes={headerTextCodes}>
          {oppgavekoer.map((oppgaveko) => (
            <TableRow
              key={oppgaveko.id}
              className={oppgaveko.id === valgtOppgavekoId ? styles.isSelected : undefined}
              id={oppgaveko.id}
              onMouseDown={this.setValgtOppgaveko}
              onKeyDown={this.setValgtOppgaveko}
            >
              <TableColumn>{oppgaveko.navn}</TableColumn>
              <TableColumn>{this.formatStonadstyper(oppgaveko.fagsakYtelseTyper)}</TableColumn>
              <TableColumn>{this.formatBehandlingstyper(oppgaveko.behandlingTyper)}</TableColumn>
              <TableColumn>{oppgaveko.saksbehandlere.length > 0 ? oppgaveko.saksbehandlere.length : ''}</TableColumn>
              <TableColumn>{oppgaveko.antallBehandlinger}</TableColumn>
              <TableColumn>
                <DateLabel dateString={oppgaveko.sistEndret} />
              </TableColumn>
              <TableColumn>
                <div ref={(node) => { this.nodes.push(node); }}>
                  <Image
                    src={removeIcon}
                    className={styles.removeImage}
                    onMouseDown={() => this.visFjernOppgavekoModal(oppgaveko)}
                    onKeyDown={() => this.visFjernOppgavekoModal(oppgaveko)}
                    tabIndex="0"
                  />
                </div>
              </TableColumn>
            </TableRow>
          ))}
        </Table>
        )}
        <div
          id="leggTilListe"
          role="button"
          tabIndex={0}
          className={styles.addPeriode}
          onClick={() => lagNyOppgaveko()}
          onKeyDown={this.lagNyOppgaveko}
        >
          <Image className={styles.addCircleIcon} src={addCircleIcon} />
          <Undertekst className={styles.imageText}>
            <FormattedMessage id="GjeldendeOppgavekoerTabell.LeggTilListe" />
          </Undertekst>
        </div>
        {valgtOppgaveko && (
          <SletteOppgavekoModal
            valgtOppgaveko={valgtOppgaveko}
            cancel={this.closeSletteModal}
            submit={this.fjernOppgaveko}
          />
        )}
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  behandlingTyper: getKodeverk(state)[kodeverkTyper.BEHANDLING_TYPE],
  fagsakYtelseTyper: getKodeverk(state)[kodeverkTyper.FAGSAK_YTELSE_TYPE],
  oppgaverTotalt: getAntallOppgaverTotaltResultat(state),
});

export default connect(mapStateToProps)(GjeldendeOppgavekoerTabell);
