import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import SaksstotteIndex from './SaksstotteIndex';
import SaksstottePaneler from './components/SaksstottePaneler';

describe('<SaksstotteIndex>', () => {
  it('skal vise alle saksstøttepanel', () => {
    const wrapper = shallow(<SaksstotteIndex />);

    expect(wrapper.find(SaksstottePaneler)).to.have.length(1);
  });
});
