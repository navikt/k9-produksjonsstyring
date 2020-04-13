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
      fetchAvdelingensOppgavekoer={fetchAvdelingensOppgavekoerFn}
      setValgtOppgavekoId={sinon.spy()}
      lagNyOppgaveko={sinon.spy()}
      fjernOppgaveko={sinon.spy()}
      lagreOppgavekoNavn={sinon.spy()}
      lagreOppgavekoBehandlingstype={sinon.spy()}
      lagreOppgavekoFagsakYtelseType={sinon.spy()}
      lagreOppgavekoAndreKriterier={sinon.spy()}
      knyttSaksbehandlerTilOppgaveko={sinon.spy()}
      fetchAvdelingensSaksbehandlere={fetchAvdelingensSaksbehandlereFn}
      valgtAvdelingEnhet="1"
      fetchAntallOppgaverForOppgaveko={sinon.spy()}
      fetchAntallOppgaverForAvdeling={sinon.spy()}
    />);

    expect(wrapper.find(EndreOppgavekoerPanel)).to.have.length(1);
    expect(fetchAvdelingensOppgavekoerFn.calledOnce).to.be.true;
    expect(fetchAvdelingensSaksbehandlereFn.calledOnce).to.be.true;
  });
});
