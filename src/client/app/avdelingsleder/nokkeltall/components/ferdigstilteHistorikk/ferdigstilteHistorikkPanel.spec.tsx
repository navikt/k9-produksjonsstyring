import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithAllProviders } from '../../../../../../../setup/testHelpers/testUtils';
import FerdigstilteHistorikkPanel from './FerdigstilteHistorikkPanel';

describe('<NyeHistorikkPanel>', () => {
	it('kan velge option i dropdowns', () => {
		renderWithAllProviders(<FerdigstilteHistorikkPanel ferdigstiltePerDato={[]} />);
		const ukeSelect = screen.getByLabelText('Antall uker som skal vises');
		const ytelseSelect = screen.getByLabelText('Valgt ytelse');

		expect(ukeSelect).toBeVisible();
		expect(ytelseSelect).toBeVisible();

		userEvent.click(screen.getByText('Historikk.FireSisteUker'));
		userEvent.click(screen.getByText(/Pleiepenger sykt barn/i));
	});
});
