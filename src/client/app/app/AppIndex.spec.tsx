import React from 'react';
import { expect } from 'chai';
import { Location } from 'history';
import { shallow } from 'enzyme';
import HeaderWithErrorPanel from './components/HeaderWithErrorPanel';

import { AppIndex } from './AppIndex';

describe('<AppIndex>', () => {
  it('skal vise hjem-skjermbilde inkludert header men ikke feilmelding', () => {
    const wrapper = shallow(<AppIndex
      location={{ search: undefined, state: {} } as Location}
    />);

    const headerComp = wrapper.find(HeaderWithErrorPanel);
    expect(headerComp).to.have.length(1);

    const homeComp = wrapper.find('Home');
    expect(homeComp).to.have.length(1);
  });

  it('skal vise hjem-skjermbilde inkludert header og feilmelding', () => {
    const wrapper = shallow(<AppIndex
      location={{ search: undefined, state: {} } as Location}
    />);

    const headerComp = wrapper.find(HeaderWithErrorPanel);
    expect(headerComp).to.have.length(1);

    const homeComp = wrapper.find('Home');
    expect(homeComp).to.have.length(1);
  });

  it('skal vise query-feilmelding', () => {
    const location = {
      search: '?errormessage=Det+finnes+ingen+sak+med+denne+referansen%3A+266',
      state: {},
    };

    const wrapper = shallow(<AppIndex
      location={location as Location}
    />);

    const headerComp = wrapper.find(HeaderWithErrorPanel);
    expect(headerComp.prop('queryStrings')).to.eql({ errormessage: 'Det finnes ingen sak med denne referansen: 266' });
  });
});
