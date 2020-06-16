import React from 'react';
import { expect } from 'chai';

import { Form } from 'react-final-form';

import { shallowWithIntl } from 'testHelpers/intl-enzyme-test-helper';
import behandlingType from 'kodeverk/behandlingType';
import { RadioOption } from 'form/FinalFields';
import fagsakYtelseType from 'kodeverk/fagsakYtelseType';
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

    const wrapper = shallowWithIntl(<FordelingAvBehandlingstypePanel
      width={300}
      height={200}
      fagsakYtelseTyper={fagsakYtelseTyper}
      behandlingTyper={behandlingTyper}
      alleOppgaver={alleOppgaver}
      initialValues={{ valgtYtelseType: valuesMock.valgtYtelseType }}
      // @ts-ignore
    />).find(Form).renderProp('render')({ values: valuesMock });

    const radioOptions = wrapper.find(RadioOption);
    expect(radioOptions).to.have.length(4);
    expect(radioOptions.first().prop('value')).to.eql('FP');
    expect(radioOptions.first().prop('label')).to.eql('Foreldrepenger');
    expect(radioOptions.at(1).prop('value')).to.eql('ES');
    expect(radioOptions.at(1).prop('label')).to.eql('Engangsstønad');
    expect(radioOptions.last().prop('value')).to.eql('ALLE');
  });


  it('skal filtrere bort engangsstønader', () => {
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

    const wrapper = shallowWithIntl(<FordelingAvBehandlingstypePanel
      width={300}
      height={200}
      behandlingTyper={behandlingTyper}
      fagsakYtelseTyper={fagsakYtelseTyper}
      alleOppgaver={alleOppgaver}
      initialValues={{ valgtYtelseType: valuesMock.valgtYtelseType }}
      // @ts-ignore
    />).find(Form).renderProp('render')({ values: valuesMock });

    const graf = wrapper.find(FordelingAvBehandlingstypeGraf);
    expect(graf).to.have.length(1);
    expect(graf.prop('alleOppgaver')).is.eql([alleOppgaver[1]]);
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

    const wrapper = shallowWithIntl(<FordelingAvBehandlingstypePanel
      width={300}
      height={200}
      behandlingTyper={behandlingTyper}
      fagsakYtelseTyper={fagsakYtelseTyper}
      alleOppgaver={alleOppgaver}
      initialValues={{ valgtYtelseType: valuesMock.valgtYtelseType }}
      // @ts-ignore
    />).find(Form).renderProp('render')({ values: valuesMock });

    const graf = wrapper.find(FordelingAvBehandlingstypeGraf);
    expect(graf).to.have.length(1);
    expect(graf.prop('alleOppgaver')).is.eql([alleOppgaver[0]]);
  });
});
