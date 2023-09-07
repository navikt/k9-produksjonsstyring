import React, { useContext } from 'react';
import { Delete } from '@navikt/ds-icons';
import { Button, Heading, Panel } from '@navikt/ds-react';
import FilterContext from 'filter/FilterContext';
import styles from '../filterIndex.css';
import { CombineOppgavefilter, FeltverdiOppgavefilter } from '../filterTsTypes';
import FeltverdiOppgavefilterPanel from './FeltverdiOppgavefilterPanel/FeltverdiOppgavefilterPanel';
import FjernFilterButton from './FjernFilterButton';
import Kriterie from './Kriterie';
import VelgKriterie from './VelgKriterie';

interface OppgavefilterPanelProps {
	oppgavefilter: FeltverdiOppgavefilter | CombineOppgavefilter;
	visningV2?: boolean;
}

/* eslint-disable @typescript-eslint/no-use-before-define */
const OppgavefilterPanel = ({ oppgavefilter, visningV2 }: OppgavefilterPanelProps) => {
	if (oppgavefilter.type === 'feltverdi' && 'kode' in oppgavefilter && oppgavefilter.kode === null) {
		return <VelgKriterie oppgavefilter={oppgavefilter} />;
	}

	if (oppgavefilter.type === 'feltverdi' && 'operator' in oppgavefilter) {
		if (!visningV2) return <FeltverdiOppgavefilterPanel oppgavefilter={oppgavefilter} />;
		return <Kriterie oppgavefilter={oppgavefilter} />;
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
			<Heading level="5" size="xsmall">
				{oppgavefilter.combineOperator === 'OR'
					? 'Minimum en av disse må gjelde for oppgaven'
					: 'Alle disse må gjelde for oppgaven'}
			</Heading>
			{oppgavefilter.filtere.map((item) => (
				<OppgavefilterPanel key={item.id} oppgavefilter={item} />
			))}
			<Button
				icon={<Delete aria-hidden />}
				size="small"
				variant="tertiary"
				onClick={() => fjernFilter(oppgavefilter.id)}
			/>
		</Panel>
	);
};

export default OppgavefilterPanel;
