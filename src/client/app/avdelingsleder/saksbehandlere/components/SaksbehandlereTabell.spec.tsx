import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import { FormattedMessage } from 'react-intl';

import Image from 'sharedComponents/Image';
import Table from 'sharedComponents/Table';
import TableRow from 'sharedComponents/TableRow';
import TableColumn from 'sharedComponents/TableColumn';
import { SaksbehandlereTabell } from './SaksbehandlereTabell';
import SletteSaksbehandlerModal from './SletteSaksbehandlerModal';

describe('<SaksbehandlereTabell>', () => {
  it('skal vise tekst som viser at ingen saksbehandlere er lagt til', () => {
    const wrapper = shallow(<SaksbehandlereTabell
      saksbehandlere={[]}
      fjernSaksbehandler={sinon.spy()}
    />);

    const message = wrapper.find(FormattedMessage);
    expect(message).to.have.length(2);
    expect(message.last().prop('id')).to.eql('SaksbehandlereTabell.IngenSaksbehandlere');

    expect(wrapper.find(Table)).to.have.length(0);
    expect(wrapper.find(SletteSaksbehandlerModal)).to.have.length(0);
  });

  it('skal vise to saksbehandlere sortert i tabell', () => {
    const saksbehandlere = [{
      brukerIdent: 'TEST1',
      navn: 'Espen Utvikler',
      epost: 'epost',
    }, {
      brukerIdent: 'TEST2',
      navn: 'Auto Joachim',
      epost: 'epost',
    }];
    const wrapper = shallow(<SaksbehandlereTabell
      saksbehandlere={saksbehandlere}
      fjernSaksbehandler={sinon.spy()}
    />);

    expect(wrapper.find(FormattedMessage)).to.have.length(1);
    expect(wrapper.find(Table)).to.have.length(1);

    const rader = wrapper.find(TableRow);
    expect(rader).to.have.length(2);

    const kolonnerRad1 = rader.first().find(TableColumn);
    expect(kolonnerRad1).to.have.length(3);
    expect(kolonnerRad1.first().childAt(0).text()).to.eql('epost');
    expect(kolonnerRad1.at(1).childAt(0).text()).to.eql('TEST1');

    const kolonnerRad2 = rader.last().find(TableColumn);
    expect(kolonnerRad2).to.have.length(3);
    expect(kolonnerRad2.first().childAt(0).text()).to.eql('epost');
    expect(kolonnerRad2.at(1).childAt(0).text()).to.eql('TEST2');
  });

  it('skal vise modal for å slette saksbehandler ved trykk på slette-knapp', () => {
    const saksbehandlere = [{
      brukerIdent: 'TEST1',
      navn: 'Espen Utvikler',
      epost: 'epost',
    }];
    const wrapper = shallow(<SaksbehandlereTabell
      saksbehandlere={saksbehandlere}
      fjernSaksbehandler={sinon.spy()}
    />);

    const rader = wrapper.find(TableRow);
    expect(rader).to.have.length(1);

    const kolonner = rader.first().find(TableColumn);
    const bildeKnapp = kolonner.last().find(Image);
    expect(bildeKnapp).to.have.length(1);

    expect(wrapper.find(SletteSaksbehandlerModal)).to.have.length(0);

    bildeKnapp.prop('onMouseDown')();

    expect(wrapper.find(SletteSaksbehandlerModal)).to.have.length(1);
    expect(wrapper.state().valgtSaksbehandler).is.eql(saksbehandlere[0]);
  });

  it('skal lukke modal ved trykk på avbryt i modal', () => {
    const saksbehandlere = [{
      brukerIdent: 'TEST1',
      navn: 'Espen Utvikler',
      epost: 'epost',
    }];
    const wrapper = shallow(<SaksbehandlereTabell
      saksbehandlere={saksbehandlere}
      fjernSaksbehandler={sinon.spy()}
    />);

    const rader = wrapper.find(TableRow);
    const kolonner = rader.first().find(TableColumn);
    const bildeKnapp = kolonner.last().find(Image);

    bildeKnapp.prop('onMouseDown')();

    const modal = wrapper.find(SletteSaksbehandlerModal);
    expect(modal).to.have.length(1);

    modal.prop('closeSletteModal')();

    expect(wrapper.find(SletteSaksbehandlerModal)).to.have.length(0);
    expect(wrapper.state().valgtSaksbehandler).is.undefined;
  });

  it('skal fjerne saksbehandler ved trykk på ok i modal', () => {
    const saksbehandlere = [{
      brukerIdent: 'TEST1',
      navn: 'Espen Utvikler',
      epost: 'epost',
    }];
    const fjernSaksbehandlerFn = sinon.spy();
    const wrapper = shallow(<SaksbehandlereTabell
      saksbehandlere={saksbehandlere}
      fjernSaksbehandler={fjernSaksbehandlerFn}
    />);

    const rader = wrapper.find(TableRow);
    const kolonner = rader.first().find(TableColumn);
    const bildeKnapp = kolonner.last().find(Image);

    bildeKnapp.prop('onMouseDown')();

    const modal = wrapper.find(SletteSaksbehandlerModal);
    expect(modal).to.have.length(1);

    modal.prop('fjernSaksbehandler')(saksbehandlere[0]);

    expect(wrapper.find(SletteSaksbehandlerModal)).to.have.length(0);
    expect(wrapper.state().valgtSaksbehandler).is.undefined;

    expect(fjernSaksbehandlerFn.calledOnce).to.be.true;
    const { args } = fjernSaksbehandlerFn.getCalls()[0];
    expect(args).to.have.length(1);
    expect(args[0]).to.eql(saksbehandlere[0].epost);
  });
});
