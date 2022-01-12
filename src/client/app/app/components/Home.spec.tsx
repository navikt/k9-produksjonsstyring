import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import Home from './Home';

describe('<Home>', () => {
  it('skal rendre komponent', () => {
    const wrapper = shallow(<Home headerHeight={10} />);
    expect(wrapper.find('Routes')).to.have.length(1);
  });
});
