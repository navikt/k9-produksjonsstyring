
import React, {
  Component, Fragment, FunctionComponent, useEffect, useState,
} from 'react';
import { connect } from 'react-redux';
import NavFrontendChevron from 'nav-frontend-chevron';
import { Oppgave } from 'saksbehandler/oppgaveTsType';
import { Kodeverk } from 'kodeverk/kodeverkTsType';
import { getKodeverk } from 'kodeverk/duck';
import kodeverkTyper from 'kodeverk/kodeverkTyper';
import Table from 'sharedComponents/Table';
import TableRow from 'sharedComponents/TableRow';
import TableColumn from 'sharedComponents/TableColumn';
import { ReserverOppgaveModal } from 'saksbehandler/fagsakSearch/ReserverOppgaveModal';
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
}

let viseModal = false;

const onClick = (oppgave, selectOppgaveCallback) => {
  if (oppgave.erTilSaksbehandling && !oppgave.status.erReservert) {
    viseModal = true;
  } else {
    selectOppgaveCallback(oppgave, false);
  }
};

const onSubmit = (oppgave: Oppgave, selectOppgaveCallback) => {
  viseModal = false;
  selectOppgaveCallback(oppgave, true);
};

const onCancel = (oppgave: Oppgave, selectOppgaveCallback) => {
  viseModal = false;
  selectOppgaveCallback(oppgave, false);
};

/**
 * FagsakList
 *
 * Presentasjonskomponent. Formaterer fagsak-søkeresultatet for visning i tabell. Sortering av fagsakene blir håndtert her.
 */
export const FagsakList: FunctionComponent<OwnProps> = ({
  sorterteFagsaker,
  fagsakOppgaver,
  selectOppgaveCallback,
}) => (
  <Table headerTextCodes={headerTextCodes} classNameTable={styles.table}>
    {sorterteFagsaker.map((fagsak) => {
      const filtrerteOppgaver = fagsakOppgaver.filter((o) => o.saksnummer === fagsak.saksnummer);
      const oppgaver = filtrerteOppgaver.map((oppgave, index) => (
        <TableRow
          key={`oppgave${oppgave.eksternId}`}
          id={oppgave.eksternId}
          onMouseDown={() => onClick(oppgave, selectOppgaveCallback)}
          onKeyDown={() => onClick(oppgave, selectOppgaveCallback)}
          isDashedBottomBorder={filtrerteOppgaver.length > index + 1}
        >
          <TableColumn>{oppgave.saksnummer}</TableColumn>
          <TableColumn>{oppgave.navn}</TableColumn>
          <TableColumn>{oppgave.fagsakYtelseType.navn}</TableColumn>
          <TableColumn>{oppgave.behandlingstype.navn}</TableColumn>
          <TableColumn><NavFrontendChevron /></TableColumn>
          {viseModal && (
          <ReserverOppgaveModal
            cancel={() => onCancel(oppgave, selectOppgaveCallback)}
            valgtOppgave={oppgave}
            submit={() => onSubmit(oppgave, selectOppgaveCallback)}
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

const mapStateToProps = (state) => ({
  sorterteFagsaker: getFagsaker(state),
  fagsakOppgaver: getFagsakOppgaver(state),
  fagsakStatusTyper: getKodeverk(state)[kodeverkTyper.FAGSAK_STATUS],
  fagsakYtelseTyper: getKodeverk(state)[kodeverkTyper.FAGSAK_YTELSE_TYPE],
});

export default connect(mapStateToProps)(FagsakList);
