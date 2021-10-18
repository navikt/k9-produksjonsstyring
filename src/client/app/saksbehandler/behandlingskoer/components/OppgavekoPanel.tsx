import React, { FunctionComponent, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { Element, Undertittel } from 'nav-frontend-typografi';
import { Oppgaveko } from 'saksbehandler/behandlingskoer/oppgavekoTsType';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import Oppgave from 'saksbehandler/oppgaveTsType';
import { getValueFromLocalStorage, removeValueFromLocalStorage, setValueInLocalStorage } from 'utils/localStorageHelper';
import { useRestApiRunner } from 'api/rest-api-hooks';
import { K9LosApiKeys } from 'api/k9LosApi';
import ReserverteOppgaverTabell
  from 'saksbehandler/behandlingskoer/components/oppgavetabeller/ReserverteOppgaverTabell';
import NavFrontendChevron from 'nav-frontend-chevron';
import OppgaveTabellMenyAntallOppgaver
  from 'saksbehandler/behandlingskoer/components/oppgavetabeller/OppgaveTabellMenyAntallOppgaver';
import OppgavekoVelgerForm from './OppgavekoVelgerForm';
import OppgaverTabell from './oppgavetabeller/OppgaverTabell';

import styles from './oppgavekoPanel.less';

interface OwnProps {
  setValgtOppgavekoId: (id: string) => void;
  valgtOppgavekoId: string;
  oppgavekoer: Oppgaveko[];
  reserverOppgave: (oppgave: Oppgave) => void;
  reserverteOppgaver: Oppgave[];
  oppgaverTilBehandling: Oppgave[];
  hentReserverteOppgaver: () => void;
  requestFinished: boolean;
}

/**
 * OppgavekoPanel
 */
const OppgavekoPanel: FunctionComponent<OwnProps> = ({
  reserverOppgave,
  oppgavekoer,
  setValgtOppgavekoId,
  valgtOppgavekoId,
  hentReserverteOppgaver,
  reserverteOppgaver,
  requestFinished,
  oppgaverTilBehandling,
}) => {
  const [visBehandlingerIKo, setVisBehandlingerIKo] = useState<boolean>(false);
  const [visReservasjoneriKo, setVisReservasjonerIKO] = useState<boolean>(false);
  const { startRequest: fetchAntallOppgaver, data: antallOppgaver } = useRestApiRunner<number>(K9LosApiKeys.BEHANDLINGSKO_OPPGAVE_ANTALL);

  const valgtKo = oppgavekoer.find((ko) => ko.id === valgtOppgavekoId);

  return (
    <>
      <Undertittel><FormattedMessage id="OppgavekoPanel.StartBehandling" /></Undertittel>
      <div className={styles.container}>
        <OppgavekoVelgerForm
          oppgavekoer={oppgavekoer}
          setValgtOppgavekoId={setValgtOppgavekoId}
          fetchAntallOppgaver={fetchAntallOppgaver}
          getValueFromLocalStorage={getValueFromLocalStorage}
          setValueInLocalStorage={setValueInLocalStorage}
          removeValueFromLocalStorage={removeValueFromLocalStorage}
        />
        <VerticalSpacer twentyPx />

        <div className={styles.behandlingskoerContainer}>
          <button type="button" className={styles.behandlingskoerKnapp} onClick={() => setVisReservasjonerIKO(!visReservasjoneriKo)}>
            <NavFrontendChevron type={visReservasjoneriKo ? 'ned' : 'høyre'} />
            <Element><FormattedMessage id="OppgaverTabell.ReserverteOppgaver" /></Element>
            <OppgaveTabellMenyAntallOppgaver antallOppgaver={reserverteOppgaver.length} tekstId="OppgaverTabell.ReserverteOppgaverAntall" />
          </button>
          {visReservasjoneriKo
          && (
            <ReserverteOppgaverTabell
              reserverOppgave={reserverOppgave}
              requestFinished={requestFinished}
              reserverteOppgaver={reserverteOppgaver}
              hentReserverteOppgaver={hentReserverteOppgaver}
            />
          )}
        </div>
        <VerticalSpacer eightPx />
        {visReservasjoneriKo && <VerticalSpacer sixteenPx />}
        <div className={styles.behandlingskoerContainer}>
          <button type="button" className={styles.behandlingskoerKnapp} onClick={() => setVisBehandlingerIKo(!visBehandlingerIKo)}>
            <NavFrontendChevron type={visBehandlingerIKo ? 'ned' : 'høyre'} />
            <Element><FormattedMessage id="OppgaverTabell.DineNesteSaker" /></Element>
            <OppgaveTabellMenyAntallOppgaver antallOppgaver={antallOppgaver} tekstId="OppgaverTabell.DineNesteSakerAntall" />
          </button>
          {visBehandlingerIKo
          && (
            <OppgaverTabell
              valgtKo={valgtKo}
              reserverOppgave={reserverOppgave}
              valgtOppgavekoId={valgtOppgavekoId}
              oppgaverTilBehandling={oppgaverTilBehandling}
              requestFinished={requestFinished}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default OppgavekoPanel;
