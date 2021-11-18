import React from 'react';
import { expect } from 'chai';
import { IntlShape } from 'react-intl';
import ReactECharts from 'sharedComponents/echart/ReactEcharts';
import behandlingType from 'kodeverk/behandlingType';
import moment from 'moment';
import { shallowWithIntl, intlMock } from '../../../../../../../../setup/testHelpers/intl-enzyme-test-helper';

import NyeOgFerdigstilteOppgaverForIdagGraf from './NyeOgFerdigstilteOppgaverForIdagGraf';

describe('<NyeOgFerdigstilteOppgaverForIdagGraf>', () => {
  const intl: Partial<IntlShape> = {
    ...intlMock,
  };

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
      height={200}
      behandlingTyper={[]}
      nyeOgFerdigstilteOppgaver={[]}
      skalPunsjbehandlingerVises={false}
    />);

    const graf = wrapper.find(ReactECharts);
    expect(graf).to.have.length(1);
  });
});
