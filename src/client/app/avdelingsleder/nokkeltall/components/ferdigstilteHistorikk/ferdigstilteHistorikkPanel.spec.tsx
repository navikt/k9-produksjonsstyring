import React from 'react';
import { expect } from 'chai';
import dayjs from 'dayjs';
import { IntlShape } from 'react-intl';
import { Form } from 'react-final-form';
import sinon from 'sinon';

import { ISO_DATE_FORMAT } from 'utils/formats';
import kodeverkTyper from 'kodeverk/kodeverkTyper';
import * as useKodeverk from 'api/rest-api-hooks/src/global-data/useKodeverk';
import fagsakYtelseType from 'kodeverk/fagsakYtelseType';
import behandlingType from 'kodeverk/behandlingType';
import { BeholdningHistorikkPanel } from 'avdelingsleder/nokkeltall/components/beholdningHistorikk/BeholdningHistorikkPanel';
import HistorikkGraf from 'avdelingsleder/nokkeltall/HistorikkGraf';
import { intlMock, shallowWithIntl } from '../../../../../../../setup/testHelpers/intl-enzyme-test-helper';

describe('<FerdigstilteHistorikkPanel>', () => {
  const intl: IntlShape = {
    ...intlMock,
  };
  const fagsakYtelseTyper = [
    {
      kode: fagsakYtelseType.OMSORGSPENGER,
      navn: 'Omsorgspenger',
    },
    {
      kode: fagsakYtelseType.PLEIEPENGER_SYKT_BARN,
      navn: 'Pleiepenger sykt barn',
    },
    {
      kode: fagsakYtelseType.OMSORGSDAGER_KRONISKSYK,
      navn: 'Omsorgspenger',
    },
    {
      kode: fagsakYtelseType.OMSORGSDAGER_MIDLERTIDIGALENE,
      navn: 'Omsorgspenger',
    },
    {
      kode: fagsakYtelseType.OMSORGSDAGER_ALENEOMOMSORGEN,
      navn: 'Omsorgspenger',
    },
  ];

  const behandlingTyper = [
    {
      kode: behandlingType.FORSTEGANGSSOKNAD,
      navn: 'Førstegangssøknad',
    },
  ];

  const forstegangssoknad = {
    kode: behandlingType.FORSTEGANGSSOKNAD,
    navn: 'Førstegangssøknad',
  };

  let contextStub;
  beforeEach(() => {
    contextStub = sinon.stub(useKodeverk, 'default');
    contextStub.withArgs(kodeverkTyper.BEHANDLING_TYPE).callsFake(() => behandlingTyper)
      .withArgs(kodeverkTyper.FAGSAK_YTELSE_TYPE)
      .callsFake(() => fagsakYtelseTyper);
  });

  afterEach(() => {
    contextStub.restore();
  });

  it('vise historikkgrafen', () => {
    const valuesMock = {
      [fagsakYtelseType.OMSORGSPENGER]: true,
      [fagsakYtelseType.PLEIEPENGER_SYKT_BARN]: true,
      ukevalg: '2',
    };
    const beholdningPerDato = [{
      fagsakYtelseType: fagsakYtelseTyper[0],
      behandlingType: forstegangssoknad,
      dato: dayjs().format(ISO_DATE_FORMAT),
      antall: 1,
    }, {
      fagsakYtelseType: fagsakYtelseTyper[1],
      behandlingType: forstegangssoknad,
      dato: dayjs().format(ISO_DATE_FORMAT),
      antall: 1,
    }];

    const wrapper = shallowWithIntl(<BeholdningHistorikkPanel
      intl={intl}
      beholdningPerDato={beholdningPerDato}
      getValueFromLocalStorage={sinon.spy()}
      // @ts-ignore
    />).find(Form).renderProp('render')({ values: valuesMock });

    const graf = wrapper.find(HistorikkGraf);
    expect(graf).to.have.length(1);
  });
});
