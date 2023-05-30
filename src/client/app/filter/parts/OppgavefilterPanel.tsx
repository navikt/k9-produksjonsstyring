import React from 'react';
import { Heading, Panel } from '@navikt/ds-react';
import styles from '../filterIndex.css';
import {
	CombineOppgavefilter,
	FeltverdiOppgavefilter,
	FilterContainer,
	Oppgavefelt,
	Oppgavefilter,
} from '../filterTsTypes';
import FeltverdiOppgavefilterPanel from './FeltverdiOppgavefilterPanel';
import FjernFilterButton from './FjernFilterButton';
import LeggTilFilterButton from './LeggTilFilterButton';
import LeggTilGruppeButton from './LeggTilGruppeButton';

interface OppgavefilterPanelProps {
	felter: Oppgavefelt[];
	oppgavefilter: FeltverdiOppgavefilter | CombineOppgavefilter;
	onLeggTilFilter: (fc: FilterContainer) => void;
	onLeggTilGruppe: (fc: FilterContainer) => void;
	onOppdaterFilter: (id: string, data: object) => void;
	onFjernFilter: (oppgavefilter: Oppgavefilter) => void;
}

/* eslint-disable @typescript-eslint/no-use-before-define */
const OppgavefilterPanel = ({
	felter,
	oppgavefilter,
	onLeggTilFilter,
	onLeggTilGruppe,
	onOppdaterFilter,
	onFjernFilter,
}: OppgavefilterPanelProps) => {
	if (oppgavefilter.type === 'feltverdi' && 'operator' in oppgavefilter) {
		return (
			<FeltverdiOppgavefilterPanel
				felter={felter}
				oppgavefilter={oppgavefilter}
				onOppdaterFilter={onOppdaterFilter}
				onFjernFilter={onFjernFilter}
			/>
		);
	}
	if (oppgavefilter.type === 'combine' && 'combineOperator' in oppgavefilter) {
		return (
			<CombineOppgavefilterPanel
				felter={felter}
				oppgavefilter={oppgavefilter}
				onLeggTilFilter={onLeggTilFilter}
				onLeggTilGruppe={onLeggTilGruppe}
				onOppdaterFilter={onOppdaterFilter}
				onFjernFilter={onFjernFilter}
			/>
		);
	}
	throw new Error(`Unhandled type: ${oppgavefilter.type}`);
};

interface CombineOppgavefilterPanelProps {
	felter: Oppgavefelt[];
	oppgavefilter: CombineOppgavefilter;
	onLeggTilFilter: (fc: FilterContainer) => void;
	onLeggTilGruppe: (fc: FilterContainer) => void;
	onOppdaterFilter: (id: string, data: object) => void;
	onFjernFilter: (oppgavefilter: Oppgavefilter) => void;
}

const CombineOppgavefilterPanel = ({
	felter,
	oppgavefilter,
	onLeggTilFilter,
	onLeggTilGruppe,
	onOppdaterFilter,
	onFjernFilter,
}: CombineOppgavefilterPanelProps) => (
	<Panel className={`${styles.filter} ${styles.filterGruppe}`} key={oppgavefilter.id} border>
		{console.log(typeof oppgavefilter.filtere)}
		<FjernFilterButton oppgavefilter={oppgavefilter} onFjernFilter={onFjernFilter} />
		<Heading level="5" size="xsmall">
			{oppgavefilter.combineOperator === 'OR'
				? 'Minimum en av disse må gjelde for oppgaven'
				: 'Alle disse må gjelde for oppgaven'}
		</Heading>
		{oppgavefilter.filtere.map((item) => (
			<OppgavefilterPanel
				key={item.id}
				felter={felter}
				oppgavefilter={item}
				onLeggTilFilter={onLeggTilFilter}
				onLeggTilGruppe={onLeggTilGruppe}
				onOppdaterFilter={onOppdaterFilter}
				onFjernFilter={onFjernFilter}
			/>
		))}
		<LeggTilFilterButton filterContainer={oppgavefilter} onLeggTilFilter={onLeggTilFilter} />
		<LeggTilGruppeButton filterContainer={oppgavefilter} onLeggTilGruppe={onLeggTilGruppe} />
	</Panel>
);

export default OppgavefilterPanel;
