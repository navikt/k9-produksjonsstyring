import { screen } from '@testing-library/react';
import { K9LosApiKeys, RestApiGlobalStatePathsKeys } from 'api/k9LosApi';
import React from 'react';

import RestApiTestMocker from '../../../../../setup/testHelpers/RestApiTestMocker';
import { renderWithAllProviders } from '../../../../../setup/testHelpers/testUtils';
import HeaderWithErrorPanel from './HeaderWithErrorPanel';

const setSiteHeight = (headerHeight: number): void => null;
const crashMessage = 'CrashMessage';

describe('<HeaderWithErrorPanel>', () => {
  it('skal vise lenker for rettskilde og systemrutine i header men ingen avdelinger når det ikke er noen', () => {
    new RestApiTestMocker()
      .withRestCall(K9LosApiKeys.DRIFTSMELDINGER, [
        {
          id: '1',
          melding: crashMessage,
          dato: '06-09-2021',
          aktiv: true,
          aktivert: '',
        },
      ])
      .withGlobalData(RestApiGlobalStatePathsKeys.NAV_ANSATT, { navn: 'Paul', brukernavn: 'KaosPaul@nav.no' })
      .runTest(() => {
        renderWithAllProviders(
          <HeaderWithErrorPanel queryStrings={{}} crashMessage={crashMessage} setSiteHeight={setSiteHeight} />,
        );
      });

    expect(screen.getByText(crashMessage)).toBeVisible();
    screen.logTestingPlaygroundURL();
  });
});
