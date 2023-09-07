import React from 'react';
import { Delete } from '@navikt/ds-icons';
import { Button } from '@navikt/ds-react';
import { CombineOppgavefilter, FeltverdiOppgavefilter } from 'filter/filterTsTypes';

interface OwnProps {
	oppgavefilter: FeltverdiOppgavefilter | CombineOppgavefilter;
	onFjernFilter: (id: string) => void;
}

const FjernFilterButton = ({ oppgavefilter, onFjernFilter }: OwnProps) => (
	<Button
		icon={<Delete aria-hidden />}
		size="small"
		variant="tertiary"
		onClick={() => onFjernFilter(oppgavefilter.id)}
	/>
);

export default FjernFilterButton;
