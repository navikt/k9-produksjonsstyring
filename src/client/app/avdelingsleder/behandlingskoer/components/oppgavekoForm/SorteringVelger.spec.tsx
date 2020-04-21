import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';

import { shallowWithIntl, intlMock } from 'testHelpers/intl-enzyme-test-helper';
import KoSortering from 'kodeverk/KoSortering';
import { RadioGroupField, RadioOption } from 'form/FinalFields';
import { SorteringVelger } from './SorteringVelger';

describe('<SorteringVelger>', () => {
  it('skal vise radioknapper for alle sorteringsvalg', () => {
    const koSorteringTyper = [{
      kode: KoSortering.OPPRETT_BEHANDLING,
      navn: 'opprett',
    }, {
      kode: KoSortering.FORSTE_STONADSDAG,
      navn: 'frist',
    }];

    const wrapper = shallowWithIntl(<SorteringVelger
      intl={intlMock}
      koSorteringTyper={koSorteringTyper}
      valgtOppgavekoId="1"
      lagreOppgavekoSortering={sinon.spy()}
      lagreOppgavekoSorteringErDynamiskPeriode={sinon.spy()}
      lagreOppgavekoSorteringTidsintervallDato={sinon.spy()}
    />);

    const options = wrapper.find(RadioOption);
    expect(options).to.have.length(2);
    expect(options.first().prop('value')).to.eql(KoSortering.OPPRETT_BEHANDLING);
    expect(options.last().prop('value')).to.eql(KoSortering.FORSTE_STONADSDAG);
  });

  it('skal lagre sortering ved klikk på radioknapp', () => {
    const koSorteringTyper = [{
      kode: KoSortering.OPPRETT_BEHANDLING,
      navn: 'opprett',
    }, {
      kode: KoSortering.FORSTE_STONADSDAG,
      navn: 'frist',
    }];
    const lagreSorteringFn = sinon.spy();

    const wrapper = shallowWithIntl(<SorteringVelger
      intl={intlMock}
      koSorteringTyper={koSorteringTyper}
      valgtOppgavekoId="1"
      lagreOppgavekoSortering={lagreSorteringFn}
      lagreOppgavekoSorteringErDynamiskPeriode={sinon.spy()}
      lagreOppgavekoSorteringTidsintervallDato={sinon.spy()}
    />);

    const felt = wrapper.find(RadioGroupField);
    felt.prop('onChange')(KoSortering.OPPRETT_BEHANDLING);

    expect(lagreSorteringFn.calledOnce).to.be.true;
    const { args } = lagreSorteringFn.getCalls()[0];
    expect(args).to.have.length(2);
    expect(args[0]).to.eql('1');
    expect(args[1]).to.eql(KoSortering.OPPRETT_BEHANDLING);
  });
});
