
import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Undertittel } from 'nav-frontend-typografi';

import oppgavekoPropType from 'saksbehandler/behandlingskoer/oppgavekoPropType';
import { Oppgaveko } from 'saksbehandler/behandlingskoer/oppgavekoTsType';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import OppgavekoVelgerForm from './OppgavekoVelgerForm';
import OppgaverTabell from './OppgaverTabell';

import styles from './oppgavekoPanel.less';

type TsProps = Readonly<{
  oppgavekoer: Oppgaveko[];
  fetchOppgavekoOppgaver: (oppgavekoId: string) => void;
  reserverOppgave: (oppgaveId: string) => void;
  opphevOppgaveReservasjon: (oppgaveId: string, begrunnelse: string) => Promise<string>;
  forlengOppgaveReservasjon: (oppgaveId: string) => Promise<string>;
  flyttReservasjon: (oppgaveId: string, brukerident: string, begrunnelse: string) => Promise<string>;
}>

/**
 * OppgavekoPanel
 */
const OppgavekoPanel = ({
  reserverOppgave,
  opphevOppgaveReservasjon,
  forlengOppgaveReservasjon,
  oppgavekoer,
  fetchOppgavekoOppgaver,
  flyttReservasjon,
}: TsProps) => (
  <>
    <Undertittel><FormattedMessage id="OppgavekoPanel.StartBehandling" /></Undertittel>
    <div className={styles.container}>
      <OppgavekoVelgerForm
        oppgavekoer={oppgavekoer}
        fetchOppgavekoOppgaver={fetchOppgavekoOppgaver}
      />
      <VerticalSpacer twentyPx />
      <OppgaverTabell
        reserverOppgave={reserverOppgave}
        opphevOppgaveReservasjon={opphevOppgaveReservasjon}
        forlengOppgaveReservasjon={forlengOppgaveReservasjon}
        flyttReservasjon={flyttReservasjon}
      />
    </div>
  </>
);

OppgavekoPanel.propTypes = {
  oppgavekoer: PropTypes.arrayOf(oppgavekoPropType),
  fetchOppgavekoOppgaver: PropTypes.func.isRequired,
  reserverOppgave: PropTypes.func.isRequired,
  opphevOppgaveReservasjon: PropTypes.func.isRequired,
  forlengOppgaveReservasjon: PropTypes.func.isRequired,
  flyttReservasjon: PropTypes.func.isRequired,
};

export default OppgavekoPanel;
