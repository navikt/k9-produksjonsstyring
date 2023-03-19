import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import EndreBehandlingskoerIndex from './EndreBehandlingskoerIndex';
import EndreOppgavekoerPanel from './components/EndreOppgavekoerPanel';

describe('<EndreBehandlingskoerIndex>', () => {
  it('skal hente oppgavekoer når behandlingskø-fanen blir valgt', () => {
    const wrapper = shallow(<EndreBehandlingskoerIndex />);

    expect(wrapper.find(EndreOppgavekoerPanel)).to.have.length(1);
  });
});
