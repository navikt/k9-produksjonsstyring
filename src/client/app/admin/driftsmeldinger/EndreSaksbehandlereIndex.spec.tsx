
import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';

import { EndreDriftsmeldingerIndex } from './EndreDriftsmeldingerIndex';
import DriftsmeldingerPanel from './components/DriftsmeldingerPanel';

describe('<EndreDriftsmeldingerIndex>', () => {
  it('skal hente saksbehandlere ved lasting av komponent og så vise desse i panel', () => {
    const fetchAlleDriftsmeldinger = sinon.spy();
    const wrapper = shallow(<EndreDriftsmeldingerIndex
      fetchAlleDriftsmeldinger={fetchAlleDriftsmeldinger}
      findSaksbehandler={sinon.spy()}
      resetSaksbehandlerSok={sinon.spy()}
      addSaksbehandler={sinon.spy()}
      alleDriftsmeldinger={[]}
      removeSaksbehandler={sinon.spy()}
    />);

    expect(wrapper.find(DriftsmeldingerPanel)).to.have.length(1);
    expect(fetchAlleDriftsmeldinger.calledOnce).to.be.true;
    const { args } = fetchAlleDriftsmeldinger.getCalls()[0];
    expect(args).to.have.length(0);
  });
});
