import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { shallow } from 'enzyme';

import behandlingType from 'kodeverk/behandlingType';
import { CheckboxField } from 'form/FinalFields';
import { BehandlingstypeVelger } from './BehandlingstypeVelger';

describe('<BehandlingstypeVelger>', () => {
  it('skal vise checkboxer for behandlingstyper', () => {
    const behandlingTyper = [{
      kode: behandlingType.FORSTEGANGSSOKNAD,
      navn: 'Førstegangssøknad',
    }, {
      kode: behandlingType.REVURDERING,
      navn: 'Klage',
    }];

    const wrapper = shallow(<BehandlingstypeVelger
      behandlingTyper={behandlingTyper}
      valgtOppgavekoId="1"
      lagreOppgavekoBehandlingstype={sinon.spy()}
    />);

    const checkboxer = wrapper.find(CheckboxField);
    expect(checkboxer).to.have.length(2);
    expect(checkboxer.first().prop('name')).to.eql(behandlingType.FORSTEGANGSSOKNAD);
    expect(checkboxer.last().prop('name')).to.eql(behandlingType.REVURDERING);
  });

  it('skal lagre behandlingstype ved klikk på checkbox', () => {
    const behandlingTyper = [{
      kode: behandlingType.FORSTEGANGSSOKNAD,
      navn: 'Førstegangssøknad',
    }];
    const lagreBehandlingTypeFn = sinon.spy();

    const wrapper = shallow(<BehandlingstypeVelger
      behandlingTyper={behandlingTyper}
      valgtOppgavekoId="1"
      lagreOppgavekoBehandlingstype={lagreBehandlingTypeFn}
    />);

    const checkbox = wrapper.find(CheckboxField);
    checkbox.prop('onChange')(true);

    expect(lagreBehandlingTypeFn.calledOnce).to.be.true;
    const { args } = lagreBehandlingTypeFn.getCalls()[0];
    expect(args).to.have.length(3);
    expect(args[0]).to.eql('1');
    expect(args[1]).to.eql(behandlingTyper[0]);
    expect(args[2]).is.true;
  });
});
