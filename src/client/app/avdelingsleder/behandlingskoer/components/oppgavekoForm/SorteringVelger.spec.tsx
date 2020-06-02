import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { IntlShape } from 'react-intl';

import { shallowWithIntl, intlMock } from 'testHelpers/intl-enzyme-test-helper';
import KoSortering from 'kodeverk/KoSortering';
import { RadioGroupField, RadioOption } from 'form/FinalFields';
import kodeverkTyper from 'kodeverk/kodeverkTyper';
import SorteringVelger from './SorteringVelger';

describe('<SorteringVelger>', () => {
  const intl: Partial<IntlShape> = {
    ...intlMock,
  };
  it('skal vise radioknapper for alle sorteringsvalg', () => {
    const alleKodeverk = {
      [kodeverkTyper.KO_SORTERING]: [{
        kode: KoSortering.OPPRETT_BEHANDLING,
        navn: 'opprett',
        felttype: '',
        feltkategori: '',
      }, {
        kode: KoSortering.FORSTE_STONADSDAG,
        navn: 'frist',
        felttype: '',
        feltkategori: '',
      }],
    };

    const wrapper = shallowWithIntl(<SorteringVelger.WrappedComponent
      intl={intl as IntlShape}
      alleKodeverk={alleKodeverk}
      valgtOppgavekoId="1"
      lagreOppgavekoSortering={sinon.spy()}
      lagreOppgavekoSorteringTidsintervallDato={sinon.spy()}
      valgteBehandlingtyper={[]}
    />);

    const options = wrapper.find(RadioOption);
    expect(options).to.have.length(2);
    expect(options.first().prop('value')).to.eql(KoSortering.OPPRETT_BEHANDLING);
    expect(options.last().prop('value')).to.eql(KoSortering.FORSTE_STONADSDAG);
  });

  it('skal lagre sortering ved klikk på radioknapp', () => {
    const alleKodeverk = {
      [kodeverkTyper.KO_SORTERING]: [{
        kode: KoSortering.OPPRETT_BEHANDLING,
        navn: 'opprett',
        felttype: '',
        feltkategori: '',
      }, {
        kode: KoSortering.FORSTE_STONADSDAG,
        navn: 'frist',
        felttype: '',
        feltkategori: '',
      }],
    };
    const lagreSorteringFn = sinon.spy();

    const wrapper = shallowWithIntl(<SorteringVelger.WrappedComponent
      intl={intl as IntlShape}
      alleKodeverk={alleKodeverk}
      valgtOppgavekoId="1"
      lagreOppgavekoSortering={lagreSorteringFn}
      lagreOppgavekoSorteringTidsintervallDato={sinon.spy()}
      valgteBehandlingtyper={[]}
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
