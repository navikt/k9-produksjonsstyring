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
import useRestApiRunner from 'api/rest-api-hooks/src/local-data/useRestApiRunner';
import { K9LosApiKeys } from 'api/k9LosApi';
import useKodeverk from 'api/rest-api-hooks/src/global-data/useKodeverk';
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
  requestFinished,
  hentAlleOppgavekoer,
  resetValgtOppgavekoId,
}) => {
  const [visSlettModal, setVisSlettModal] = useState(false);
  const [valgtKo, setValgtKo] = useState(undefined);
  const { startRequest: fjernOppgaveko } = useRestApiRunner(K9LosApiKeys.SLETT_OPPGAVEKO);
  const { startRequest: hentOppgaveko } = useRestApiRunner<Oppgaveko>(K9LosApiKeys.HENT_OPPGAVEKO);

  const { data: nyOppgavekoObject, startRequest: lagNyOppgaveko } = useRestApiRunner<{id: string}>(K9LosApiKeys.OPPRETT_NY_OPPGAVEKO);

  const hentOppgaveKoFn = (id: string) => {
    hentOppgaveko({ id }).then((ko) => setValgtKo(ko));
  };

  const lagNyOppgavekoFn = useCallback(() => {
    lagNyOppgaveko().then((data) => {
      setValgtOppgavekoId(data.id);
      hentAlleOppgavekoer();
      hentOppgaveKoFn(data.id);
    });
  }, []);

  const fagsakYtelseTyper = useKodeverk(kodeverkTyper.FAGSAK_YTELSE_TYPE);

  const setValgtOppgaveko = async (event: Event, id: string) => {
    // Må vente 100 ms før en byttar behandlingskø i tabell. Dette fordi lagring av navn skjer som blur-event. Så i tilfellet
    // der en endrer navn og så trykker direkte på en annen behandlingskø vil ikke lagringen skje før etter at ny kø er valgt.
    await wait(100);

    if (valgtOppgavekoId !== id) {
      setValgtOppgavekoId(id);
      hentOppgaveKoFn(id);
    } else {
      setValgtOppgavekoId(undefined);
    }
  };

  const closeSletteModal = () => {
    setVisSlettModal(false);
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
      lagNyOppgavekoFn();
    }
  };

  const lagNyOppgavekoOnClick = () => {
    lagNyOppgavekoFn();
  };

  const visFjernOppgavekoModal = () => {
    setVisSlettModal(true);
  };

  const antallFagytelseTyper = 6;
  const formatStonadstyper = (valgteFagsakYtelseTyper?: Kodeverk[]) => {
    if (!valgteFagsakYtelseTyper || valgteFagsakYtelseTyper.length === 0) {
      return <FormattedMessage id="GjeldendeOppgavekoerTabell.Ingen" />;
    }

    if (valgteFagsakYtelseTyper.length >= antallFagytelseTyper) {
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
                <TableColumn>{oppgaveko.saksbehandlere.length > 0 ? oppgaveko.saksbehandlere.length : ''}</TableColumn>
                <TableColumn>{oppgaveko.antallBehandlinger}</TableColumn>
                <TableColumn>
                  <DateLabel dateString={oppgaveko.sistEndret} />
                </TableColumn>
                <TableColumn>
                  <Chevron key={oppgaveko.id} type={(valgtOppgavekoId && valgtOppgavekoId === oppgaveko.id) ? 'opp' : 'ned'} className={styles.chevron} />
                </TableColumn>
              </TableRow>

              {valgtKo && valgtOppgavekoId === oppgaveko.id && (
                <UtvalgskriterierForOppgavekoForm
                  valgtOppgaveko={valgtKo}
                  hentKo={hentOppgaveKoFn}
                  hentAlleOppgavekoer={hentAlleOppgavekoer}
                  visModal={visFjernOppgavekoModal}
                />
              )}

              {visSlettModal && (
              <SletteOppgavekoModal
                valgtOppgaveko={valgtKo}
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
