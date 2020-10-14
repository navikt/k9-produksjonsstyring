import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import BemanningIndex from './BemanningIndex';
import SaksbehandlerePanel from './components/SaksbehandlerePanel';

describe('<BemanningIndex>', () => {
  it('skal hente saksbehandlere ved lasting av komponent og så vise desse i panel', () => {
    const wrapper = shallow(<BemanningIndex />);

    expect(wrapper.find(SaksbehandlerePanel)).to.have.length(1);
  });
});
