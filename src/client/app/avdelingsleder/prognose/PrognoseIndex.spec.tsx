import React from 'react';
import PrognoseIndex from './PrognoseIndex';
import { renderWithAllProviders } from '../../../../../setup/testHelpers/testUtils';

describe('<PrognoseIndex>', () => {
  it('skal vise grafpaneler', () => {
    // TODO legg in test igen når man bruker react query.
    renderWithAllProviders(<PrognoseIndex />);
    // expect(screen.getByText('BehandlingerGårAvVentÅrsaker.Tittel')).toBeDefined();
  });
});
