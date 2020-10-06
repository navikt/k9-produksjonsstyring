import React, { FunctionComponent, useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { Undertittel } from 'nav-frontend-typografi';
import { Oppgaveko } from 'saksbehandler/behandlingskoer/oppgavekoTsType';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import Oppgave from 'saksbehandler/oppgaveTsType';
import { getValueFromLocalStorage, setValueInLocalStorage, removeValueFromLocalStorage } from 'utils/localStorageHelper';
import OppgavekoVelgerForm from './OppgavekoVelgerForm';
import OppgaverTabell from './OppgaverTabell';

import styles from './oppgavekoPanel.less';

interface OwnProps {
  setValgtOppgavekoId: (id: string) => void;
  valgtOppgavekoId: string;
  oppgavekoer: Oppgaveko[];
  reserverOppgave: (oppgave: Oppgave) => void;
}

/**
 * OppgavekoPanel
 */
const OppgavekoPanel: FunctionComponent<OwnProps> = ({
  reserverOppgave,
  oppgavekoer,
  setValgtOppgavekoId,
  valgtOppgavekoId,
}) => (
  <>
    <Undertittel><FormattedMessage id="OppgavekoPanel.StartBehandling" /></Undertittel>
    <div className={styles.container}>
      <OppgavekoVelgerForm
        oppgavekoer={oppgavekoer}
        setValgtOppgavekoId={setValgtOppgavekoId}
        getValueFromLocalStorage={getValueFromLocalStorage}
        setValueInLocalStorage={setValueInLocalStorage}
        removeValueFromLocalStorage={removeValueFromLocalStorage}
      />
      <VerticalSpacer twentyPx />
      <OppgaverTabell
        reserverOppgave={reserverOppgave}
        valgtOppgavekoId={valgtOppgavekoId}
      />
    </div>
  </>
);

export default OppgavekoPanel;
