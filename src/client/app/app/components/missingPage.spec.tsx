import React from 'react';
import {screen} from '@testing-library/react';
import {renderWithAllProviders} from "../../../../../setup/testHelpers/testUtils";
import {MemoryRouter} from "react-router";
import MissingPage from "app/components/MissingPage";

describe('<Home>', () => {
  it('skal vise en feilmelding og en lenke som leder tilbake til hovedside', () => {
    renderWithAllProviders(<MemoryRouter><MissingPage /></MemoryRouter>);
    expect(screen.getByText('Side finnes ikke')).toBeInTheDocument();
  });
});
