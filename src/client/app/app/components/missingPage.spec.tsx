import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import Panel from 'nav-frontend-paneler';
import MissingPage from './MissingPage';

describe('<MissingPage>', () => {
    it('skal vise en feilmelding og en lenke som leder tilbake til hovedside', () => {
        const wrapper = shallow(<MissingPage />);

        expect(wrapper.find(Panel)).to.have.length(1);
        expect(wrapper.find(FormattedMessage)).to.have.length(2);
        const link = wrapper.find(Link);
        expect(link).to.have.length(1);
        expect(link.prop('to')).to.eql('/');
    });
});
