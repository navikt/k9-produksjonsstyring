import React from 'react';
import { IntlShape } from 'react-intl';
import { expect } from 'chai';
import moment from 'moment';
import sinon from 'sinon';
import * as useKodeverk from 'api/rest-api-hooks/src/global-data/useKodeverk';
import behandlingType from 'kodeverk/behandlingType';
import kodeverkTyper from 'kodeverk/kodeverkTyper';
import ReactECharts from 'sharedComponents/echart/ReactEcharts';
import { intlMock, shallowWithIntl } from '../../../../../../../../setup/testHelpers/intl-enzyme-test-helper';
import NyeOgFerdigstilteOppgaverForIdagGraf from './NyeOgFerdigstilteOppgaverForIdagGraf';

describe('<NyeOgFerdigstilteOppgaverForIdagGraf>', () => {
  const intl: IntlShape = {
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
    contextStub
      .withArgs(kodeverkTyper.BEHANDLING_TYPE)
      .callsFake(() => behandlingTyper)
      .withArgs(kodeverkTyper.FAGSAK_YTELSE_TYPE)
      .callsFake(() => useKodeverk);
  });

  afterEach(() => {
    contextStub.restore();
  });

  const nyeOgFerdigstilteOppgaver = [
    {
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
    },
  ];

  it('skal vise ReactEchartGraf', () => {
    const wrapper = shallowWithIntl(
      <NyeOgFerdigstilteOppgaverForIdagGraf.WrappedComponent
        intl={intl}
        behandlingTyper={[]}
        nyeOgFerdigstilteOppgaver={nyeOgFerdigstilteOppgaver}
        skalPunsjbehandlingerVises={false}
      />,
    );

    const graf = wrapper.find(ReactECharts);
    expect(graf).to.have.length(1);
  });
});
