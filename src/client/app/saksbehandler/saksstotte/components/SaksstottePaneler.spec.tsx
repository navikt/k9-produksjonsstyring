
import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import SistBehandledeSaker from './SistBehandledeSaker';
import SaksstottePaneler from './SaksstottePaneler';


describe('<SaksstottePaneler>', () => {
  it('skal vise sist behandlede saker', () => {
    const oppgaver = [];
    const wrapper = shallow(<SaksstottePaneler
      k9sakUrl="www.k9sak.no"
      sistBehandledeSaker={oppgaver}
    />);

    expect(wrapper.find(SistBehandledeSaker)).to.have.length(1);
  });
});
