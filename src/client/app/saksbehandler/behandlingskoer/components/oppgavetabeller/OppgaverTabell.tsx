import React, {
  FunctionComponent, ReactNode, useCallback, useEffect,
} from 'react';
import { FormattedMessage, injectIntl, WrappedComponentProps } from 'react-intl';
import { Normaltekst } from 'nav-frontend-typografi';

import Image from 'sharedComponents/Image';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import Oppgave from 'saksbehandler/oppgaveTsType';
import Table from 'sharedComponents/Table';
import TableRow from 'sharedComponents/TableRow';
import TableColumn from 'sharedComponents/TableColumn';
import DateLabel from 'sharedComponents/DateLabel';
import bubbletextUrl from 'images/bubbletext.svg';
import bubbletextFilledUrl from 'images/bubbletext_filled.svg';

import { K9LosApiKeys } from 'api/k9LosApi';
import NavFrontendSpinner from 'nav-frontend-spinner';

import useRestApiRunner from 'api/rest-api-hooks/src/local-data/useRestApiRunner';
import { Oppgaveko } from 'saksbehandler/behandlingskoer/oppgavekoTsType';
import {
  getHeaderCodes,
  hentIDFraSak,
} from 'saksbehandler/behandlingskoer/components/oppgavetabeller/oppgavetabellerfelles';
import { OppgaveStatus } from 'saksbehandler/oppgaveStatusTsType';
import { getDateAndTime } from 'utils/dateUtils';
import styles from './oppgaverTabell.less';

interface OwnProps {
  valgtOppgavekoId: string;
  oppgaverTilBehandling: Oppgave[];
  requestFinished: boolean;
  valgtKo: Oppgaveko;
}

/**
 * OppgaverTabell
 */
export const OppgaverTabell: FunctionComponent<OwnProps & WrappedComponentProps> = ({
  intl,
  valgtOppgavekoId,
  oppgaverTilBehandling,
  requestFinished,
  valgtKo,
}) => {
  const { startRequest: hentOppgaveKo } = useRestApiRunner<Oppgaveko[]>(K9LosApiKeys.OPPGAVEKO);

  useEffect(() => {
    hentOppgaveKo();
  }, [valgtOppgavekoId]);

  const createTooltip = useCallback((oppgaveStatus: OppgaveStatus): ReactNode | undefined => {
    const { flyttetReservasjon } = oppgaveStatus;
    if (!flyttetReservasjon) {
      return undefined;
    }
    const datoOgTid = getDateAndTime(flyttetReservasjon.tidspunkt);
    const textValues = {
      dato: datoOgTid.date,
      tid: datoOgTid.time,
      uid: flyttetReservasjon.uid,
      navn: flyttetReservasjon.navn,
      beskrivelse: flyttetReservasjon.begrunnelse,
      br: <br />,
    };
    return (
      <Normaltekst><FormattedMessage id="OppgaverTabell.OverfortReservasjonTooltip" values={textValues} /></Normaltekst>
    );
  }, []);

  return (
    <div>
      {oppgaverTilBehandling.length === 0 && !requestFinished && (
        <NavFrontendSpinner type="XL" className={styles.spinner} />
      )}
      {oppgaverTilBehandling.length === 0 && requestFinished && !valgtKo.skjermet && (
      <>
        <VerticalSpacer eightPx />
        <Normaltekst><FormattedMessage id="OppgaverTabell.IngenOppgaver" /></Normaltekst>
      </>
      )}

      {oppgaverTilBehandling.length === 0 && requestFinished && valgtKo.skjermet && (
        <>
          <VerticalSpacer eightPx />
          <Normaltekst><FormattedMessage id="OppgaverTabell.IngenTilgang" /></Normaltekst>
        </>
      )}

      {oppgaverTilBehandling.length > 0 && requestFinished && (
      <>
        <Table headerTextCodes={getHeaderCodes()}>
          {oppgaverTilBehandling.map((oppgave) => (
            <TableRow
              key={oppgave.eksternId}
              model={oppgave}
              className={styles.oppgavetabell_row}
            >
              <TableColumn>{oppgave.navn ? `${oppgave.navn} ${oppgave.personnummer}` : '<navn>'}</TableColumn>
              <TableColumn>{hentIDFraSak(oppgave)}</TableColumn>
              <TableColumn>{oppgave.behandlingstype.navn}</TableColumn>
              <TableColumn>{oppgave.opprettetTidspunkt && <DateLabel dateString={oppgave.opprettetTidspunkt} />}</TableColumn>
              <TableColumn>
                {oppgave.status.flyttetReservasjon && (
                <Image
                  src={bubbletextUrl}
                  srcHover={bubbletextFilledUrl}
                  alt={intl.formatMessage({ id: 'OppgaverTabell.OverfortReservasjon' })}
                  tooltip={createTooltip(oppgave.status)}
                />
                )}
              </TableColumn>
            </TableRow>
          ))}
        </Table>
      </>
      )}
    </div>
  );
};

export default injectIntl(OppgaverTabell);
