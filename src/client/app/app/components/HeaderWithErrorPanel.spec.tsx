import { Header } from '@navikt/ft-plattform-komponenter';
import { K9LosApiKeys, RestApiGlobalStatePathsKeys } from 'api/k9LosApi';
import { expect } from 'chai';
import React from 'react';
import { intlMock, shallowWithIntl } from '../../../../../setup/testHelpers/intl-enzyme-test-helper';
import RestApiTestMocker from '../../../../../setup/testHelpers/RestApiTestMocker';
import HeaderWithErrorPanel from './HeaderWithErrorPanel';

const setSiteHeight = (headerHeight: number): void => null;
const crashMessage = 'CrashMessage';

describe('<HeaderWithErrorPanel>', () => {
  it('skal vise lenker for rettskilde og systemrutine i header men ingen avdelinger når det ikke er noen', () => {
    new RestApiTestMocker()
      .withRestCall(K9LosApiKeys.DRIFTSMELDINGER, {
        data: [
          {
            id: '1',
            melding: crashMessage,
            dato: '06-09-2021',
            aktiv: true,
            aktivert: '',
          },
        ],
      })
      .withGlobalData(RestApiGlobalStatePathsKeys.NAV_ANSATT, { navn: 'Paul', brukernavn: 'KaosPaul@nav.no' })
      .runTest(() => {
        const wrapper = shallowWithIntl(
          <HeaderWithErrorPanel.WrappedComponent
            intl={intlMock}
            queryStrings={{}}
            crashMessage={crashMessage}
            setSiteHeight={setSiteHeight}
          />,
        );

        const header = wrapper.find(Header);
        expect(header).has.length(1);

        expect(header.find(Header)).has.length(1);

        const feilmelding = JSON.stringify(wrapper.find('DriftsmeldingPanel').prop('driftsmeldinger'));
        expect(feilmelding).to.include('1');
        expect(feilmelding).to.include(crashMessage);
        expect(feilmelding).to.include('06-09-2021');
        expect(feilmelding).to.include(true);
      });
  });
});
