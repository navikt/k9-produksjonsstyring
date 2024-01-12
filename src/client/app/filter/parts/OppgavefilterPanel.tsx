import React, { useContext } from 'react';
import { PlusCircleIcon } from '@navikt/aksel-icons';
import { Delete } from '@navikt/ds-icons';
import { Button, Heading, Label, Panel, ToggleGroup } from '@navikt/ds-react';
import { FilterContext } from 'filter/FilterContext';
import { addFilter, addGruppe, removeFilter, updateFilter } from 'filter/queryUtils';
import styles from '../filterIndex.css';
import { CombineOppgavefilter, FeltverdiOppgavefilter, OppgaveQuery, OppgavefilterKode } from '../filterTsTypes';
import FeltverdiOppgavefilterPanel from './FeltverdiOppgavefilterPanel/FeltverdiOppgavefilterPanel';
import Kriterie from './Kriterie';
import VelgKriterie from './VelgKriterie';
import filterGruppeStyles from './filterGruppe.css';

interface OppgavefilterPanelProps {
	oppgavefilter: FeltverdiOppgavefilter | CombineOppgavefilter;
	visningV2?: boolean;
	addGruppeOperation?: (model: OppgaveQuery) => OppgaveQuery;
	køvisning?: boolean;
	paakrevdeKoder?: OppgavefilterKode[];
}

/* eslint-disable @typescript-eslint/no-use-before-define */
const OppgavefilterPanel = ({
	oppgavefilter,
	visningV2,
	addGruppeOperation,
	køvisning,
	paakrevdeKoder,
}: OppgavefilterPanelProps) => {
	if (oppgavefilter.type === 'feltverdi' && 'kode' in oppgavefilter && oppgavefilter.kode === null) {
		return (
			<VelgKriterie
				oppgavefilter={oppgavefilter}
				addGruppeOperation={addGruppeOperation}
				køvisning={køvisning}
				paakrevdeKoder={paakrevdeKoder}
			/>
		);
	}

	if (oppgavefilter.type === 'feltverdi' && 'operator' in oppgavefilter) {
		if (!visningV2) return <FeltverdiOppgavefilterPanel oppgavefilter={oppgavefilter} />;
		return <Kriterie oppgavefilter={oppgavefilter} paakrevdeKoder={paakrevdeKoder} />;
	}
	if (oppgavefilter.type === 'combine' && 'combineOperator' in oppgavefilter) {
		if (!visningV2) return <CombineOppgavefilterPanel oppgavefilter={oppgavefilter} />;
		return <FilterGruppe oppgavefilter={oppgavefilter} køvisning={køvisning} />;
	}

	throw new Error(`Unhandled type: ${oppgavefilter.type}`);
};

interface CombineOppgavefilterPanelProps {
	oppgavefilter: CombineOppgavefilter;
}
interface FilterGruppeProps {
	oppgavefilter: CombineOppgavefilter;
	køvisning: boolean;
}
const FilterGruppe = ({ oppgavefilter, køvisning }: FilterGruppeProps) => {
	const { updateQuery } = useContext(FilterContext);
	const handleToggle = (value: string) => {
		updateQuery([updateFilter(oppgavefilter.id, { combineOperator: value })]);
	};
	return (
		<div className="rounded-sm border-solid border-[1px] border-surface-action p-4">
			<div className="flex">
				<div className={`flex mb-3 ${filterGruppeStyles.toggle}`}>
					<Label className="mr-2 self-center" size="small">
						Gruppe:
					</Label>
					<ToggleGroup onChange={handleToggle} size="small" value={oppgavefilter.combineOperator}>
						<ToggleGroup.Item value="AND">Og</ToggleGroup.Item>
						<ToggleGroup.Item value="OR">Eller</ToggleGroup.Item>
					</ToggleGroup>
				</div>
				<Button
					icon={<Delete aria-hidden />}
					size="small"
					variant="tertiary"
					className="ml-auto"
					onClick={() => updateQuery([removeFilter(oppgavefilter.id)])}
				/>
			</div>
			<div className="flex flex-col gap-4">
				{oppgavefilter.filtere.map((item) => (
					<OppgavefilterPanel
						key={item.id}
						oppgavefilter={item}
						addGruppeOperation={addGruppe(oppgavefilter.id)}
						visningV2
						køvisning={køvisning}
					/>
				))}
			</div>
			<Button
				className="mt-4 mb-13"
				icon={<PlusCircleIcon aria-hidden />}
				variant="tertiary"
				size="small"
				onClick={() => updateQuery([addFilter(oppgavefilter.id)])}
			>
				Legg til nytt kriterie
			</Button>
		</div>
	);
};

const CombineOppgavefilterPanel = ({ oppgavefilter }: CombineOppgavefilterPanelProps) => {
	const { updateQuery } = useContext(FilterContext);
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
				onClick={() => updateQuery([removeFilter(oppgavefilter.id)])}
			/>
		</Panel>
	);
};

export default OppgavefilterPanel;
