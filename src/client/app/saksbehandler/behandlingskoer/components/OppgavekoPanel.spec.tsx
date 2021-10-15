import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';

import OppgavekoVelgerForm from './OppgavekoVelgerForm';
import OppgaverTabell from './oppgavetabeller/OppgaverTabell';

import OppgavekoPanel from './OppgavekoPanel';

describe('<OppgavekoPanel>', () => {
  it('skal vise kriterievelger og liste over neste saker', () => {
    const reserverteOppgaver = [];
    const oppgavekoer = [];
    const wrapper = shallow(<OppgavekoPanel
      oppgaverTilBehandling={reserverteOppgaver}
      reserverteOppgaver={reserverteOppgaver}
      oppgavekoer={oppgavekoer}
      reserverOppgave={sinon.spy()}
      setValgtOppgavekoId={sinon.spy()}
      valgtOppgavekoId="1"
      hentReserverteOppgaver={sinon.spy()}
      requestFinished
    />);

    expect(wrapper.find(OppgavekoVelgerForm)).to.have.length(1);
    expect(wrapper.find('button')).to.have.length(2);
  });
});
