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

    const wrapper = shallow(<NokkeltallIndex
      fetchAlleOppgaver={fetchAlleOppgaverFn}
      fetchOppgaverPerDato={fetchOppgaverPerDatoFn}
    />);

    expect(wrapper.find(NokkeltallPanel)).to.have.length(1);

    expect(fetchAlleOppgaverFn.calledOnce).to.be.true;
    expect(fetchOppgaverPerDatoFn.calledOnce).to.be.true;
  });
});
