import React from 'react';
import { screen } from '@testing-library/react';
import {renderWithAllProviders} from "../../../../../setup/testHelpers/testUtils";
import HeaderWithErrorPanel from "app/components/HeaderWithErrorPanel";
import {K9LosApiKeys, RestApiGlobalStatePathsKeys} from "api/k9LosApi";
import RestApiTestMocker from "../../../../../setup/testHelpers/RestApiTestMocker";

const setSiteHeight = (headerHeight: number): void => {};
const crashMessage = 'CrashMessage';


describe('<HeaderWithErrorPanel>', () => {
  it('skal vise lenker for rettskilde og systemrutine i header men ingen avdelinger når det ikke er noen', () => {
    new RestApiTestMocker()
      .withRestCall(K9LosApiKeys.DRIFTSMELDINGER, [{
          id: '1',
          melding: crashMessage,
          dato: '06-09-2021',
          aktiv: true,
          aktivert: '2021-06-09',
        }],
      )
      .withGlobalData(RestApiGlobalStatePathsKeys.NAV_ANSATT, { navn: 'Paul', brukernavn: 'KaosPaul@nav.no'})
      .runTest(() => {
        renderWithAllProviders(<HeaderWithErrorPanel
          queryStrings={{}}
          crashMessage={crashMessage}
          setSiteHeight={setSiteHeight}
        />);
      })

    expect(screen.getByText('Omsorgspenger, pleiepenger og frisinn')).toBeInTheDocument();
    expect(screen.getByText('Systemer')).toBeInTheDocument();
    expect(screen.getByText('Rettskildene')).toBeInTheDocument();
    expect(screen.getByText('Systemrutine')).toBeInTheDocument();
    expect(screen.getByText('Paul')).toBeInTheDocument();
    expect(screen.getByText(crashMessage)).toBeInTheDocument();
    expect(screen.getByText('CrashMessage. (Registrert 09.06 00:00)')).toBeInTheDocument();
  });
});