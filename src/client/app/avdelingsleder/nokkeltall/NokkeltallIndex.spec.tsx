import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';

import { NokkeltallIndex } from './NokkeltallIndex';
import NokkeltallPanel from './components/NokkeltallPanel';

describe('<NokkeltallIndex>', () => {
  it('skal hente statistikk ved lasting av komponent', () => {
    const fetchAlleOppgaverFn = sinon.spy();
    const fetchOppgaverPerDatoFn = sinon.spy();
    const fetchFerdigstilteOppgaverFn = sinon.spy();
    const fetchFerdigstilteHistorikkFn = sinon.spy();
    const fetchNyePerDatoFn = sinon.spy();
    const fetchNyeOgFerdigstilteFn = sinon.spy();

    const wrapper = shallow(<NokkeltallIndex
      fetchAlleOppgaver={fetchAlleOppgaverFn}
      fetchOppgaverPerDato={fetchOppgaverPerDatoFn}
      fetchFerdigstilteOppgaver={fetchFerdigstilteOppgaverFn}
      fetchFerdigstiltePerDato={fetchFerdigstilteHistorikkFn}
      fetchNyePerDato={fetchNyePerDatoFn}
      fetchNyeOgFerdigstilte={fetchNyeOgFerdigstilteFn}
    />);

    expect(wrapper.find(NokkeltallPanel)).to.have.length(1);

    expect(fetchAlleOppgaverFn.calledOnce).to.be.true;
    expect(fetchOppgaverPerDatoFn.calledOnce).to.be.true;
    expect(fetchFerdigstilteOppgaverFn.calledOnce).to.be.true;
    expect(fetchFerdigstilteHistorikkFn.calledOnce).to.be.true;
    expect(fetchNyePerDatoFn.calledOnce).to.be.true;
  });
});
