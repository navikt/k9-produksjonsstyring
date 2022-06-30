import { WarningColored } from '@navikt/ds-icons';
import classnames from 'classnames';
import React, { FunctionComponent } from 'react';
import { FormattedMessage } from 'react-intl';
import styles from './oppgaverTabellMenyAntallOppgaver.less';

interface OwnProps {
  antallOppgaver: number;
  tekstId: string;
  hastesak?: boolean;
}

const OppgaveTabellMenyAntallOppgaver: FunctionComponent<OwnProps> = ({ antallOppgaver, tekstId, hastesak }) => (
  <div className={classnames(styles.container, { [styles.hastesak]: hastesak && !!antallOppgaver })}>
    <>
      {hastesak && !!antallOppgaver && <WarningColored className={styles.hastesakIkon} />}
      <FormattedMessage id={tekstId} values={{ antall: antallOppgaver }} />
    </>
  </div>
);

export default OppgaveTabellMenyAntallOppgaver;
