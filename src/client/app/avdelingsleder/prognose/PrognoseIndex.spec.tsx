import React from 'react';

import PrognoseIndex from './PrognoseIndex';
import { renderWithAllProviders } from '../../../../../setup/testHelpers/testUtils';
import { screen } from '@testing-library/react';

describe('<PrognoseIndex>', () => {
  it('skal vise grafpaneler', () => {
    renderWithAllProviders(<PrognoseIndex />);
    expect(screen.getByText('BehandlingerGårAvVentÅrsaker.Tittel')).toBeDefined();
  });
});
