import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import LoadingPanel from './LoadingPanel';

describe('<LoadingPanel>', () => {
  it('skal rendre modal', () => {
    const wrapper = shallow(<LoadingPanel />);
    console.log(wrapper.debug());
    const spinner = wrapper.find('ForwardRef');
    expect(spinner).to.have.length(1);
  });
});
