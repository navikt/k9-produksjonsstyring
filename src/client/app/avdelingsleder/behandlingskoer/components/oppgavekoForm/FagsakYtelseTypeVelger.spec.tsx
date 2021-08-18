import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { shallow } from 'enzyme';

import fagsakYtelseType from 'kodeverk/fagsakYtelseType';
import kodeverkTyper from 'kodeverk/kodeverkTyper';
import RestApiTestMocker from 'testHelpers/RestApiTestMocker';
import { K9LosApiKeys } from 'api/k9LosApi';
import FagsakYtelseTypeVelger from './FagsakYtelseTypeVelger';

describe('<FagsakYtelseTypeVelger>', () => {
  const fagsakYtelseTyper = [{
    kode: fagsakYtelseType.OMSORGSPENGER,
    navn: 'Engangsstønad',
  }, {
    kode: fagsakYtelseType.PLEIEPENGER_SYKT_BARN,
    navn: 'Foreldrepenger',
  }];

  it('skal vise checkboxer for ytelsetyper', () => {
    new RestApiTestMocker()
      .withKodeverk(kodeverkTyper.FAGSAK_YTELSE_TYPE, fagsakYtelseTyper)
      .withDummyRunner()
      .runTest(() => {
        const wrapper = shallow(<FagsakYtelseTypeVelger
          valgtOppgavekoId="1"
          fagsakYtelseTyper={[fagsakYtelseTyper[0]]}
          hentOppgaveko={sinon.spy()}
        />);

        const radios = wrapper.find('CheckboxField');
        expect(radios).to.have.length(3);
        expect(radios.at(0).prop('name')).to.eql(fagsakYtelseType.OMSORGSPENGER);
        expect(radios.at(0).prop('checked')).to.eql(true);
        expect(radios.at(1).prop('name')).to.eql(fagsakYtelseType.OMSORGSDAGER);
        expect(radios.at(1).prop('checked')).to.eql(false);
        expect(radios.at(2).prop('name')).to.eql(fagsakYtelseType.PLEIEPENGER_SYKT_BARN);
        expect(radios.at(2).prop('checked')).to.eql(false);
      });
  });

  it('skal lagre ytelsetype ved klikk på checkboks', () => {
    const lagreYtelseTypeFn = sinon.spy();

    new RestApiTestMocker()
      .withKodeverk(kodeverkTyper.FAGSAK_YTELSE_TYPE, fagsakYtelseTyper)
      .withRestCallRunner(K9LosApiKeys.LAGRE_OPPGAVEKO_FAGSAK_YTELSE_TYPE,
        { startRequest: (params) => { lagreYtelseTypeFn(params); return Promise.resolve(); } })
      .runTest(() => {
        const wrapper = shallow(<FagsakYtelseTypeVelger
          valgtOppgavekoId="1"
          fagsakYtelseTyper={[]}
          hentOppgaveko={sinon.spy()}
        />);

        const radios = wrapper.find('CheckboxField');
        expect(radios).to.have.length(3);
        expect(radios.at(0).prop('name')).to.eql(fagsakYtelseType.OMSORGSPENGER);
        expect(radios.at(0).prop('checked')).to.eql(true);
        expect(radios.at(1).prop('name')).to.eql(fagsakYtelseType.OMSORGSDAGER);
        expect(radios.at(1).prop('checked')).to.eql(true);
        expect(radios.at(2).prop('name')).to.eql(fagsakYtelseType.PLEIEPENGER_SYKT_BARN);
        expect(radios.at(2).prop('checked')).to.eql(true);

        const radioOMP = radios.at(0);

        radioOMP.prop('onChange')(false);

        expect(lagreYtelseTypeFn.calledOnce).to.be.true;
        const { args } = lagreYtelseTypeFn.getCalls()[0];
        expect(args).to.have.length(1);
        expect(args[0].id).to.eql('1');
        expect(args[0].fagsakYtelseType).to.eql([fagsakYtelseType.OMSORGSDAGER, fagsakYtelseType.PLEIEPENGER_SYKT_BARN]);
      });
  });
});
