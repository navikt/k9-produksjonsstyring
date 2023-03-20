import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import FagsakList from './FagsakList';
import FagsakSearch from './FagsakSearch';
import SearchForm from './SearchForm';
import PersonInfo from './person/PersonInfo';

describe('<FagsakSearch>', () => {
    it('skal kun vise søkefelt før søk er startet', () => {
        const searchFagsakFunction = sinon.spy();
        const wrapper = shallow(
            <FagsakSearch
                resultat={[]}
                searchFagsakCallback={searchFagsakFunction}
                selectOppgaveCallback={sinon.spy()}
                searchResultReceived={false}
                spinner
                searchStarted
                resetSearch={sinon.spy()}
            />,
        );

        expect(wrapper.find(SearchForm)).to.have.length(1);
        expect(wrapper.find(PersonInfo)).to.have.length(0);
        expect(wrapper.find(FagsakList)).to.have.length(0);
    });
});
