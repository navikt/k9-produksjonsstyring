import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { shallow } from 'enzyme';

import andreKriterierType from 'kodeverk/andreKriterierType';
import { CheckboxField, RadioGroupField, RadioOption } from 'form/FinalFields';
import kodeverkTyper from 'kodeverk/kodeverkTyper';
import RestApiTestMocker from '../../../../../../../setup/testHelpers/RestApiTestMocker';
import { K9LosApiKeys } from 'api/k9LosApi';
import AndreKriterierVelger from './AndreKriterierVelger';

describe('<AndreKriterierVelger>', () => {
  const andreKriterier = [{
    kode: andreKriterierType.TIL_BESLUTTER,
    navn: 'Til beslutter',
  }, {
    kode: andreKriterierType.AVKLAR_MEDLEMSKAP,
    navn: 'Registrer papirsøknad',
  }];

  it('skal vise checkbox for Til beslutter', () => {
    new RestApiTestMocker()
      .withKodeverk(kodeverkTyper.ANDRE_KRITERIER_TYPE, andreKriterier)
      .withDummyRunner()
      .runTest(() => {
        const wrapper = shallow(<AndreKriterierVelger
          valgtOppgavekoId="1"
          values={{}}
          hentOppgaveko={sinon.spy()}
        />);

        const checkboxer = wrapper.find(CheckboxField);
        expect(checkboxer).to.have.length(2);
        const tilBeslutterCheckbox = checkboxer.first();
        expect(tilBeslutterCheckbox.prop('name')).to.eql(andreKriterierType.TIL_BESLUTTER);

        expect(wrapper.find(RadioGroupField)).to.have.length(0);
        expect(wrapper.find(RadioOption)).to.have.length(0);
      });
  });

  it('skal vise checkbox for Avklar medlemskap', () => {
    new RestApiTestMocker()
      .withKodeverk(kodeverkTyper.ANDRE_KRITERIER_TYPE, andreKriterier)
      .withDummyRunner()
      .runTest(() => {
        const wrapper = shallow(<AndreKriterierVelger
          valgtOppgavekoId="1"
          values={{}}
          hentOppgaveko={sinon.spy()}
        />);

        const checkboxer = wrapper.find(CheckboxField);
        expect(checkboxer).to.have.length(2);
        const tilBeslutterCheckbox = checkboxer.last();
        expect(tilBeslutterCheckbox.prop('name')).to.eql(andreKriterierType.AVKLAR_MEDLEMSKAP);

        expect(wrapper.find(RadioGroupField)).to.have.length(0);
        expect(wrapper.find(RadioOption)).to.have.length(0);
      });
  });

  it('skal lagre valgt for Til beslutter ved klikk på checkbox', () => {
    const lagreAndreKriterierFn = sinon.spy();

    new RestApiTestMocker()
      .withKodeverk(kodeverkTyper.ANDRE_KRITERIER_TYPE, andreKriterier)
      .withRestCallRunner(K9LosApiKeys.LAGRE_OPPGAVEKO_ANDRE_KRITERIER,
        { startRequest: (params) => { lagreAndreKriterierFn(params); return Promise.resolve(); } })
      .runTest(() => {
        const wrapper = shallow(<AndreKriterierVelger
          valgtOppgavekoId="1"
          values={{}}
          hentOppgaveko={sinon.spy()}
        />);

        const checkbox = wrapper.find(CheckboxField).first();
        checkbox.prop('onChange')(true);

        expect(lagreAndreKriterierFn.calledOnce).to.be.true;
        const { args } = lagreAndreKriterierFn.getCalls()[0];
        expect(args).to.have.length(1);
        expect(args[0].id).to.eql('1');
        expect(args[0].andreKriterierType).to.eql(andreKriterierType.TIL_BESLUTTER);
        expect(args[0].checked).to.true;
        expect(args[0].inkluder).to.true;
      });
  });

  it('skal vise radioknapper for å ta med eller fjerne', () => {
    new RestApiTestMocker()
      .withKodeverk(kodeverkTyper.ANDRE_KRITERIER_TYPE, andreKriterier)
      .withDummyRunner()
      .runTest(() => {
        const wrapper = shallow(<AndreKriterierVelger
          valgtOppgavekoId="1"
          hentOppgaveko={sinon.spy()}
          values={{
            [andreKriterierType.TIL_BESLUTTER]: true,
            [`${andreKriterierType.TIL_BESLUTTER}_inkluder`]: true,
          }}
        />);

        expect(wrapper.find(RadioGroupField)).to.have.length(1);
        expect(wrapper.find(RadioOption)).to.have.length(2);
      });
  });

  it('skal valge å fjerne inkludering av beslutter', () => {
    const lagreAndreKriterierFn = sinon.spy();
    new RestApiTestMocker()
      .withKodeverk(kodeverkTyper.ANDRE_KRITERIER_TYPE, andreKriterier)
      .withRestCallRunner(K9LosApiKeys.LAGRE_OPPGAVEKO_ANDRE_KRITERIER,
        { startRequest: (params) => { lagreAndreKriterierFn(params); return Promise.resolve(); } })
      .runTest(() => {
        const wrapper = shallow(<AndreKriterierVelger
          valgtOppgavekoId="1"
          hentOppgaveko={sinon.spy()}
          values={{
            [andreKriterierType.TIL_BESLUTTER]: true,
            [`${andreKriterierType.TIL_BESLUTTER}_inkluder`]: true,
          }}
        />);

        wrapper.find(RadioGroupField).prop('onChange')(false);

        expect(lagreAndreKriterierFn.calledOnce).to.be.true;
        const { args } = lagreAndreKriterierFn.getCalls()[0];
        expect(args).to.have.length(1);
        expect(args[0].id).to.eql('1');
        expect(args[0].andreKriterierType).to.eql(andreKriterierType.TIL_BESLUTTER);
        expect(args[0].checked).to.true;
        expect(args[0].inkluder).to.false;
      });
  });
});
