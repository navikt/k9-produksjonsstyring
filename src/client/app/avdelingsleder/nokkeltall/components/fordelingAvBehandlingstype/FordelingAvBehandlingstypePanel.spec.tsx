import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithAllProviders } from '../../../../../../../setup/testHelpers/testUtils';
import FordelingAvBehandlingstypePanel from './FordelingAvBehandlingstypePanel';

describe('<FordelingAvBehandlingstypePanel>', () => {
	it.skip('kan velge option i dropdown', () => {
		renderWithAllProviders(<FordelingAvBehandlingstypePanel alleOppgaver={[]} />);

		const ukeSelect = screen.queryByRole('combobox');
		const ytelseSelect = screen.getByRole('combobox');

		expect(ukeSelect).not.toBeVisible();
		expect(ytelseSelect).toBeVisible();

		userEvent.click(screen.getByText(/Pleiepenger sykt barn/i));
	});
});
