import React from 'react';
import { Delete } from '@navikt/ds-icons';
import { Button } from '@navikt/ds-react';
import { CombineOppgavefilter, FeltverdiOppgavefilter } from 'filter/filterTsTypes';
import styles from './FjernFilterButton.css';

interface OwnProps {
	oppgavefilter: FeltverdiOppgavefilter | CombineOppgavefilter;
	onFjernFilter: (oppgavefilter: FeltverdiOppgavefilter | CombineOppgavefilter) => void;
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
