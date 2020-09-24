import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';

import GjeldendeOppgavekoerTabell from './GjeldendeOppgavekoerTabell';
import UtvalgskriterierForOppgavekoForm from './oppgavekoForm/UtvalgskriterierForOppgavekoForm';
import EndreOppgavekoerPanel from './EndreOppgavekoerPanel';

describe('<EndreOppgavekoerPanel>', () => {
  it('skal vise tabell for oppgavekoer, men ikke editeringspanel når ingen tabellrad er valgt', () => {
    const oppgavekoer = [{
      id: '1',
      navn: 'Espen Utvikler',
      sistEndret: '2017-08-31',
      erTilBeslutter: false,
      erRegistrerPapirsoknad: false,
      saksbehandlere: [],
      skjermet: false,
    }];

    const wrapper = shallow(<EndreOppgavekoerPanel.WrappedComponent
      oppgavekoer={oppgavekoer}
      hentKo={sinon.spy()}
      setValgtOppgavekoId={sinon.spy()}
      lagNyOppgaveko={sinon.spy()}
      fjernOppgaveko={sinon.spy()}
      lagreOppgavekoNavn={sinon.spy()}
      lagreOppgavekoBehandlingstype={sinon.spy()}
      lagreOppgavekoFagsakYtelseType={sinon.spy()}
      lagreOppgavekoSortering={sinon.spy()}
      lagreOppgavekoSkjermet={sinon.spy()}
      lagreOppgavekoAndreKriterier={sinon.spy()}
      knyttSaksbehandlerTilOppgaveko={sinon.spy()}
      hentOppgavekonsSaksbehandlere={sinon.spy()}
      hentAntallOppgaverForOppgaveko={sinon.spy()}
      hentAntallOppgaverTotalt={sinon.spy()}
      showSaksbehandlerPanel
    />);

    expect(wrapper.find(GjeldendeOppgavekoerTabell)).to.have.length(1);
    expect(wrapper.find(UtvalgskriterierForOppgavekoForm)).to.have.length(0);
  });
});
