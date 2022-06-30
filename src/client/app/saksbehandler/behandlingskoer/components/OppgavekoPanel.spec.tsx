import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import RestApiTestMocker from '../../../../../../setup/testHelpers/RestApiTestMocker';
import { RestApiGlobalStatePathsKeys } from 'api/k9LosApi';
import { shallowWithIntl } from '../../../../../../setup/testHelpers/intl-enzyme-test-helper';
import OppgavekoPanel from './OppgavekoPanel';
import OppgavekoVelgerForm from './OppgavekoVelgerForm';

describe('<OppgavekoPanel>', () => {
  it('skal vise kriterievelger og liste over neste saker', () => {
    new RestApiTestMocker()
      .withGlobalData(RestApiGlobalStatePathsKeys.NAV_ANSATT, { startRequest: () => undefined, data: { kanOppgavestyre: true } })
      .runTest(() => {
        const wrapper = shallowWithIntl(<OppgavekoPanel
          oppgaverTilBehandling={[]}
          reserverteOppgaver={[]}
          oppgavekoer={[]}
          apneOppgave={sinon.spy()}
          setValgtOppgavekoId={sinon.spy()}
          valgtOppgavekoId="1"
          hentReserverteOppgaver={sinon.spy()}
          requestFinished
        />);
        expect(wrapper.find(OppgavekoVelgerForm)).to.have.length(1);
        expect(wrapper.find('button')).to.have.length(3);
        
      });
  });
});
