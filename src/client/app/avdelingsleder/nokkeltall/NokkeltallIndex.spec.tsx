import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';

import { NokkeltallIndex } from './NokkeltallIndex';
import NokkeltallPanel from './components/NokkeltallPanel';

describe('<NokkeltallIndex>', () => {
  it('skal hente statistikk ved lasting av komponent', () => {
    const fetchAlleOppgaverFn = sinon.spy();
    const fetchOppgaverPerDatoFn = sinon.spy();
    const fetchOppgaverManueltPaVentFn = sinon.spy();
    const fetchOppgaverPerForsteStonadsdagFn = sinon.spy();

    const wrapper = shallow(<NokkeltallIndex
      fetchAlleOppgaver={fetchAlleOppgaverFn}
      fetchOppgaverPerDato={fetchOppgaverPerDatoFn}
      fetchOppgaverManueltPaVent={fetchOppgaverManueltPaVentFn}
      fetchOppgaverPerForsteStonadsdag={fetchOppgaverPerForsteStonadsdagFn}
    />);

    expect(wrapper.find(NokkeltallPanel)).to.have.length(1);

    expect(fetchAlleOppgaverFn.calledOnce).to.be.true;
    const { args: args1 } = fetchAlleOppgaverFn.getCalls()[0];
    expect(args1).to.have.length(1);
    expect(args1[0]).to.eql('2');

    expect(fetchOppgaverPerDatoFn.calledOnce).to.be.true;
    const { args: args2 } = fetchOppgaverPerDatoFn.getCalls()[0];
    expect(args2).to.have.length(1);
    expect(args2[0]).to.eql('2');

    expect(fetchOppgaverManueltPaVentFn.calledOnce).to.be.true;
    const { args: args3 } = fetchOppgaverManueltPaVentFn.getCalls()[0];
    expect(args3).to.have.length(1);
    expect(args3[0]).to.eql('2');

    expect(fetchOppgaverPerForsteStonadsdagFn.calledOnce).to.be.true;
    const { args: args4 } = fetchOppgaverPerForsteStonadsdagFn.getCalls()[0];
    expect(args4).to.have.length(1);
    expect(args4[0]).to.eql('2');
  });
});
