import React, { useContext } from 'react';
import { Heading, Panel } from '@navikt/ds-react';
import FilterContext from 'filter/FilterContext';
import styles from '../filterIndex.css';
import { CombineOppgavefilter, FeltverdiOppgavefilter } from '../filterTsTypes';
import FeltverdiOppgavefilterPanel from './FeltverdiOppgavefilterPanel/FeltverdiOppgavefilterPanel';
import FjernFilterButton from './FjernFilterButton';
import VelgKriterie from './VelgKriterie';

interface OppgavefilterPanelProps {
	oppgavefilter: FeltverdiOppgavefilter | CombineOppgavefilter;
}

/* eslint-disable @typescript-eslint/no-use-before-define */
const OppgavefilterPanel = ({ oppgavefilter }: OppgavefilterPanelProps) => {
	if (oppgavefilter.type === 'feltverdi' && 'kode' in oppgavefilter && oppgavefilter.kode === null) {
		return <VelgKriterie oppgavefilter={oppgavefilter} />;
	}
	if (oppgavefilter.type === 'feltverdi' && 'operator' in oppgavefilter) {
		return <FeltverdiOppgavefilterPanel oppgavefilter={oppgavefilter} />;
	}
	if (oppgavefilter.type === 'combine' && 'combineOperator' in oppgavefilter) {
		return <CombineOppgavefilterPanel oppgavefilter={oppgavefilter} />;
	}
	throw new Error(`Unhandled type: ${oppgavefilter.type}`);
};

interface CombineOppgavefilterPanelProps {
	oppgavefilter: CombineOppgavefilter;
}

const CombineOppgavefilterPanel = ({ oppgavefilter }: CombineOppgavefilterPanelProps) => {
	const { fjernFilter } = useContext(FilterContext);
	return (
		<Panel className={`${styles.filter} ${styles.filterGruppe}`} key={oppgavefilter.id} border>
			<FjernFilterButton oppgavefilter={oppgavefilter} onFjernFilter={fjernFilter} />
			<Heading level="5" size="xsmall">
				{oppgavefilter.combineOperator === 'OR'
					? 'Minimum en av disse må gjelde for oppgaven'
					: 'Alle disse må gjelde for oppgaven'}
			</Heading>
			{oppgavefilter.filtere.map((item) => (
				<OppgavefilterPanel key={item.id} oppgavefilter={item} />
			))}
		</Panel>
	);
};

export default OppgavefilterPanel;
