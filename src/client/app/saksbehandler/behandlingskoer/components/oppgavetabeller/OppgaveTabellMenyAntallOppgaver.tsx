import React, {
  FunctionComponent,
} from 'react';
import { FormattedMessage } from 'react-intl';
import styles from './oppgaverTabellMenyAntallOppgaver.less';

interface OwnProps {
  antallOppgaver: number;
  tekstId: string;
}

const OppgaveTabellMenyAntallOppgaver: FunctionComponent<OwnProps> = ({
  antallOppgaver,
  tekstId,
}) => (
  <div className={styles.container}>
    <FormattedMessage id={tekstId} values={{ antall: antallOppgaver }} />
  </div>
);

export default OppgaveTabellMenyAntallOppgaver;
