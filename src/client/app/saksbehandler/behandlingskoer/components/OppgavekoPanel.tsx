import React, { FunctionComponent } from 'react';
import { FormattedMessage } from 'react-intl';
import { Undertittel } from 'nav-frontend-typografi';
import { Oppgaveko } from 'saksbehandler/behandlingskoer/oppgavekoTsType';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import Oppgave from 'saksbehandler/oppgaveTsType';
import { getValueFromLocalStorage, setValueInLocalStorage, removeValueFromLocalStorage } from 'utils/localStorageHelper';
import { useRestApiRunner } from 'api/rest-api-hooks';
import { K9LosApiKeys } from 'api/k9LosApi';
import OppgavekoVelgerForm from './OppgavekoVelgerForm';
import OppgaverTabell from './OppgaverTabell';

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
  const { startRequest: fetchAntallOppgaver, data: antallOppgaver } = useRestApiRunner<number>(K9LosApiKeys.BEHANDLINGSKO_OPPGAVE_ANTALL);
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
        <OppgaverTabell
          reserverOppgave={reserverOppgave}
          valgtOppgavekoId={valgtOppgavekoId}
          antallOppgaver={antallOppgaver}
          oppgaverTilBehandling={oppgaverTilBehandling}
          requestFinished={requestFinished}
          reserverteOppgaver={reserverteOppgaver}
          hentReserverteOppgaver={hentReserverteOppgaver}
        />
      </div>
    </>
  );
};

export default OppgavekoPanel;
