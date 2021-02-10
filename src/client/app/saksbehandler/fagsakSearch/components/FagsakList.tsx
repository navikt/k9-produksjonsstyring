import React, { FunctionComponent, useState } from 'react';
import NavFrontendChevron from 'nav-frontend-chevron';
import Oppgave from 'saksbehandler/oppgaveTsType';
import Table from 'sharedComponents/Table';
import TableRow from 'sharedComponents/TableRow';
import TableColumn from 'sharedComponents/TableColumn';
import { ReserverOppgaveModal } from 'saksbehandler/fagsakSearch/ReserverOppgaveModal';
import useGlobalStateRestApiData from 'api/rest-api-hooks/src/global-data/useGlobalStateRestApiData';
import NavAnsatt from 'app/navAnsattTsType';
import { RestApiGlobalStatePathsKeys } from 'api/k9LosApi';
import styles from './fagsakList.less';

const headerTextCodes = [
  'FagsakList.Saksnummer',
  'FagsakList.Navn',
  'FagsakList.Stonadstype',
  'EMPTY_1',
];

interface OwnProps {
    fagsakOppgaver: Oppgave[];
    selectOppgaveCallback: (oppgave: Oppgave, skalReservere: boolean) => void;
}

/**
 * FagsakList
 *
 * Presentasjonskomponent. Formaterer fagsak-søkeresultatet for visning i tabell. Sortering av fagsakene blir håndtert her.
 */
const FagsakList: FunctionComponent<OwnProps> = ({
  fagsakOppgaver,
  selectOppgaveCallback,
}) => {
  const [visReserverOppgaveModal, setVisReserverOppgaveModal] = useState(false);

  const { kanReservere } = useGlobalStateRestApiData<NavAnsatt>(RestApiGlobalStatePathsKeys.NAV_ANSATT);

  const onClick = (oppgave, selectCallback) => {
    if (!kanReservere) {
      selectCallback(oppgave, false);
    }
    if (oppgave.erTilSaksbehandling && !oppgave.status.erReservert && oppgave.system === 'K9SAK') {
      setVisReserverOppgaveModal(true);
    } else {
      selectCallback(oppgave, false);
    }
  };

  const onSubmit = (oppgave: Oppgave, selectCallback) => {
    setVisReserverOppgaveModal(false);
    selectCallback(oppgave, true);
  };

  const onCancel = (oppgave: Oppgave, selectCallback) => {
    setVisReserverOppgaveModal(true);
    selectCallback(oppgave, false);
  };

  return (
    <Table headerTextCodes={headerTextCodes} classNameTable={styles.table}>
      {fagsakOppgaver.map((oppgave, index) => (
        <TableRow
          key={`oppgave${oppgave.eksternId}`}
          id={oppgave.eksternId}
          onMouseDown={() => onClick(oppgave, selectOppgaveCallback)}
          onKeyDown={() => onClick(oppgave, selectOppgaveCallback)}
          isDashedBottomBorder={fagsakOppgaver.length > index + 1}
        >
          <TableColumn>{oppgave.saksnummer}</TableColumn>
          <TableColumn>{oppgave.navn}</TableColumn>
          <TableColumn>{oppgave.fagsakYtelseType.navn}</TableColumn>
          <TableColumn><NavFrontendChevron /></TableColumn>
          {visReserverOppgaveModal && kanReservere && !oppgave.status.erReservertAvInnloggetBruker && (
          <ReserverOppgaveModal
            cancel={() => onCancel(oppgave, selectOppgaveCallback)}
            valgtOppgave={oppgave}
            submit={() => onSubmit(oppgave, selectOppgaveCallback)}
            selectOppgaveCallback={() => selectOppgaveCallback}
          />
          )}
        </TableRow>
      ))}
    </Table>
  );
};

export default FagsakList;
