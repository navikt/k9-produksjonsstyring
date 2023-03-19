import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import HeaderWithErrorPanel from 'app/components/HeaderWithErrorPanel';
import AppIndex from './AppIndex';

const mockConfig = {
  pathname: 'localhost:3000/example/path',
  search: undefined,
};

jest.mock('react-router', () => ({
  // @ts-ignore
  ...jest.requireActual('react-router'),
  useLocation: () => mockConfig,
}));

describe('<AppIndex>', () => {
  it('skal vise hjem-skjermbilde inkludert header uten feilmelding', () => {
    const wrapper = shallow(<AppIndex />);

    const headerComp = wrapper.find(HeaderWithErrorPanel);
    expect(headerComp).to.have.length(1);
    expect(headerComp.prop('queryStrings')).to.eql({ '': 'undefined' });

    const homeComp = wrapper.find('Home');
    expect(homeComp).to.have.length(1);
  });

  it('skal vise query-feilmelding', () => {
    mockConfig.search = '?errormessage=Det+finnes+ingen+sak+med+denne+referansen%3A+266';
    const wrapper = shallow(<AppIndex />);

    const headerComp = wrapper.find(HeaderWithErrorPanel);
    expect(headerComp.prop('queryStrings')).to.eql({ errormessage: 'Det finnes ingen sak med denne referansen: 266' });
  });
});
