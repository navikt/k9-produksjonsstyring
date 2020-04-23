import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { shallow } from 'enzyme';

import andreKriterierType from 'kodeverk/andreKriterierType';
import { CheckboxField, RadioGroupField, RadioOption } from 'form/FinalFields';
import { AndreKriterierVelger } from './AndreKriterierVelger';

describe('<AndreKriterierVelger>', () => {
  const andreKriterierTyper = [{
    kode: andreKriterierType.TIL_BESLUTTER,
    navn: 'Til beslutter',
  }, {
    kode: andreKriterierType.REGISTRER_PAPIRSOKNAD,
    navn: 'Registrer papirsøknad',
  }];

  it('skal vise checkbox for Til beslutter', () => {
    const wrapper = shallow(<AndreKriterierVelger
      valgtOppgavekoId="1"
      lagreOppgavekoAndreKriterier={sinon.spy()}
      andreKriterierTyper={andreKriterierTyper}
      values={{}}
    />);

    const checkboxer = wrapper.find(CheckboxField);
    expect(checkboxer).to.have.length(2);
    const tilBeslutterCheckbox = checkboxer.first();
    expect(tilBeslutterCheckbox.prop('name')).to.eql(andreKriterierType.TIL_BESLUTTER);

    expect(wrapper.find(RadioGroupField)).to.have.length(0);
    expect(wrapper.find(RadioOption)).to.have.length(0);
  });

  it('skal vise checkbox for Registrere papirsøknad', () => {
    const wrapper = shallow(<AndreKriterierVelger
      valgtOppgavekoId="1"
      lagreOppgavekoAndreKriterier={sinon.spy()}
      andreKriterierTyper={andreKriterierTyper}
      values={{}}
    />);

    const checkboxer = wrapper.find(CheckboxField);
    expect(checkboxer).to.have.length(2);
    const tilBeslutterCheckbox = checkboxer.last();
    expect(tilBeslutterCheckbox.prop('name')).to.eql(andreKriterierType.REGISTRER_PAPIRSOKNAD);
  });

  it('skal lagre valgt for Til beslutter ved klikk på checkbox', () => {
    const lagreAndreKriterierFn = sinon.spy();

    const wrapper = shallow(<AndreKriterierVelger
      valgtOppgavekoId="1"
      lagreOppgavekoAndreKriterier={lagreAndreKriterierFn}
      andreKriterierTyper={andreKriterierTyper}
      values={{}}
    />);

    const checkbox = wrapper.find(CheckboxField).first();
    checkbox.prop('onChange')(true);

    expect(lagreAndreKriterierFn.calledOnce).to.be.true;
    const { args } = lagreAndreKriterierFn.getCalls()[0];
    expect(args).to.have.length(3);
    expect(args[0]).to.eql('1');
    expect(args[1].kode).to.eql(andreKriterierType.TIL_BESLUTTER);
    expect(args[2]).to.true;
  });

  it('skal lagre valgt for Registrere papirsoknad ved klikk på checkbox', () => {
    const lagreAndreKriterierFn = sinon.spy();

    const wrapper = shallow(<AndreKriterierVelger
      valgtOppgavekoId="1"
      lagreOppgavekoAndreKriterier={lagreAndreKriterierFn}
      andreKriterierTyper={andreKriterierTyper}
      values={{}}
    />);

    const checkbox = wrapper.find(CheckboxField).last();
    checkbox.prop('onChange')(true);

    expect(lagreAndreKriterierFn.calledOnce).to.be.true;
    const { args } = lagreAndreKriterierFn.getCalls()[0];
    expect(args).to.have.length(3);
    expect(args[0]).to.eql('1');
    expect(args[1].kode).to.eql(andreKriterierType.REGISTRER_PAPIRSOKNAD);
    expect(args[2]).to.true;
  });
});
