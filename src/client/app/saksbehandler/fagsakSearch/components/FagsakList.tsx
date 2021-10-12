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
import { injectIntl, WrappedComponentProps } from 'react-intl';
import styles from './fagsakList.less';
import OppgaveSystem from '../../../types/OppgaveSystem';
import OppgaveStatusBeskjed from '../../../types/OppgaveStatusBeskjed';

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
  oppgaveSoktForViaQueryErAlleredeReservert: Oppgave | null;
}

/**
 * FagsakList
 *
 * Presentasjonskomponent. Formaterer fagsak-søkeresultatet for visning i tabell. Sortering av fagsakene blir håndtert her.
 */
const FagsakList: FunctionComponent<OwnProps & WrappedComponentProps> = ({
  intl,
  fagsakOppgaver,
  selectOppgaveCallback,
  oppgaveSoktForViaQueryErAlleredeReservert,
}) => {
  const [visReserverOppgaveModal, setVisReserverOppgaveModal] = useState(false);
  const [visOppgavePåVentModel, setVisOppgavePåVentModel] = useState(false);
  const [visModalForSaksbehandlerHarBesluttetOppgaven, setVisModalForSaksbehandlerHarBesluttetOppgaven] = useState<boolean>(false);
  const [valgtOppgave, setValgtOppgave] = useState<Oppgave>(null);
  const { kanReservere } = useGlobalStateRestApiData<NavAnsatt>(RestApiGlobalStatePathsKeys.NAV_ANSATT);
  const oppgavePåVentMulighetBTekst = 'Tilbake';

  const onClick = (e, oppgave, selectCallback) => {
    if (!kanReservere) {
      selectCallback(oppgave, false);
    }
    setValgtOppgave(oppgave);

    if (oppgave.status.beskjed && oppgave.status.beskjed === OppgaveStatusBeskjed.BESLUTTET_AV_DEG) {
      setVisModalForSaksbehandlerHarBesluttetOppgaven(true);
      setValgtOppgave(oppgave);
    } else if (oppgave.erTilSaksbehandling
      && !oppgave.status.erReservert
      && !oppgave.status.erReservertAvInnloggetBruker
      && (oppgave.system === OppgaveSystem.K9SAK || oppgave.system === OppgaveSystem.PUNSJ)) {
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

  const fagsaksperiodeÅr = (oppgave) => (oppgave.fagsakPeriode ? `(${getYearFromString(oppgave.fagsakPeriode.fom)})` : '');

  return (
    <>
      <Table headerTextCodes={headerTextCodes} classNameTable={styles.table}>
        {fagsakOppgaver.map((oppgave, index) => (
          <TableRow
            key={`oppgave${oppgave.eksternId}`}
            id={oppgave.eksternId}
            onMouseDown={(e) => onClick(e, oppgave, selectOppgaveCallback)}
            onKeyDown={(e) => onClick(e, oppgave, selectOppgaveCallback)}
            isDashedBottomBorder={fagsakOppgaver.length > index + 1}
          >
            <TableColumn>{oppgave.saksnummer ? (`${oppgave.saksnummer} ${fagsaksperiodeÅr(oppgave)}`) : `${oppgave.journalpostId}`}</TableColumn>
            <TableColumn>{oppgave.navn}</TableColumn>
            <TableColumn>{oppgave.fagsakYtelseType.navn}</TableColumn>
            <TableColumn>{oppgave.behandlingStatus.navn}</TableColumn>
            <TableColumn>
              {' '}
              <NavFrontendChevron />
              {' '}
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

      {visModalForSaksbehandlerHarBesluttetOppgaven && (
        <ModalMedIkon
          cancel={() => { setVisModalForSaksbehandlerHarBesluttetOppgaven(false); setValgtOppgave(null); }}
          tekst={{
            valgmulighetB: intl.formatMessage({ id: 'OppgaveErReservertAvAnnenModal.GåTilKøen' }),
            formattedMessageId: 'visModalForSaksbehandlerHarBesluttetOppgaven.Informasjon',
          }}
          ikonUrl={advarselImageUrl}
          ikonAlt="advarselTriangel"
        />
      )}

    </>
  );
};

export default injectIntl(FagsakList);
