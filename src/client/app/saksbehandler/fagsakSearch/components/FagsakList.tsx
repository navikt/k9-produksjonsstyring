import React, { FunctionComponent, useEffect, useState } from 'react';
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
import OppgaveSystem from '../../../types/OppgaveSystem';
import { getKodeverknavnFraKode } from 'utils/kodeverkUtils';
import AlleKodeverk from 'kodeverk/alleKodeverkTsType';
import kodeverkTyper from 'kodeverk/kodeverkTyper';
import { WarningColored } from '@navikt/ds-icons';
import styles from './fagsakList.css';
import KommentarMedMerknad from 'saksbehandler/components/KommentarMedMerknad';

const headerTextCodes = [
  'EMPTY_1',
  'FagsakList.Saksnummer',
  'FagsakList.Navn',
  'FagsakList.Stonadstype',
  'FagsakList.Status',
  'EMPTY_2',
  'EMPTY_3',
];

interface OwnProps {
  fagsakOppgaver: Oppgave[];
  selectOppgaveCallback: (oppgave: Oppgave, skalReservere: boolean) => void;
  oppgaveSoktForViaQueryErAlleredeReservert: Oppgave | null;
}

/**
 * FagsakList
 *
 * Presentasjonskomponent. Formaterer fagsak-søkeresultatet for visning i tabell. Sortering av fagsakene blir håndtert her.
 */
const FagsakList: FunctionComponent<OwnProps> = ({
  fagsakOppgaver,
  selectOppgaveCallback,
  oppgaveSoktForViaQueryErAlleredeReservert,
}) => {
  const [visReserverOppgaveModal, setVisReserverOppgaveModal] = useState(false);
  const [visOppgavePåVentModel, setVisOppgavePåVentModel] = useState(false);
  const [valgtOppgave, setValgtOppgave] = useState<Oppgave>(null);

  const { kanReservere } = useGlobalStateRestApiData<NavAnsatt>(RestApiGlobalStatePathsKeys.NAV_ANSATT);
  const alleKodeverk: AlleKodeverk = useGlobalStateRestApiData(RestApiGlobalStatePathsKeys.KODEVERK);

  const oppgavePåVentMulighetBTekst = 'Tilbake';

  const onClick = (e, oppgave, selectCallback) => {
    if (!kanReservere) {
      selectCallback(oppgave, false);
    }
    setValgtOppgave(oppgave);

    if (
      oppgave.erTilSaksbehandling &&
      !oppgave.status.erReservert &&
      !oppgave.status.erReservertAvInnloggetBruker &&
      (oppgave.system === OppgaveSystem.K9SAK ||
        oppgave.system === OppgaveSystem.PUNSJ ||
        oppgave.system === OppgaveSystem.K9TILBAKE)
    ) {
      setVisReserverOppgaveModal(true);
    } else if (typeof oppgave.paaVent !== 'undefined' && oppgave.paaVent) {
      setVisOppgavePåVentModel(true);
    } else {
      selectCallback(oppgave, false);
    }
  };

  useEffect(() => {
    if (oppgaveSoktForViaQueryErAlleredeReservert) {
      onClick(null, oppgaveSoktForViaQueryErAlleredeReservert, selectOppgaveCallback);
    }
  }, [oppgaveSoktForViaQueryErAlleredeReservert]);

  const onSubmit = () => {
    setVisReserverOppgaveModal(false);
    selectOppgaveCallback(valgtOppgave, true);
  };

  const onCancel = () => {
    selectOppgaveCallback(valgtOppgave, false);
  };

  const fagsaksperiodeÅr = oppgave =>
    oppgave.fagsakPeriode ? `(${getYearFromString(oppgave.fagsakPeriode.fom)})` : '';

  return (
    <>
      <Table headerTextCodes={headerTextCodes} classNameTable={styles.table}>
        {fagsakOppgaver.map((oppgave, index) => (
          <TableRow
            key={`oppgave${oppgave.eksternId}`}
            id={oppgave.eksternId}
            onMouseDown={e => onClick(e, oppgave, selectOppgaveCallback)}
            onKeyDown={e => onClick(e, oppgave, selectOppgaveCallback)}
            isDashedBottomBorder={fagsakOppgaver.length > index + 1}
            className={!!oppgave.merknad && styles.hastesakRad}
          >
            <TableColumn>{!!oppgave.merknad && <WarningColored className={styles.hastesakIkon} />}</TableColumn>

            <TableColumn>
              {oppgave.saksnummer ? `${oppgave.saksnummer} ${fagsaksperiodeÅr(oppgave)}` : `${oppgave.journalpostId}`}
            </TableColumn>
            <TableColumn>{oppgave.navn}</TableColumn>
            <TableColumn>
              {getKodeverknavnFraKode(oppgave.fagsakYtelseType, kodeverkTyper.FAGSAK_YTELSE_TYPE, alleKodeverk)}
            </TableColumn>
            <TableColumn>
              {getKodeverknavnFraKode(oppgave.behandlingStatus, kodeverkTyper.BEHANDLING_STATUS, alleKodeverk)}
            </TableColumn>
            <TableColumn>
              <KommentarMedMerknad oppgave={oppgave} />
            </TableColumn>
            <TableColumn>
              <NavFrontendChevron />
            </TableColumn>
          </TableRow>
        ))}
      </Table>

      {visReserverOppgaveModal && kanReservere && (
        <ModalMedIkon
          cancel={() => onCancel()}
          submit={() => onSubmit()}
          tekst={{
            valgmulighetA: 'Ja',
            valgmulighetB: 'Nei',
            formattedMessageId: 'ReserverOppgaveModal.ReserverOppgave',
          }}
          ikonUrl={advarselImageUrl}
          ikonAlt="Varseltrekant"
        />
      )}

      {visOppgavePåVentModel && !visReserverOppgaveModal && (
        <ModalMedIkon
          cancel={() => {
            setVisOppgavePåVentModel(false);
          }}
          submit={() => onCancel()}
          tekst={{
            valgmulighetA: 'Åpne',
            valgmulighetB: oppgavePåVentMulighetBTekst,
            formattedMessageId: 'OppgavePåVentModal.OppgavePåVent',
            values: { dato: valgtOppgave.behandlingsfrist.substring(0, 10).replaceAll('-', '.') },
          }}
          ikonUrl={timeglassUrl}
          ikonAlt="Timeglass"
        />
      )}
    </>
  );
};

export default FagsakList;
