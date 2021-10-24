import React, { FunctionComponent, useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { Element, Undertittel } from 'nav-frontend-typografi';
import { Oppgaveko } from 'saksbehandler/behandlingskoer/oppgavekoTsType';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import Oppgave from 'saksbehandler/oppgaveTsType';
import { getValueFromLocalStorage, removeValueFromLocalStorage, setValueInLocalStorage } from 'utils/localStorageHelper';
import { useRestApiRunner } from 'api/rest-api-hooks';
import { K9LosApiKeys, RestApiGlobalStatePathsKeys } from 'api/k9LosApi';
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
  apneOppgave: (oppgave: Oppgave) => void;
  reserverteOppgaver: Oppgave[];
  oppgaverTilBehandling: Oppgave[];
  hentReserverteOppgaver: () => void;
  requestFinished: boolean;
}

/**
 * OppgavekoPanel
 */
const OppgavekoPanel: FunctionComponent<OwnProps> = ({
  apneOppgave,
  oppgavekoer,
  setValgtOppgavekoId,
  valgtOppgavekoId,
  hentReserverteOppgaver,
  reserverteOppgaver,
  requestFinished,
  oppgaverTilBehandling,
}) => {
  const [visBehandlingerIKo, setVisBehandlingerIKo] = useState<boolean>(true);
  const [visReservasjoneriKo, setVisReservasjonerIKO] = useState<boolean>(false);
  const { startRequest: fåOppgaveFraKo } = useRestApiRunner<Oppgave>(K9LosApiKeys.FÅ_OPPGAVE_FRA_KO);

  const valgtKo = oppgavekoer.find((ko) => ko.id === valgtOppgavekoId);

  const plukkNyOppgave = () => {
    fåOppgaveFraKo({ oppgaveKøId: valgtOppgavekoId }).then((reservertOppgave) => {
      apneOppgave(reservertOppgave);
    });
  };

  return (
    <>
      <div className={styles.container}>
        <Undertittel><FormattedMessage id="OppgavekoPanel.StartBehandling" /></Undertittel>
        <VerticalSpacer sixteenPx />
        <OppgavekoVelgerForm
          oppgavekoer={oppgavekoer}
          setValgtOppgavekoId={setValgtOppgavekoId}
          getValueFromLocalStorage={getValueFromLocalStorage}
          setValueInLocalStorage={setValueInLocalStorage}
          removeValueFromLocalStorage={removeValueFromLocalStorage}
          plukkNyOppgave={plukkNyOppgave}

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
              apneOppgave={apneOppgave}
              requestFinished={requestFinished}
              reserverteOppgaver={reserverteOppgaver}
              hentReserverteOppgaver={hentReserverteOppgaver}
            />
          )}
        </div>
        <VerticalSpacer eightPx />

        {visReservasjoneriKo && <VerticalSpacer thirtyTwoPx />}
        <div className={styles.behandlingskoerContainer}>
          <button type="button" className={styles.behandlingskoerKnapp} onClick={() => setVisBehandlingerIKo(!visBehandlingerIKo)}>
            <NavFrontendChevron type={visBehandlingerIKo ? 'ned' : 'høyre'} />
            <Element><FormattedMessage id="OppgaverTabell.DineNesteSaker" /></Element>
          </button>

          {visBehandlingerIKo
          && (
            <OppgaverTabell
              valgtKo={valgtKo}
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
