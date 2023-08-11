import React from 'react';
import SearchWithDropdown from 'sharedComponents/searchWithDropdown/SearchWithDropdown';

export default {
	title: 'SearchWithDropdown',
	component: SearchWithDropdown,
};

const oppgavekodeKodeverk = [
	{
		kode: '9001',
		navn: 'Sykdom',
		kodeverk: 'OPPGAVE_KODE',
		gruppering: 'Sykdom',
	},
	{
		kode: '5015',
		navn: 'Forslå vedtak',
		kodeverk: 'OPPGAVE_KODE',
		gruppering: 'Vedtak',
	},
	{
		kode: '5028',
		navn: 'Foreslå vedtak manuelt',
		kodeverk: 'OPPGAVE_KODE',
		gruppering: 'Vedtak',
	},
	{
		kode: '5016',
		navn: 'Fatte vedtak',
		kodeverk: 'OPPGAVE_KODE',
		gruppering: 'Vedtak',
	},
];

const oppgavekodegrupperingeringer = [
	{
		navn: 'Sykdom',
		koder: ['9001'],
	},
	{ navn: 'Vedtak', koder: ['5028', '5016', '5015'] },
];

const formaterteOppgavekoder = oppgavekodeKodeverk.map((oppgavekode) => ({
	value: oppgavekode.kode,
	label: oppgavekode.navn,
	group: oppgavekode.gruppering,
}));

export const skalViseSøkMedDropdown = () => (
	<div style={{ maxWidth: '430px' }}>
		<SearchWithDropdown
			label="Velg aksjonspunkt"
			suggestions={formaterteOppgavekoder}
			groups={oppgavekodegrupperingeringer}
			addButtonText="Legg til aksjonspunkt"
			heading="Velg aksjonspunkter"
		/>
	</div>
);
