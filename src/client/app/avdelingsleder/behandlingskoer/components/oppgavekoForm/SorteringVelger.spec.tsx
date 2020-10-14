import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { IntlShape } from 'react-intl';

import { shallowWithIntl, intlMock } from 'testHelpers/intl-enzyme-test-helper';
import KoSortering from 'kodeverk/KoSortering';
import { RadioGroupField, RadioOption } from 'form/FinalFields';
import kodeverkTyper from 'kodeverk/kodeverkTyper';
import RestApiTestMocker from 'testHelpers/RestApiTestMocker';
import { K9LosApiKeys } from 'api/k9LosApi';
import SorteringVelger from './SorteringVelger';

describe('<SorteringVelger>', () => {
  const intl: Partial<IntlShape> = {
    ...intlMock,
  };
  const koSorteringTyper = [{
    kode: KoSortering.OPPRETT_BEHANDLING,
    navn: 'opprett',
    felttype: '',
    feltkategori: '',
  }, {
    kode: KoSortering.FORSTE_STONADSDAG,
    navn: 'frist',
    felttype: '',
    feltkategori: '',
  }];

  it('skal vise radioknapper for alle sorteringsvalg', () => {
    new RestApiTestMocker()
      .withKodeverk(kodeverkTyper.KO_SORTERING, koSorteringTyper)
      .withDummyRunner()
      .runTest(() => {
        const wrapper = shallowWithIntl(<SorteringVelger.WrappedComponent
          intl={intl as IntlShape}
          valgtOppgavekoId="1"
          valgteBehandlingtyper={[]}
          fomDato="03-08-2020"
          tomDato="19-08-2020"
          hentOppgaveko={sinon.spy()}
        />);

        const options = wrapper.find(RadioOption);
        expect(options).to.have.length(2);
        expect(options.first().prop('value')).to.eql(KoSortering.OPPRETT_BEHANDLING);
        expect(options.last().prop('value')).to.eql(KoSortering.FORSTE_STONADSDAG);
      });
  });

  it('skal lagre sortering ved klikk på radioknapp', () => {
    const lagreSorteringFn = sinon.spy();

    new RestApiTestMocker()
      .withKodeverk(kodeverkTyper.KO_SORTERING, koSorteringTyper)
      .withRestCallRunner(K9LosApiKeys.LAGRE_OPPGAVEKO_SORTERING,
        { startRequest: (params) => { lagreSorteringFn(params); return Promise.resolve(); } })
      .withRestCallRunner(K9LosApiKeys.LAGRE_OPPGAVEKO_SORTERING_TIDSINTERVALL_DATO,
        { startRequest: () => undefined })
      .runTest(() => {
        const wrapper = shallowWithIntl(<SorteringVelger.WrappedComponent
          intl={intl as IntlShape}
          valgtOppgavekoId="1"
          valgteBehandlingtyper={[]}
          fomDato="03-08-2020"
          tomDato="19-08-2020"
          hentOppgaveko={sinon.spy()}
        />);

        const felt = wrapper.find(RadioGroupField);
        felt.prop('onChange')(KoSortering.OPPRETT_BEHANDLING);

        expect(lagreSorteringFn.calledOnce).to.be.true;
        const { args } = lagreSorteringFn.getCalls()[0];
        expect(args).to.have.length(1);
        expect(args[0].id).to.eql('1');
        expect(args[0].oppgavekoSorteringValg).to.eql(KoSortering.OPPRETT_BEHANDLING);
      });
  });
});
