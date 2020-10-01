import React, { FunctionComponent, useCallback, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import {
  Normaltekst,
} from 'nav-frontend-typografi';
import { Kodeverk } from 'kodeverk/kodeverkTsType';
import kodeverkTyper from 'kodeverk/kodeverkTyper';
import Image from 'sharedComponents/Image';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import Table from 'sharedComponents/Table';
import TableRow from 'sharedComponents/TableRow';
import TableColumn from 'sharedComponents/TableColumn';
import DateLabel from 'sharedComponents/DateLabel';
import Chevron from 'nav-frontend-chevron';
import { Knapp } from 'nav-frontend-knapper';
import UtvalgskriterierForOppgavekoForm
  from 'avdelingsleder/behandlingskoer/components/oppgavekoForm/UtvalgskriterierForOppgavekoForm';
import NavFrontendSpinner from 'nav-frontend-spinner';
import { Saksbehandler } from 'avdelingsleder/bemanning/saksbehandlerTsType';
import useRestApiRunner from 'api/rest-api-hooks/local-data/useRestApiRunner';
import { K9LosApiKeys } from 'api/k9LosApi';
import useKodeverk from 'api/rest-api-hooks/global-data/useKodeverk';
import SletteOppgavekoModal from './SletteOppgavekoModal';
import { Oppgaveko } from '../oppgavekoTsType';

import styles from './gjeldendeOppgavekoerTabell.less';
import addCircle from '../../../../images/add-circle-bla.svg';

const headerTextCodes = [
  'GjeldendeOppgavekoerTabell.Listenavn',
  'GjeldendeOppgavekoerTabell.Stonadstype',
  'GjeldendeOppgavekoerTabell.AntallSaksbehandlere',
  'GjeldendeOppgavekoerTabell.AntallBehandlinger',
  'GjeldendeOppgavekoerTabell.SistEndret',
  'EMPTY_1',
];

interface OwnProps {
  oppgavekoer: Oppgaveko[];
  setValgtOppgavekoId: (id: string) => void;
  lagNyOppgaveko: () => void;
  resetValgtOppgavekoId: () => void;
  valgtOppgavekoId?: string;
  oppgaverTotalt?: number;
  requestFinished: boolean;
  hentAlleOppgavekoer:() => void;
}

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * GjeldendeOppgavekoerTabell
 */
export const GjeldendeOppgavekoerTabell: FunctionComponent<OwnProps> = ({
  oppgavekoer,
  valgtOppgavekoId,
  setValgtOppgavekoId,
  lagNyOppgaveko,
  oppgaverTotalt,
  requestFinished,
  hentAlleOppgavekoer,
  resetValgtOppgavekoId,
}) => {
  const [visSlettModal, setVisSlettModal] = useState(false);
  const { startRequest: fjernOppgaveko } = useRestApiRunner(K9LosApiKeys.SLETT_OPPGAVEKO);
  const { startRequest: hentOppgaveko } = useRestApiRunner(K9LosApiKeys.HENT_OPPGAVEKO);

  const fagsakYtelseTyper = useKodeverk(kodeverkTyper.FAGSAK_YTELSE_TYPE);

  const setValgtOppgaveko = async (event: Event, id: string) => {
    // Må vente 100 ms før en byttar behandlingskø i tabell. Dette fordi lagring av navn skjer som blur-event. Så i tilfellet
    // der en endrer navn og så trykker direkte på en annen behandlingskø vil ikke lagringen skje før etter at ny kø er valgt.
    await wait(100);

    if (valgtOppgavekoId !== id) {
      setValgtOppgavekoId(id);
      hentOppgaveko({ id });
    } else {
      setValgtOppgavekoId(undefined);
    }
  };

  const closeSletteModal = () => {
    setVisSlettModal(true);
  };

  const fjernOppgavekoFn = useCallback((oppgaveko: Oppgaveko): void => {
    closeSletteModal();
    fjernOppgaveko({ id: oppgaveko.id })
      .then(() => {
        resetValgtOppgavekoId();
        hentAlleOppgavekoer();
      });
  }, []);

  const lagNyOppgavekoOnKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.keyCode === 13) {
      lagNyOppgaveko();
    }
  };

  const lagNyOppgavekoOnClick = () => {
    lagNyOppgaveko();
  };

  const visFjernOppgavekoModal = () => {
    setVisSlettModal(true);
  };

  const formatStonadstyper = (valgteFagsakYtelseTyper?: Kodeverk[]) => {
    if (!valgteFagsakYtelseTyper || valgteFagsakYtelseTyper.length === 0) {
      return <FormattedMessage id="GjeldendeOppgavekoerTabell.Alle" />;
    }
    return valgteFagsakYtelseTyper.map((fyt) => {
      const type = fagsakYtelseTyper.find((def) => def.kode === fyt.kode);
      return type ? type.navn : '';
    }).join(', ');
  };

  return (
    <>
      {requestFinished && (
        <Knapp
          mini
          className={styles.addKnapp}
          tabIndex={0}
          onClick={lagNyOppgavekoOnClick}
          onKeyDown={(e) => lagNyOppgavekoOnKeyDown(e)}
        >
          <Image src={addCircle} className={styles.addIcon} />
          <FormattedMessage id="GjeldendeOppgavekoerTabell.LeggTilListe" />
        </Knapp>
      )}
      {oppgavekoer.length === 0 && !requestFinished && (
        <NavFrontendSpinner type="XL" className={styles.spinner} />
      )}
      {oppgavekoer.length === 0 && requestFinished && (
      <>
        <VerticalSpacer eightPx />
        <Normaltekst><FormattedMessage id="GjeldendeOppgavekoerTabell.IngenLister" /></Normaltekst>
        <VerticalSpacer eightPx />
      </>
      )}
      {oppgavekoer.length > 0 && (
        <Table headerTextCodes={headerTextCodes}>
          {oppgavekoer.map((oppgaveko) => (
            <>
              <TableRow
                key={oppgaveko.id}
                className={oppgaveko.id === valgtOppgavekoId ? styles.isSelected : styles.notSelected}
                id={oppgaveko.id}
                onMouseDown={setValgtOppgaveko}
                onKeyDown={setValgtOppgaveko}
              >
                <TableColumn>{oppgaveko.navn}</TableColumn>
                <TableColumn>{formatStonadstyper(oppgaveko.fagsakYtelseTyper)}</TableColumn>
                <TableColumn>{oppgaveko.saksbehandlere.length > 0 ? oppgaveko.saksbehandlere.length : ''}</TableColumn>
                <TableColumn>{oppgaveko.antallBehandlinger}</TableColumn>
                <TableColumn>
                  <DateLabel dateString={oppgaveko.sistEndret} />
                </TableColumn>
                <TableColumn>
                  <Chevron key={oppgaveko.id} type={(valgtOppgavekoId && valgtOppgavekoId === oppgaveko.id) ? 'opp' : 'ned'} className={styles.chevron} />
                </TableColumn>
              </TableRow>

              {valgtOppgavekoId === oppgaveko.id && (
                <UtvalgskriterierForOppgavekoForm
                  valgtOppgaveko={oppgaveko}
                  hentAlleOppgavekoer={hentAlleOppgavekoer}
                  visModal={visFjernOppgavekoModal}
                />
              )}

              {valgtOppgavekoId === oppgaveko.id && visSlettModal && (
              <SletteOppgavekoModal
                valgtOppgaveko={oppgaveko}
                cancel={closeSletteModal}
                submit={fjernOppgavekoFn}
              />
              )}
            </>
          ))}
        </Table>
      )}

    </>
  );
};

export default GjeldendeOppgavekoerTabell;
