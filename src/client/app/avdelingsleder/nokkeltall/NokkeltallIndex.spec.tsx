import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import { K9LosApiKeys } from 'api/k9LosApi';
import RestApiTestMocker from '../../../../../setup/testHelpers/RestApiTestMocker';
import NokkeltallIndex from './NokkeltallIndex';
import NokkeltallPanel from './components/NokkeltallPanel';

describe('<NokkeltallIndex>', () => {
  it('skal hente statistikk ved lasting av komponent', () => {
    new RestApiTestMocker()
      .withRestCall(K9LosApiKeys.HENT_OPPGAVER, [])
      .withRestCall(K9LosApiKeys.HENT_FERDIGSTILTE_HISTORIKK, [])
      .withRestCall(K9LosApiKeys.HENT_NYE_HISTORIKK, [])
      .withRestCall(K9LosApiKeys.HENT_OPPGAVER_PER_DATO, [])
      .runTest(() => {
        const wrapper = shallow(<NokkeltallIndex />);

        expect(wrapper.find(NokkeltallPanel)).to.have.length(1);
      });
  });
});
