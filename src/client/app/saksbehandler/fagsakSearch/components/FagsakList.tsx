import React, { FunctionComponent, useState } from 'react';
import NavFrontendChevron from 'nav-frontend-chevron';
import Oppgave from 'saksbehandler/oppgaveTsType';
import Table from 'sharedComponents/Table';
import TableRow from 'sharedComponents/TableRow';
import TableColumn from 'sharedComponents/TableColumn';
import advarselImageUrl from 'images/advarsel.svg';

import timeglassUrl from 'images/timeglass.svg';
import useGlobalStateRestApiData from 'api/rest-api-hooks/src/global-data/useGlobalStateRestApiData';
import NavAnsatt from 'app/navAnsattTsType';
import { RestApiGlobalStatePathsKeys } from 'api/k9LosApi';
import { getYearFromString } from 'utils/dateUtils';
import ModalMedIkon from 'sharedComponents/modal/ModalMedIkon';
import styles from './fagsakList.less';

const headerTextCodes = [
  'FagsakList.Saksnummer',
  'FagsakList.Navn',
  'FagsakList.Stonadstype',
  'FagsakList.Status',
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
  const [visOppgavePåVentModel, setVisOppgavePåVentModel] = useState(false);

  const { kanReservere } = useGlobalStateRestApiData<NavAnsatt>(RestApiGlobalStatePathsKeys.NAV_ANSATT);
  const oppgavePåVentMulighetBTekst = 'Tilbake';

  const onClick = (e, oppgave, selectCallback) => {
    if (!kanReservere) {
      selectCallback(oppgave, false);
    }
    if (oppgave.erTilSaksbehandling && !oppgave.status.erReservert && oppgave.system === 'K9SAK'
      && (typeof oppgave.paaVent === 'undefined' || (typeof oppgave.paaVent !== 'undefined' && !oppgave.paaVent))) {
      setVisReserverOppgaveModal(true);
    } else if (typeof oppgave.paaVent !== 'undefined' && oppgave.paaVent) {
      setVisOppgavePåVentModel(true);
    } else if (e.target.type !== 'reset' && e.target.innerHTML !== oppgavePåVentMulighetBTekst) {
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

  const fagsaksperiodeÅr = (oppgave) => (oppgave.fagsakPeriode ? `(${getYearFromString(oppgave.fagsakPeriode.fom)})` : '');

  return (
    <Table headerTextCodes={headerTextCodes} classNameTable={styles.table}>
      {fagsakOppgaver.map((oppgave, index) => (
        <TableRow
          key={`oppgave${oppgave.eksternId}`}
          id={oppgave.eksternId}
          onMouseDown={(e) => onClick(e, oppgave, selectOppgaveCallback)}
          onKeyDown={(e) => onClick(e, oppgave, selectOppgaveCallback)}
          isDashedBottomBorder={fagsakOppgaver.length > index + 1}
        >
          <TableColumn>{`${oppgave.saksnummer} ${fagsaksperiodeÅr(oppgave)}`}</TableColumn>
          <TableColumn>{oppgave.navn}</TableColumn>
          <TableColumn>{oppgave.fagsakYtelseType.navn}</TableColumn>
          <TableColumn>{oppgave.behandlingStatus.navn}</TableColumn>
          <TableColumn><NavFrontendChevron /></TableColumn>
          {visReserverOppgaveModal && kanReservere && !oppgave.status.erReservertAvInnloggetBruker && (
            <ModalMedIkon
              cancel={() => onCancel(oppgave, selectOppgaveCallback)}
              submit={() => onSubmit(oppgave, selectOppgaveCallback)}
              tekst={{
                valgmulighetA: 'Ja',
                valgmulighetB: 'Nei',
                formattedMessageId: 'ReserverOppgaveModal.ReserverOppgave',
              }}
              ikonUrl={advarselImageUrl}
              ikonAlt="Varseltrekant"
            />
          )}

          {visOppgavePåVentModel && (
            <ModalMedIkon
              cancel={() => { setVisOppgavePåVentModel(false); }}
              submit={() => onSubmit(oppgave, selectOppgaveCallback)}
              tekst={{
                valgmulighetA: 'Åpne',
                valgmulighetB: oppgavePåVentMulighetBTekst,
                formattedMessageId: 'OppgavePåVentModal.OppgavePåVent',
                values: { dato: oppgave.behandlingsfrist.substring(0, 10).replaceAll('-', '.') },
              }}
              ikonUrl={timeglassUrl}
              ikonAlt="Timeglass"
            />
          )}

        </TableRow>
      ))}
    </Table>
  );
};

export default FagsakList;
