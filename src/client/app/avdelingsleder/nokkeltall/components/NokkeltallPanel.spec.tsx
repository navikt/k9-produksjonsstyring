import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import FerdigstiltePanel from 'avdelingsleder/nokkeltall/components/dagensTallPanel/InngangOgFerdigstiltePanel';
import NyeHistorikkPanel from 'avdelingsleder/nokkeltall/components/nyeHistorikk/NyeHistorikkPanel';
import FerdigstilteHistorikkPanel from 'avdelingsleder/nokkeltall/components/ferdigstilteHistorikk/FerdigstilteHistorikkPanel';
import BeholdningHistorikkPanel from 'avdelingsleder/nokkeltall/components/beholdningHistorikk/BeholdningHistorikkPanel';
import BehandlingerGårAvVent from 'avdelingsleder/nokkeltall/components/behandlingerGårAvVent/BehandlingerGårAvVent';
import FordelingAvBehandlingstypePanel from './fordelingAvBehandlingstype/FordelingAvBehandlingstypePanel';
import NokkeltallPanel from './NokkeltallPanel';

describe('<NokkeltallPanel>', () => {
  it('skal vise grafpaneler', () => {
    const wrapper = shallow(<NokkeltallPanel
      alleOppgaver={[]}
      ferdigstiltePerDato={[]}
      behandlingerSomGårAvVent={[]}
    />);

    expect(wrapper.find(FerdigstiltePanel)).to.have.length(1);
    expect(wrapper.find(NyeHistorikkPanel)).to.have.length(1);
    expect(wrapper.find(FerdigstilteHistorikkPanel)).to.have.length(1);
    expect(wrapper.find(BeholdningHistorikkPanel)).to.have.length(1);
    expect(wrapper.find(FordelingAvBehandlingstypePanel)).to.have.length(1);
    expect(wrapper.find(BehandlingerGårAvVent)).to.have.length(1);
  });
});
