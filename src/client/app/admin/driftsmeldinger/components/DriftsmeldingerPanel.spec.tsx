import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';

import DriftsmeldingerPanel from './DriftsmeldingerPanel';
import LeggTilDriftsmeldingForm from './LeggTilDriftsmeldingForm';
import DriftsmeldingerTabell from './DriftsmeldingerTabell';

describe('<DriftsmeldingerPanel>', () => {
  it('skal vise tabell for driftsmeldinger og panel for å legge til flere', () => {
    const wrapper = shallow(<DriftsmeldingerPanel
      driftsmeldinger={[]}
      finnDriftsmeldinger={sinon.spy()}
      resetDriftsmeldingSok={sinon.spy()}
      leggTilDriftsmelding={sinon.spy()}
      fjernDriftsmelding={sinon.spy()}
    />);

    expect(wrapper.find(LeggTilDriftsmeldingForm)).to.have.length(1);
    expect(wrapper.find(DriftsmeldingerTabell)).to.have.length(1);
  });
});
