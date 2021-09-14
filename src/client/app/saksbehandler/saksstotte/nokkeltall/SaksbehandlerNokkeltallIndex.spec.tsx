import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import behandlingType from 'kodeverk/behandlingType';
import RestApiTestMocker from '../../../../../../setup/testHelpers/RestApiTestMocker';
import { K9LosApiKeys } from 'api/k9LosApi';
import SaksbehandlerNokkeltallPanel from './components/SaksbehandlerNokkeltallPanel';
import SaksbehandlerNokkeltallIndex from './SaksbehandlerNokkeltallIndex';

describe('<SaksbehandlerNokkeltallIndex>', () => {
  it('skal hente statistikk ved lasting av komponent', () => {
    const oppgaver = [{
      behandlingType: {
        kode: behandlingType.FORSTEGANGSSOKNAD,
        kodeverk: 'test',
      },
      antallNye: 1,
      antallFerdigstilte: 1,
      dato: '2019-01-01',
    }];

    new RestApiTestMocker()
      .withRestCall(K9LosApiKeys.HENT_NYE_OG_FERDIGSTILTE_OPPGAVER, oppgaver)
      .runTest(() => {
        const wrapper = shallow(<SaksbehandlerNokkeltallIndex />);

        const panel = wrapper.find(SaksbehandlerNokkeltallPanel);
        expect(panel).to.have.length(1);
        const oppgaverRes = panel.props().nyeOgFerdigstilteOppgaver;
        expect(oppgaverRes).to.eql(oppgaver);
      });
  });
});
