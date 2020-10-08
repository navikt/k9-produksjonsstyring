import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { Form } from 'react-final-form';

import { shallowWithIntl } from 'testHelpers/intl-enzyme-test-helper';
import behandlingType from 'kodeverk/behandlingType';
import { RadioOption } from 'form/FinalFields';
import fagsakYtelseType from 'kodeverk/fagsakYtelseType';
import RestApiTestMocker from 'testHelpers/RestApiTestMocker';
import kodeverkTyper from 'kodeverk/kodeverkTyper';
import { FordelingAvBehandlingstypePanel } from './FordelingAvBehandlingstypePanel';
import FordelingAvBehandlingstypeGraf from './FordelingAvBehandlingstypeGraf';

describe('<FordelingAvBehandlingstypePanel>', () => {
  const fagsakYtelseTyper = [{
    kode: fagsakYtelseType.PLEIEPENGER_SYKT_BARN,
    navn: 'Pleiepenger sykt barn',
  }, {
    kode: fagsakYtelseType.OMSORGSPENGER,
    navn: 'Omsorgspenger',
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

  it('skal vise ytelsetyper i radioknapper', () => {
    const valuesMock = {
      valgtYtelseType: 'ALLE',
    };
    const alleOppgaver = [];

    new RestApiTestMocker()
      .withKodeverk(kodeverkTyper.BEHANDLING_TYPE, behandlingTyper)
      .withKodeverk(kodeverkTyper.FAGSAK_YTELSE_TYPE, fagsakYtelseTyper)
      .runTest(() => {
        const wrapper = shallowWithIntl(<FordelingAvBehandlingstypePanel
          width={300}
          height={200}
          alleOppgaver={alleOppgaver}
          getValueFromLocalStorage={sinon.spy()}
        />).find(Form).renderProp('render')({ values: valuesMock });

        const radioOptions = wrapper.find(RadioOption);
        expect(radioOptions).to.have.length(3);
        expect(radioOptions.first().prop('value')).to.eql('OMP');
        expect(radioOptions.first().prop('label')).to.eql('Omsorgspenger');
        expect(radioOptions.at(1).prop('value')).to.eql('PSB');
        expect(radioOptions.at(1).prop('label')).to.eql('Pleiepenger sykt barn');
        expect(radioOptions.last().prop('value')).to.eql('ALLE');
      });
  });

  it('skal filtrere bort pleiepenger', () => {
    const valuesMock = {
      valgtYtelseType: fagsakYtelseType.OMSORGSPENGER,
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
    }];

    new RestApiTestMocker()
      .withKodeverk(kodeverkTyper.BEHANDLING_TYPE, behandlingTyper)
      .withKodeverk(kodeverkTyper.FAGSAK_YTELSE_TYPE, fagsakYtelseTyper)
      .runTest(() => {
        const wrapper = shallowWithIntl(<FordelingAvBehandlingstypePanel
          width={300}
          height={200}
          alleOppgaver={alleOppgaver}
          getValueFromLocalStorage={sinon.spy()}
        />).find(Form).renderProp('render')({ values: valuesMock });

        const graf = wrapper.find(FordelingAvBehandlingstypeGraf);
        expect(graf).to.have.length(1);
        expect(graf.prop('alleOppgaver')).is.eql([alleOppgaver[1]]);
      });
  });

  it('skal filtrere bort omsorgspenger', () => {
    const valuesMock = {
      valgtYtelseType: fagsakYtelseType.OMSORGSPENGER,
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
    }];

    new RestApiTestMocker()
      .withKodeverk(kodeverkTyper.BEHANDLING_TYPE, behandlingTyper)
      .withKodeverk(kodeverkTyper.FAGSAK_YTELSE_TYPE, fagsakYtelseTyper)
      .runTest(() => {
        const wrapper = shallowWithIntl(<FordelingAvBehandlingstypePanel
          width={300}
          height={200}
          alleOppgaver={alleOppgaver}
          getValueFromLocalStorage={sinon.spy()}
        />).find(Form).renderProp('render')({ values: valuesMock });

        const graf = wrapper.find(FordelingAvBehandlingstypeGraf);
        expect(graf).to.have.length(1);
        expect(graf.prop('alleOppgaver')).is.eql([alleOppgaver[1]]);
      });
  });
});
