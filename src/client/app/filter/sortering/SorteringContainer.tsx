import React from 'react';
import EnkelSortering from './EnkelSortering';
import OppgaveOrderFelter from './OppgaveOrderFelter';

interface Props {
	køvisning: boolean;
}

const SorteringContainer = ({ køvisning }: Props) => {
	if (!køvisning) {
		return <OppgaveOrderFelter />;
	}

	return <EnkelSortering />;
};

export default SorteringContainer;
