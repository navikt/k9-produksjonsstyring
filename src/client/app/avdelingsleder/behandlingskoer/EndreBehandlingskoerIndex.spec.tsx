import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';

import EndreOppgavekoerPanel from './components/EndreOppgavekoerPanel';
import { EndreBehandlingskoerIndex } from './EndreBehandlingskoerIndex';

describe('<EndreBehandlingskoerIndex>', () => {
  it('skal hente oppgavekøer når oppgavekø-fanen blir valgt', () => {
    const fetchAvdelingensOppgavekoerFn = sinon.spy();
    const fetchAvdelingensSaksbehandlereFn = sinon.spy();
    const wrapper = shallow(<EndreBehandlingskoerIndex
      fetchAlleOppgavekoer={fetchAvdelingensOppgavekoerFn}
      setValgtOppgavekoId={sinon.spy()}
      lagNyOppgaveko={sinon.spy()}
      fjernOppgaveko={sinon.spy()}
      fetchOppgaveko={sinon.spy()}
      fetchDagensTall={sinon.spy()}
      lagreOppgavekoNavn={sinon.spy()}
      lagreOppgavekoBehandlingstype={sinon.spy()}
      lagreOppgavekoFagsakYtelseType={sinon.spy()}
      lagreOppgavekoAndreKriterier={sinon.spy()}
      lagreOppgavekoSkjermet={sinon.spy()}
      knyttSaksbehandlerTilOppgaveko={sinon.spy()}
      fetchAlleSaksbehandlere={fetchAvdelingensSaksbehandlereFn}
      fetchAntallOppgaverForOppgaveko={sinon.spy()}
      fetchAntallOppgaverTotalt={sinon.spy()}
    />);

    expect(wrapper.find(EndreOppgavekoerPanel)).to.have.length(1);
    expect(fetchAvdelingensOppgavekoerFn.calledOnce).to.be.true;
    expect(fetchAvdelingensSaksbehandlereFn.calledOnce).to.be.true;
  });
});
