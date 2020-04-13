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
      oppgavekoId: '1',
      navn: 'Espen Utvikler',
      sistEndret: '2017-08-31',
      erTilBeslutter: false,
      erRegistrerPapirsoknad: false,
      saksbehandlerIdenter: [],
    }];

    const wrapper = shallow(<EndreOppgavekoerPanel
      oppgavekoer={oppgavekoer}
      setValgtOppgavekoId={sinon.spy()}
      lagNyOppgaveko={sinon.spy()}
      fjernOppgaveko={sinon.spy()}
      lagreOppgavekoNavn={sinon.spy()}
      lagreOppgavekoBehandlingstype={sinon.spy()}
      lagreOppgavekoFagsakYtelseType={sinon.spy()}
      lagreOppgavekoSortering={sinon.spy()}
      lagreOppgavekoAndreKriterier={sinon.spy()}
      knyttSaksbehandlerTilOppgaveko={sinon.spy()}
      hentOppgavekonsSaksbehandlere={sinon.spy()}
      hentAntallOppgaverForOppgaveko={sinon.spy()}
      hentAntallOppgaverForAvdeling={sinon.spy()}
      showSaksbehandlerPanel
    />);

    expect(wrapper.find(GjeldendeOppgavekoerTabell)).to.have.length(1);
    expect(wrapper.find(UtvalgskriterierForOppgavekoForm)).to.have.length(0);
  });

  it('skal vise editeringspanel når en har valgt tabellrad', () => {
    const oppgavekoer = [{
      oppgavekoId: '1',
      navn: 'Espen Utvikler',
      sistEndret: '2017-08-31',
      erTilBeslutter: false,
      erRegistrerPapirsoknad: false,
      saksbehandlerIdenter: [],
    }];

    const wrapper = shallow(<EndreOppgavekoerPanel
      oppgavekoer={oppgavekoer}
      setValgtOppgavekoId={sinon.spy()}
      lagNyOppgaveko={sinon.spy()}
      fjernOppgaveko={sinon.spy()}
      lagreOppgavekoNavn={sinon.spy()}
      lagreOppgavekoBehandlingstype={sinon.spy()}
      lagreOppgavekoFagsakYtelseType={sinon.spy()}
      lagreOppgavekoSortering={sinon.spy()}
      lagreOppgavekoAndreKriterier={sinon.spy()}
      valgtOppgavekoId="1"
      knyttSaksbehandlerTilOppgaveko={sinon.spy()}
      hentOppgavekonsSaksbehandlere={sinon.spy()}
      hentAntallOppgaverForOppgaveko={sinon.spy()}
      hentAntallOppgaverForAvdeling={sinon.spy()}
      showSaksbehandlerPanel
    />);

    expect(wrapper.find(GjeldendeOppgavekoerTabell)).to.have.length(1);
    expect(wrapper.find(UtvalgskriterierForOppgavekoForm)).to.have.length(1);
  });
});
