import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithAllProviders } from '../../../../../../../setup/testHelpers/testUtils';
import { NyeHistorikkPanel } from './NyeHistorikkPanel';

describe('<NyeHistorikkPanel>', () => {
	it('kan velge option i dropdowns', () => {
		renderWithAllProviders(<NyeHistorikkPanel nyePerDato={[]} />);

		const ukeSelect = screen.getByLabelText('Antall uker som skal vises');
		const ytelseSelect = screen.getByLabelText('Valgt ytelse');
		expect(ukeSelect).toBeVisible();
		expect(ytelseSelect).toBeVisible();

		userEvent.click(screen.getByText('4 siste uker'));
		userEvent.click(screen.getByText(/Punsj/i));
	});
});
