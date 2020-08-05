
import React, { FunctionComponent } from 'react';
import { FormattedMessage } from 'react-intl';
import { Undertittel } from 'nav-frontend-typografi';
import { Oppgaveko } from 'saksbehandler/behandlingskoer/oppgavekoTsType';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import Oppgave from 'saksbehandler/oppgaveTsType';
import OppgavekoVelgerForm from './OppgavekoVelgerForm';
import OppgaverTabell from './OppgaverTabell';

import styles from './oppgavekoPanel.less';

interface OwnProps {
  valgtKoSkjermet: boolean;
  oppgavekoer: Oppgaveko[];
  fetchOppgavekoOppgaver: (id: string) => void;
  reserverOppgave: (oppgave: Oppgave) => void;
  opphevOppgaveReservasjon: (oppgaveId: string, begrunnelse: string) => Promise<string>;
  forlengOppgaveReservasjon: (oppgaveId: string) => Promise<string>;
  endreOppgaveReservasjon: (oppgaveId: string, reserverTil: string) => Promise<string>;
  flyttReservasjon: (oppgaveId: string, brukerident: string, begrunnelse: string) => Promise<string>;
}

/**
 * OppgavekoPanel
 */
const OppgavekoPanel: FunctionComponent<OwnProps> = ({
  reserverOppgave,
  opphevOppgaveReservasjon,
  forlengOppgaveReservasjon,
  oppgavekoer,
  fetchOppgavekoOppgaver,
  flyttReservasjon,
  endreOppgaveReservasjon,
  valgtKoSkjermet,
}) => (
  <>
    <Undertittel><FormattedMessage id="OppgavekoPanel.StartBehandling" /></Undertittel>
    <div className={styles.container}>
      <OppgavekoVelgerForm
        oppgavekoer={oppgavekoer}
        fetchOppgavekoOppgaver={fetchOppgavekoOppgaver}
      />
      <VerticalSpacer twentyPx />
      <OppgaverTabell
        valgtKoSkjermet={valgtKoSkjermet}
        reserverOppgave={reserverOppgave}
        opphevOppgaveReservasjon={opphevOppgaveReservasjon}
        forlengOppgaveReservasjon={forlengOppgaveReservasjon}
        flyttReservasjon={flyttReservasjon}
        endreOppgaveReservasjon={endreOppgaveReservasjon}
      />
    </div>
  </>
);

export default OppgavekoPanel;
