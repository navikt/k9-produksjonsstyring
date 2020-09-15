import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';

import OppgavekoVelgerForm from './OppgavekoVelgerForm';
import OppgaverTabell from './OppgaverTabell';

import OppgavekoPanel from './OppgavekoPanel';

describe('<OppgavekoPanel>', () => {
  it('skal vise kriterievelger og liste over neste saker', () => {
    const fetchFn = sinon.spy();
    const reserverteOppgaver = [];
    const oppgavekoer = [];
    const wrapper = shallow(<OppgavekoPanel
      fetchOppgavekoOppgaver={fetchFn}
      oppgaverTilBehandling={reserverteOppgaver}
      reserverteOppgaver={reserverteOppgaver}
      oppgavekoer={oppgavekoer}
      reserverOppgave={sinon.spy()}
      opphevOppgaveReservasjon={sinon.spy()}
      forlengOppgaveReservasjon={sinon.spy()}
      finnSaksbehandler={sinon.spy()}
      resetSaksbehandler={sinon.spy()}
      flyttReservasjon={sinon.spy()}
      fetchOppgavekoensSaksbehandlere={sinon.spy()}
    />);

    expect(wrapper.find(OppgavekoVelgerForm)).to.have.length(1);
    expect(wrapper.find(OppgaverTabell)).to.have.length(1);
  });
});
