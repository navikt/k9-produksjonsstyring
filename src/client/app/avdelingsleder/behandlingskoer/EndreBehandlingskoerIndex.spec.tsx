import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import EndreOppgavekoerPanel from './components/EndreOppgavekoerPanel';
import EndreBehandlingskoerIndex from './EndreBehandlingskoerIndex';

describe('<EndreBehandlingskoerIndex>', () => {
  it('skal hente oppgavekoer når behandlingskø-fanen blir valgt', () => {
    const wrapper = shallow(<EndreBehandlingskoerIndex />);

    expect(wrapper.find(EndreOppgavekoerPanel)).to.have.length(1);
  });
});
