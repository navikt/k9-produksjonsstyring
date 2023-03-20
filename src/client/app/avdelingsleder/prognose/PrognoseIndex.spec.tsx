import React from 'react';
import { renderWithAllProviders } from '../../../../../setup/testHelpers/testUtils';
import PrognoseIndex from './PrognoseIndex';

describe('<PrognoseIndex>', () => {
	it('skal vise grafpaneler', () => {
		// TODO legg in test igen når man bruker react query.
		renderWithAllProviders(<PrognoseIndex />);
		// expect(screen.getByText('BehandlingerGårAvVentÅrsaker.Tittel')).toBeDefined();
	});
});
