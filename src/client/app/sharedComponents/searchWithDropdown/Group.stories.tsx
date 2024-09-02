import type { Meta, StoryObj } from '@storybook/react';
import { SelectedValues } from './SelectedValues';

const meta = {
	component: SelectedValues,
	title: 'sharedComponents/searchWithDropdown/Group',
	args: {
		values: [
			{
				value: '5015',
				label: '5015 - Foreslå vedtak',
				group: 'Fatte vedtak',
			},
			{
				value: '5028',
				label: '5028 - Foreslå vedtak manuelt',
				group: 'Fatte vedtak',
			},
			{
				value: '5030',
				label: '5030 - Avklar verge',
				group: 'Innledende behandling',
			},
			{
				value: '5033',
				label: '5033 - Sjekk VKY',
				group: 'Fatte vedtak',
			},
			{
				value: '5034',
				label: '5034 - Vurder dokument',
				group: 'Fatte vedtak',
			},
			{
				value: '5038',
				label: '5038 - Fastsett beregningsgrunnlag',
				group: 'Beregning',
			},
			{
				value: '5039',
				label: '5039 - Ny/endret SN (varig endring)',
				group: 'Beregning',
			},
			{
				value: '5046',
				label: '5046 - Fordel beregningsgrunnlag',
				group: 'Beregning',
			},
			{
				value: '5047',
				label: '5047 - Tidsbegrenset arbeidsforhold',
				group: 'Beregning',
			},
			{
				value: '5049',
				label: '5049 - Ny/endret SN (ny i arb.livet)',
				group: 'Beregning',
			},
			{
				value: '5052',
				label: '5052 - Aktiviteter',
				group: 'Beregning',
			},
			{
				value: '5053',
				label: '5053 - Medlemskap',
				group: 'Innledende behandling',
			},
			{
				value: '5056',
				label: '5056 - Kontroll manuell revurdering',
				group: 'Uspesifisert',
			},
			{
				value: '5058',
				label: '5058 - Beregningsfakta',
				group: 'Beregning',
			},
			{
				value: '5059',
				label: '5059 - Mangler navn',
				group: 'Uspesifisert',
			},
			{
				value: '5077',
				label: '5077 - Søknadsfrist',
				group: 'Innledende behandling',
			},
			{
				value: '5084',
				label: '5084 - Feilutbetaling',
				group: 'Beregning',
			},
			{
				value: '5089',
				label: '5089 - Opptjening',
				group: 'Innledende behandling',
			},
			{
				value: '6014',
				label: '6014 - Overstyring beregningsaktivitet',
				group: 'Beregning',
			},
			{
				value: '6015',
				label: '6015 - Overstyring beregningsgrunnlag',
				group: 'Beregning',
			},
			{
				value: '9001',
				label: '9001 - Sykdom',
				group: 'Innledende behandling',
			},
			{
				value: '9005',
				label: '9005 - Manuell beregning',
				group: 'Flyttesaker',
			},
			{
				value: '9007',
				label: '9007 - Infotrygsøknad',
				group: 'Flyttesaker',
			},
			{
				value: '9008',
				label: '9008 - Infotrygdsøknad 2 personer',
				group: 'Flyttesaker',
			},
			{
				value: '9020',
				label: '9020 - Omsorgen for',
				group: 'Innledende behandling',
			},
			{
				value: '9069',
				label: '9069 - Avklar manglende IM',
				group: 'Mangler inntektsmelding',
			},
			{
				value: '9071',
				label: '9071 - Endelig avklaring mangler IM',
				group: 'Mangler inntektsmelding',
			},
			{
				value: '9200',
				label: '9200 - Nattevåk',
				group: 'Om barnet',
			},
			{
				value: '9201',
				label: '9201 - Beredskap',
				group: 'Om barnet',
			},
			{
				value: '9202',
				label: '9202 - Barns død',
				group: 'Om barnet',
			},
			{
				value: '9203',
				label: '9203 - Mangler arbeidstid',
				group: 'Mangler inntektsmelding',
			},
		],
	},
} satisfies Meta<typeof SelectedValues>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
