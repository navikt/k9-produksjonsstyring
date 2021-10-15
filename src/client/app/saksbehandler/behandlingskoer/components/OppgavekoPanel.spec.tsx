import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import OppgavekoVelgerForm from './OppgavekoVelgerForm';
import OppgavekoPanel from './OppgavekoPanel';

describe('<OppgavekoPanel>', () => {
  it('skal vise kriterievelger og liste over neste saker', () => {
    const wrapper = shallow(<OppgavekoPanel
      oppgaverTilBehandling={[]}
      reserverteOppgaver={[]}
      oppgavekoer={[]}
      reserverOppgave={sinon.spy()}
      setValgtOppgavekoId={sinon.spy()}
      valgtOppgavekoId="1"
      hentReserverteOppgaver={sinon.spy()}
      requestFinished
    />);

    expect(wrapper.find(OppgavekoVelgerForm)).to.have.length(1);
    expect(wrapper.find('button')).to.have.length(2);

    expect(wrapper.find('.behandlingskoerContainer').at(0).children()).to.have.length(1);
    wrapper.find('button').at(0).simulate('click');
    expect(wrapper.find('.behandlingskoerContainer').at(0).children()).to.have.length(2);

    expect(wrapper.find('.behandlingskoerContainer').at(1).children()).to.have.length(1);
    wrapper.find('button').at(1).simulate('click');
    expect(wrapper.find('.behandlingskoerContainer').at(1).children()).to.have.length(2);
  });
});
