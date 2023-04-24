import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithAllProviders } from '../../../../../../../setup/testHelpers/testUtils';
import { NyeHistorikkPanel } from './NyeHistorikkPanel';

describe('<NyeHistorikkPanel>', () => {
	it('kan velge option i dropdowns', () => {
		renderWithAllProviders(<NyeHistorikkPanel nyePerDato={[]} />);

		const ukeSelect = screen.getAllByRole('combobox')[0];
		const ytelseSelect = screen.getAllByRole('combobox')[1];

		expect(ukeSelect).toBeVisible();
		expect(ytelseSelect).toBeVisible();

		userEvent.click(screen.getByText('Historikk.FireSisteUker'));
		userEvent.click(screen.getByText(/Punsj/i));
	});
});
