import React from 'react';
import { expect } from 'chai';
import { IntlShape } from 'react-intl';
import ReactECharts from 'sharedComponents/echart/ReactEcharts';
import behandlingType from 'kodeverk/behandlingType';
import moment from 'moment';

import * as useKodeverk from 'api/rest-api-hooks/src/global-data/useKodeverk';
import sinon from 'sinon';
import kodeverkTyper from 'kodeverk/kodeverkTyper';
import NyeOgFerdigstilteOppgaverForIdagGraf from './NyeOgFerdigstilteOppgaverForIdagGraf';
import { shallowWithIntl, intlMock } from '../../../../../../../../setup/testHelpers/intl-enzyme-test-helper';

describe('<NyeOgFerdigstilteOppgaverForIdagGraf>', () => {
  const intl: Partial<IntlShape> = {
    ...intlMock,
  };

  const behandlingTyper = [
    {
      kode: behandlingType.FORSTEGANGSSOKNAD,
      navn: 'Førstegangssøknad',
    },
  ];

  let contextStub;
  beforeEach(() => {
    contextStub = sinon.stub(useKodeverk, 'default');
    contextStub.withArgs(kodeverkTyper.BEHANDLING_TYPE).callsFake(() => behandlingTyper)
      .withArgs(kodeverkTyper.FAGSAK_YTELSE_TYPE)
      .callsFake(() => useKodeverk);
  });

  afterEach(() => {
    contextStub.restore();
  });

  const nyeOgFerdigstilteOppgaver = [{
    behandlingType: {
      kode: behandlingType.FORSTEGANGSSOKNAD,
      navn: 'Navn',
    },
    fagsakYtelseType: {
      kode: 'PSB',
      navn: 'Pleiepenger',
    },
    antallNye: 1,
    antallFerdigstilte: 6,
    antallFerdigstilteMine: 1,
    dato: moment().subtract(3, 'days').format(),
  }];

  it('skal vise ReactEchartGraf', () => {
    const wrapper = shallowWithIntl(<NyeOgFerdigstilteOppgaverForIdagGraf.WrappedComponent
      intl={intl as IntlShape}
      behandlingTyper={[]}
      nyeOgFerdigstilteOppgaver={nyeOgFerdigstilteOppgaver}
      skalPunsjbehandlingerVises={false}
    />);

    const graf = wrapper.find(ReactECharts);
    expect(graf).to.have.length(1);
  });
});
