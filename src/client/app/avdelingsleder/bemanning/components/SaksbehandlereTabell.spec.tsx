import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import { FormattedMessage } from 'react-intl';

import Table from 'sharedComponents/Table';
import TableRow from 'sharedComponents/TableRow';
import TableColumn from 'sharedComponents/TableColumn';
import SaksbehandlereTabell from './SaksbehandlereTabell';
import SletteSaksbehandlerModal from './SletteSaksbehandlerModal';

describe('<SaksbehandlereTabell>', () => {
  it('skal vise tekst som viser at ingen saksbehandlere er lagt til', () => {
    const wrapper = shallow(<SaksbehandlereTabell
      saksbehandlere={[]}
      fjernSaksbehandler={sinon.spy()}
    />);

    const message = wrapper.find(FormattedMessage);
    expect(message).to.have.length(3);
    expect(message.last().prop('id')).to.eql('SaksbehandlereTabell.IngenSaksbehandlere');

    expect(wrapper.find(Table)).to.have.length(0);
    expect(wrapper.find(SletteSaksbehandlerModal)).to.have.length(0);
  });

  it('skal vise to saksbehandlere sortert i tabell', () => {
    const saksbehandlere = [{
      brukerIdent: 'TEST1',
      navn: 'Espen Utvikler',
      epost: 'epost',
      oppgavekoer: ['OMP'],
    }, {
      brukerIdent: 'TEST2',
      navn: 'Auto Joachim',
      epost: 'epost',
      oppgavekoer: ['OMP'],
    }];
    const wrapper = shallow(<SaksbehandlereTabell
      saksbehandlere={saksbehandlere}
      fjernSaksbehandler={sinon.spy()}
      leggTilSaksbehandler={sinon.spy()}
      resetSaksbehandlerSok={sinon.spy()}
    />);

    expect(wrapper.find(FormattedMessage)).to.have.length(2);
    expect(wrapper.find(Table)).to.have.length(1);

    const rader = wrapper.find(TableRow);
    expect(rader).to.have.length(2);

    const kolonnerRad1 = rader.first().find(TableColumn);
    expect(kolonnerRad1).to.have.length(2);
    expect(kolonnerRad1.first().childAt(0).text()).to.eql('Espen Utvikler');

    const kolonnerRad2 = rader.last().find(TableColumn);
    expect(kolonnerRad2).to.have.length(2);
    expect(kolonnerRad2.first().childAt(0).text()).to.eql('Auto Joachim');
  });
});
