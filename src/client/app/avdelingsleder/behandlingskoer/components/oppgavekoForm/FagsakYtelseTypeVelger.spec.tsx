import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { shallow } from 'enzyme';

import fagsakYtelseType from 'kodeverk/fagsakYtelseType';
import { RadioOption, RadioGroupField } from 'form/FinalFields';
import { FagsakYtelseTypeVelger } from './FagsakYtelseTypeVelger';

describe('<FagsakYtelseTypeVelger>', () => {
  it('skal vise checkboxer for ytelsetyper', () => {
    const fagsakYtelseTyper = [{
      kode: fagsakYtelseType.OMSORGSPENGER,
      navn: 'Engangsstønad',
    }, {
      kode: fagsakYtelseType.PLEIEPENGER_SYKT_BARN,
      navn: 'Svangerskapspenger',
    }];

    const wrapper = shallow(<FagsakYtelseTypeVelger
      fagsakYtelseTyper={fagsakYtelseTyper}
      valgtOppgavekoId="1"
      lagreOppgavekoFagsakYtelseType={sinon.spy()}
    />);

    const radios = wrapper.find(RadioOption);
    expect(radios).to.have.length(3);
    expect(radios.first().prop('value')).to.eql(fagsakYtelseType.OMSORGSPENGER);
    expect(radios.at(1).prop('value')).to.eql(fagsakYtelseType.PLEIEPENGER_SYKT_BARN);
    expect(radios.last().prop('value')).to.eql('');
  });

  it('skal lagre ytelsetype ved klikk på checkbox', () => {
    const fagsakYtelseTyper = [{
      kode: fagsakYtelseType.OMSORGSPENGER,
      navn: 'Engangsstønad',
    }];
    const lagreYtelseTypeFn = sinon.spy();

    const wrapper = shallow(<FagsakYtelseTypeVelger
      fagsakYtelseTyper={fagsakYtelseTyper}
      valgtOppgavekoId="1"
      lagreOppgavekoFagsakYtelseType={lagreYtelseTypeFn}
    />);

    const radioGroup = wrapper.find(RadioGroupField);
    radioGroup.prop('onChange')(fagsakYtelseType.OMSORGSPENGER);

    expect(lagreYtelseTypeFn.calledOnce).to.be.true;
    const { args } = lagreYtelseTypeFn.getCalls()[0];
    expect(args).to.have.length(2);
    expect(args[0]).to.eql('1');
    expect(args[1]).to.eql(fagsakYtelseType.OMSORGSPENGER);
  });
});
