import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { MottattPanel } from 'avdelingsleder/nokkeltall/components/refusjon/MottattPanel';
import NokkeltallPanel from './NokkeltallPanel';

describe('<NokkeltallPanel>', () => {
  it('skal vise mottattPanel', () => {
    const wrapper = shallow(<NokkeltallPanel />);
    expect(wrapper.find(MottattPanel)).to.have.length(1);
  });
});
