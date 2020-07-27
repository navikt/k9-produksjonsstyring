import { shallow } from 'enzyme';
import { expect } from 'chai';
import React from 'react';

import sinon from 'sinon';
import { ReservasjonerIndex } from './ReservasjonerIndex';
import ReservasjonerTabell from './components/ReservasjonerTabell';

describe('<ReservasjonerIndex>', () => {
  it('skal hente reservasjoner ved lasting av komponent og så vise dem i panel', () => {
    const fetchAlleReservasjoner = sinon.spy();

    const wrapper = shallow(<ReservasjonerIndex
      fetchAlleReservasjoner={fetchAlleReservasjoner}
      opphevReservasjon={sinon.spy()}
    />);

    expect(wrapper.find(ReservasjonerTabell)).to.have.length(1);
    expect(fetchAlleReservasjoner.calledOnce).to.be.true;
    const { args } = fetchAlleReservasjoner.getCalls()[0];
    expect(args).to.have.length(0);
  });
});
