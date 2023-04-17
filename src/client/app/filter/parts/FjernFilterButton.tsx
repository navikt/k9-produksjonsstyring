import React from 'react';
import { Delete } from '@navikt/ds-icons';
import { Button } from '@navikt/ds-react';
import { FeltverdiOppgavefilter } from 'filter/filterTsTypes';
import styles from './FjernFilterButton.css';

interface OwnProps {
	oppgavefilter: FeltverdiOppgavefilter;
	onFjernFilter: (oppgavefilter: FeltverdiOppgavefilter) => void;
}

const FjernFilterButton = ({ oppgavefilter, onFjernFilter }: OwnProps) => (
	<Button
		className={styles.filterFjern}
		icon={<Delete aria-hidden />}
		size="small"
		variant="tertiary"
		onClick={() => onFjernFilter(oppgavefilter)}
	/>
);

export default FjernFilterButton;
