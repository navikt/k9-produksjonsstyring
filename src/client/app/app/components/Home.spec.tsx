import React from 'react';
import {screen} from '@testing-library/react';
import {renderWithAllProviders} from "../../../../../setup/testHelpers/testUtils";
import RestApiTestMocker from "../../../../../setup/testHelpers/RestApiTestMocker";
import Home from "app/components/Home";
import {MemoryRouter} from "react-router";
import {RestApiGlobalStatePathsKeys} from "api/k9LosApi";


describe('<Home>', () => {
  it('skal rendre komponent', () => {
    new RestApiTestMocker()
      .withGlobalData(RestApiGlobalStatePathsKeys.NAV_ANSATT, {navn: 'Paul', brukernavn: 'KaosPaul@nav.no'})
      .runTest(() => {
        renderWithAllProviders(<MemoryRouter><Home headerHeight={10}/> </MemoryRouter>);
      })

    expect(screen.getByText('Du har ikke tilgang til å bruke dette programmet')).toBeInTheDocument();
  });
});