import React from 'react';
import { expect } from 'chai';
import { IntlShape } from 'react-intl';
import ReactECharts from 'sharedComponents/echart/ReactEcharts';
import { shallowWithIntl, intlMock } from '../../../../../../../../setup/testHelpers/intl-enzyme-test-helper';

import NyeOgFerdigstilteOppgaverForSisteSyvGraf from './NyeOgFerdigstilteOppgaverForSisteSyvGraf';

describe('<NyeOgFerdigstilteOppgaverForSisteSyvGraf>', () => {
  const intl: Partial<IntlShape> = {
    ...intlMock,
  };

  it('skal vise ReactEchartGraf', () => {
    const wrapper = shallowWithIntl(<NyeOgFerdigstilteOppgaverForSisteSyvGraf.WrappedComponent
      intl={intl as IntlShape}
      height={200}
      nyeOgFerdigstilteOppgaver={[]}
    />);

    const graf = wrapper.find(ReactECharts);
    expect(graf).to.have.length(1);
  });
});
