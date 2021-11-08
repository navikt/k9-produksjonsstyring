import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { Form } from 'react-final-form';

import behandlingType from 'kodeverk/behandlingType';
import fagsakYtelseType from 'kodeverk/fagsakYtelseType';
import kodeverkTyper from 'kodeverk/kodeverkTyper';
import { punsjKodeverkNavn } from 'avdelingsleder/nokkeltall/nokkeltallUtils';
import RestApiTestMocker from '../../../../../../../setup/testHelpers/RestApiTestMocker';
import { shallowWithIntl } from '../../../../../../../setup/testHelpers/intl-enzyme-test-helper';
import { FordelingAvBehandlingstypePanel } from './FordelingAvBehandlingstypePanel';
import FordelingAvBehandlingstypeGraf from './FordelingAvBehandlingstypeGraf';

describe('<FordelingAvBehandlingstypePanel>', () => {
  const fagsakYtelseTyper = [{
    kode: fagsakYtelseType.PLEIEPENGER_SYKT_BARN,
    navn: 'Pleiepenger sykt barn',
  }, {
    kode: fagsakYtelseType.OMSORGSPENGER,
    navn: 'Omsorgspenger',
  },
  {
    kode: fagsakYtelseType.OMSORGSDAGER_ALENEOMOMSORGEN,
    navn: 'Omsorgsdager',
  }];

  const behandlingTyper = [{
    kode: behandlingType.FORSTEGANGSSOKNAD,
    navn: 'Førstegangssøknad',
  }, {
    kode: behandlingType.KLAGE,
    navn: 'Klage',
  }, {
    kode: behandlingType.INNSYN,
    navn: 'Dokumentinnsyn',
  }, {
    kode: behandlingType.REVURDERING,
    navn: 'Revurdering',
  }, {
    kode: behandlingType.ANKE,
    navn: 'Anke',
  }];

  const forstegangssoknad = {
    kode: behandlingType.FORSTEGANGSSOKNAD,
    navn: 'Førstegangssøknad',
  };
  const punsjsoknad = {
    kode: behandlingType.INNLOGGET_CHAT,
    kodeverk: punsjKodeverkNavn,
    navn: 'Førstegangssøknad',
  };

  const alleOppgaver = [{
    fagsakYtelseType: fagsakYtelseTyper[0],
    behandlingType: forstegangssoknad,
    tilBehandling: true,
    antall: 1,
  }, {
    fagsakYtelseType: fagsakYtelseTyper[1],
    behandlingType: forstegangssoknad,
    tilBehandling: true,
    antall: 1,
  },
  {
    fagsakYtelseType: fagsakYtelseTyper[2],
    behandlingType: forstegangssoknad,
    tilBehandling: true,
    antall: 1,
  },
  {
    fagsakYtelseType: fagsakYtelseTyper[0],
    behandlingType: punsjsoknad,
    tilBehandling: true,
    antall: 1,
  }];

  it('skal filtrere omsorgspenger', () => {
    const valuesMock = {
      valgtYtelseType: fagsakYtelseType.OMSORGSPENGER,
    };

    new RestApiTestMocker()
      .withKodeverk(kodeverkTyper.BEHANDLING_TYPE, behandlingTyper)
      .withKodeverk(kodeverkTyper.FAGSAK_YTELSE_TYPE, fagsakYtelseTyper)
      .runTest(() => {
        const wrapper = shallowWithIntl(<FordelingAvBehandlingstypePanel
          alleOppgaver={alleOppgaver}
          getValueFromLocalStorage={sinon.spy()}
          // @ts-ignore
        />).find(Form).renderProp('render')({ values: valuesMock });

        const graf = wrapper.find(FordelingAvBehandlingstypeGraf);
        expect(graf).to.have.length(1);
        expect(graf.prop('alleOppgaver')).is.eql([alleOppgaver[1]]);
      });
  });

  it('skal filtrere pleiepenger', () => {
    const valuesMock = {
      valgtYtelseType: fagsakYtelseType.PLEIEPENGER_SYKT_BARN,
    };

    new RestApiTestMocker()
      .withKodeverk(kodeverkTyper.BEHANDLING_TYPE, behandlingTyper)
      .withKodeverk(kodeverkTyper.FAGSAK_YTELSE_TYPE, fagsakYtelseTyper)
      .runTest(() => {
        const wrapper = shallowWithIntl(<FordelingAvBehandlingstypePanel
          alleOppgaver={alleOppgaver}
          getValueFromLocalStorage={sinon.spy()}
          // @ts-ignore
        />).find(Form).renderProp('render')({ values: valuesMock });

        const graf = wrapper.find(FordelingAvBehandlingstypeGraf);
        expect(graf).to.have.length(1);
        expect(graf.prop('alleOppgaver')).is.eql([alleOppgaver[0]]);
      });
  });

  it('skal filtrere omsorgsdager', () => {
    const valuesMock = {
      valgtYtelseType: fagsakYtelseType.OMSORGSDAGER,
    };

    new RestApiTestMocker()
      .withKodeverk(kodeverkTyper.BEHANDLING_TYPE, behandlingTyper)
      .withKodeverk(kodeverkTyper.FAGSAK_YTELSE_TYPE, fagsakYtelseTyper)
      .runTest(() => {
        const wrapper = shallowWithIntl(<FordelingAvBehandlingstypePanel
          alleOppgaver={alleOppgaver}
          getValueFromLocalStorage={sinon.spy()}
          // @ts-ignore
        />).find(Form).renderProp('render')({ values: valuesMock });

        const graf = wrapper.find(FordelingAvBehandlingstypeGraf);
        expect(graf).to.have.length(1);
        expect(graf.prop('alleOppgaver')).is.eql([alleOppgaver[2]]);
      });
  });

  it('skal filtrere punsj', () => {
    const valuesMock = {
      valgtYtelseType: fagsakYtelseType.PUNSJ,
    };

    new RestApiTestMocker()
      .withKodeverk(kodeverkTyper.BEHANDLING_TYPE, behandlingTyper)
      .withKodeverk(kodeverkTyper.FAGSAK_YTELSE_TYPE, fagsakYtelseTyper)
      .runTest(() => {
        const wrapper = shallowWithIntl(<FordelingAvBehandlingstypePanel
          alleOppgaver={alleOppgaver}
          getValueFromLocalStorage={sinon.spy()}
          // @ts-ignore
        />).find(Form).renderProp('render')({ values: valuesMock });

        const graf = wrapper.find(FordelingAvBehandlingstypeGraf);
        expect(graf).to.have.length(1);
        expect(graf.prop('alleOppgaver')).is.eql([alleOppgaver[3]]);
      });
  });
});
