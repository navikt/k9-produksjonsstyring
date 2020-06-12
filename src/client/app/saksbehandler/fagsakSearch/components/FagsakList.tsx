import React, {
  Component, Fragment,
} from 'react';
import { connect } from 'react-redux';
import NavFrontendChevron from 'nav-frontend-chevron';
import Oppgave from 'saksbehandler/oppgaveTsType';
import { Kodeverk } from 'kodeverk/kodeverkTsType';
import { getKodeverk } from 'kodeverk/duck';
import kodeverkTyper from 'kodeverk/kodeverkTyper';
import Table from 'sharedComponents/Table';
import TableRow from 'sharedComponents/TableRow';
import TableColumn from 'sharedComponents/TableColumn';
import { ReserverOppgaveModal } from 'saksbehandler/fagsakSearch/ReserverOppgaveModal';
import { getNavAnsattKanReservere } from 'app/duck';
import { getFagsaker, getFagsakOppgaver } from '../fagsakSearchSelectors';
import { Fagsak } from '../fagsakTsType';

import styles from './fagsakList.less';


const headerTextCodes = [
  'FagsakList.Saksnummer',
  'FagsakList.Navn',
  'FagsakList.Stonadstype',
  'FagsakList.Behandlingstype',
  'EMPTY_1',
];

interface OwnProps {
  sorterteFagsaker: Fagsak[];
  selectOppgaveCallback: (oppgave: Oppgave, skalReservere: boolean) => void;
  fagsakStatusTyper: Kodeverk[];
  fagsakYtelseTyper: Kodeverk[];
  fagsakOppgaver: Oppgave[];
  kanReservere: boolean;
}

interface OwnState {
  visReserverOppgaveModal: boolean;
}

/**
 * FagsakList
 *
 * Presentasjonskomponent. Formaterer fagsak-søkeresultatet for visning i tabell. Sortering av fagsakene blir håndtert her.
 */
export class FagsakList extends Component<OwnProps, OwnState> {
  constructor(props) {
    super(props);

    this.state = {
      visReserverOppgaveModal: false,
    };
  }

  onClick = (oppgave, selectOppgaveCallback) => {
    if (oppgave.erTilSaksbehandling && !oppgave.status.erReservert) {
      this.setState((prevState) => ({ ...prevState, visReserverOppgaveModal: true }));
    } else {
      selectOppgaveCallback(oppgave, false);
    }
  };

  onSubmit = (oppgave: Oppgave, selectOppgaveCallback) => {
    this.setState((prevState) => ({ ...prevState, visReserverOppgaveModal: false }));
    selectOppgaveCallback(oppgave, true);
  };

  onCancel = (oppgave: Oppgave, selectOppgaveCallback) => {
    this.setState((prevState) => ({ ...prevState, visReserverOppgaveModal: true }));
    selectOppgaveCallback(oppgave, false);
  };

    render = () => {
      const {
        sorterteFagsaker,
        fagsakOppgaver,
        selectOppgaveCallback,
        kanReservere,
      } = this.props;
      const {
        visReserverOppgaveModal,
      } = this.state;

      return (
        <Table headerTextCodes={headerTextCodes} classNameTable={styles.table}>
          {sorterteFagsaker.map((fagsak) => {
            const filtrerteOppgaver = fagsakOppgaver.filter((o) => o.saksnummer === fagsak.saksnummer);
            const oppgaver = filtrerteOppgaver.map((oppgave, index) => (
              <TableRow
                key={`oppgave${oppgave.eksternId}`}
                id={oppgave.eksternId}
                onMouseDown={() => this.onClick(oppgave, selectOppgaveCallback)}
                onKeyDown={() => this.onClick(oppgave, selectOppgaveCallback)}
                isDashedBottomBorder={filtrerteOppgaver.length > index + 1}
              >
                <TableColumn>{oppgave.saksnummer}</TableColumn>
                <TableColumn>{oppgave.navn}</TableColumn>
                <TableColumn>{oppgave.fagsakYtelseType.navn}</TableColumn>
                <TableColumn>{oppgave.behandlingstype.navn}</TableColumn>
                <TableColumn><NavFrontendChevron /></TableColumn>
                {visReserverOppgaveModal && kanReservere && !oppgave.status.erReservertAvInnloggetBruker && (
                <ReserverOppgaveModal
                  cancel={() => this.onCancel(oppgave, selectOppgaveCallback)}
                  valgtOppgave={oppgave}
                  submit={() => this.onSubmit(oppgave, selectOppgaveCallback)}
                  selectOppgaveCallback={() => selectOppgaveCallback}
                />
                )}
              </TableRow>
            ));

            return (
              <Fragment key={`fagsak${fagsak.saksnummer}`}>
                {oppgaver.length > 0 && oppgaver}
              </Fragment>
            );
          })}
        </Table>
      );
    }
}

const mapStateToProps = (state) => ({
  sorterteFagsaker: getFagsaker(state),
  fagsakOppgaver: getFagsakOppgaver(state),
  fagsakStatusTyper: getKodeverk(state)[kodeverkTyper.FAGSAK_STATUS],
  fagsakYtelseTyper: getKodeverk(state)[kodeverkTyper.FAGSAK_YTELSE_TYPE],
  kanReservere: getNavAnsattKanReservere(state),
});

export default connect(mapStateToProps)(FagsakList);
