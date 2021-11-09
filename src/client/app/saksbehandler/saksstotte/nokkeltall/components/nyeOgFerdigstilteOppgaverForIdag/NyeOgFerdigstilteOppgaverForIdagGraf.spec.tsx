import React from 'react';
import { expect } from 'chai';
import { IntlShape } from 'react-intl';
import ReactECharts from 'sharedComponents/echart/ReactEcharts';
import { shallowWithIntl, intlMock } from '../../../../../../../../setup/testHelpers/intl-enzyme-test-helper';

import NyeOgFerdigstilteOppgaverForIdagGraf from './NyeOgFerdigstilteOppgaverForIdagGraf';

describe('<NyeOgFerdigstilteOppgaverForIdagGraf>', () => {
  const intl: Partial<IntlShape> = {
    ...intlMock,
  };

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
