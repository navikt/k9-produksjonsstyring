import React, { FunctionComponent } from 'react';
import { FormattedMessage } from 'react-intl';
import classnames from 'classnames';
import { WarningColored } from '@navikt/ds-icons';
import styles from './oppgaverTabellMenyAntallOppgaver.css';

interface OwnProps {
    antallOppgaver: number;
    tekstId: string;
    hastesak?: boolean;
}

const OppgaveTabellMenyAntallOppgaver: FunctionComponent<OwnProps> = ({ antallOppgaver, tekstId, hastesak }) => (
    <div className={classnames(styles.container, { [styles.hastesak]: hastesak && !!antallOppgaver })}>
        {hastesak && !!antallOppgaver && <WarningColored className={styles.hastesakIkon} />}
        <FormattedMessage id={tekstId} values={{ antall: antallOppgaver }} />
    </div>
);

export default OppgaveTabellMenyAntallOppgaver;
