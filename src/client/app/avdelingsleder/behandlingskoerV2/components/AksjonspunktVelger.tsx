import React, { FunctionComponent } from 'react';
import useKodeverk from 'api/rest-api-hooks/src/global-data/useKodeverk';
import kodeverkTyper from 'kodeverk/kodeverkTyper';
import SearchWithDropdown from 'sharedComponents/searchWithDropdown/SearchWithDropdown';

interface OwnProps {
	valgteAksjonspunkter: string[];
	onChange: (aksjonspunkter: string[]) => void;
}

const AksjonspunktVelger: FunctionComponent<OwnProps> = ({ onChange, valgteAksjonspunkter }) => {
	const oppgavekoder = useKodeverk(kodeverkTyper.OPPGAVE_KODE);
	const formaterteOppgavekoder = oppgavekoder
		.map((oppgavekode) => ({
			value: oppgavekode.kode,
			label: `${oppgavekode.kode} - ${oppgavekode.navn}`,
			group: oppgavekode.gruppering,
		}))
		.sort((a, b) => Number(a.value) - Number(b.value));
	const grupper = [...new Set(formaterteOppgavekoder.map((oppgavekode) => oppgavekode.group))].sort();

	return (
		<SearchWithDropdown
			label="Velg aksjonspunkt"
			suggestions={formaterteOppgavekoder}
			groups={grupper}
			addButtonText="Legg til aksjonspunkt"
			heading="Velg aksjonspunkter"
			updateSelection={onChange}
			selectedValues={valgteAksjonspunkter || []}
			className="grow"
		/>
	);
};

export default AksjonspunktVelger;
