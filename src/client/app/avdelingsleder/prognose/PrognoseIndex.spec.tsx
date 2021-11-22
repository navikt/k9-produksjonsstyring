import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import PrognoseIndex from './PrognoseIndex';
import BehandlingerGårAvVent from './behandlingerGårAvVent/BehandlingerGårAvVent';

describe('<PrognoseIndex>', () => {
  it('skal vise grafpaneler', () => {
    const wrapper = shallow(<PrognoseIndex />);
    expect(wrapper.find(BehandlingerGårAvVent)).to.have.length(1);
  });
});
