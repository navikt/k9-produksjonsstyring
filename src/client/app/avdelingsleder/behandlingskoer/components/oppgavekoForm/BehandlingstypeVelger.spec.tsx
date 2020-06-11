import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { shallow } from 'enzyme';

import behandlingType from 'kodeverk/behandlingType';
import { CheckboxField } from 'form/FinalFields';
import kodeverkTyper from 'kodeverk/kodeverkTyper';
import BehandlingstypeVelger from './BehandlingstypeVelger';

const alleKodeverk = {
  [kodeverkTyper.BEHANDLING_TYPE]: [
    {
      kode: behandlingType.ANKE,
      navn: 'Anke',
    }, {
      kode: behandlingType.FORSTEGANGSSOKNAD,
      navn: 'Førstegangssøknad',
    }, {
      kode: behandlingType.INNSYN,
      navn: 'Dokumentinnsyn',
    }, {
      kode: behandlingType.KLAGE,
      navn: 'Klage',
    }, {
      kode: behandlingType.REVURDERING,
      navn: 'Revurdering',
    },
  ],
};

describe('<BehandlingstypeVelger>', () => {
  it('skal vise checkboxer for behandlingstyper', () => {
    const wrapper = shallow(<BehandlingstypeVelger
      alleKodeverk={alleKodeverk}
      valgtOppgavekoId="1"
      lagreOppgavekoBehandlingstype={sinon.spy()}
    />);

    const checkboxer = wrapper.find(CheckboxField);
    expect(checkboxer).to.have.length(5);
    expect(checkboxer.first().prop('name')).to.eql(behandlingType.ANKE);
    expect(checkboxer.last().prop('name')).to.eql(behandlingType.REVURDERING);
  });

  it('skal lagre behandlingstype ved klikk på checkbox', () => {
    const lagreBehandlingTypeFn = sinon.spy();

    const wrapper = shallow(<BehandlingstypeVelger
      alleKodeverk={alleKodeverk}
      valgtOppgavekoId="1"
      lagreOppgavekoBehandlingstype={lagreBehandlingTypeFn}
    />);

    const checkbox = wrapper.find(CheckboxField);
    checkbox.first().prop('onChange')(true);

    expect(lagreBehandlingTypeFn.calledOnce).to.be.true;
    const { args } = lagreBehandlingTypeFn.getCalls()[0];
    expect(args).to.have.length(3);
    expect(args[0]).to.eql('1');
    expect(args[1]).to.eql(alleKodeverk[kodeverkTyper.BEHANDLING_TYPE][0]);
    expect(args[2]).is.true;
  });
});
