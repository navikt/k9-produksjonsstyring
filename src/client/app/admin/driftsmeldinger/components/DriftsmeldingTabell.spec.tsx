import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import { FormattedMessage } from 'react-intl';

import Image from 'sharedComponents/Image';
import Table from 'sharedComponents/Table';
import TableRow from 'sharedComponents/TableRow';
import TableColumn from 'sharedComponents/TableColumn';
import { DriftsmeldingerTabell } from './DriftsmeldingerTabell';
import SletteDriftsmeldingModal from './SletteDriftsmeldingerModal';

describe('<DriftsmeldingerTabell>', () => {
  it('skal vise tekst som viser at ingen driftsmeldinger er lagt til', () => {
    const wrapper = shallow(<DriftsmeldingerTabell
      driftsmeldinger={[]}
      fjernDriftsmelding={sinon.spy()}
    />);

    const message = wrapper.find(FormattedMessage);
    expect(message).to.have.length(2);
    expect(message.last().prop('id')).to.eql('DriftsmeldingerTabell.IngenDriftsmeldinger');

    expect(wrapper.find(Table)).to.have.length(0);
    expect(wrapper.find(SletteDriftsmeldingModal)).to.have.length(0);
  });

  it('skal vise to driftsmeldinger sortert i tabell', () => {
    const driftsmeldinger = [{
      brukerIdent: 'TEST1',
      navn: 'Espen Utvikler',
      epost: 'epost',
    }, {
      brukerIdent: 'TEST2',
      navn: 'Auto Joachim',
      epost: 'epost',
    }];
    const wrapper = shallow(<DriftsmeldingerTabell
      driftsmeldinger={driftsmeldinger}
      fjernSaksbehandler={sinon.spy()}
    />);

    expect(wrapper.find(FormattedMessage)).to.have.length(1);
    expect(wrapper.find(Table)).to.have.length(1);

    const rader = wrapper.find(TableRow);
    expect(rader).to.have.length(2);

    const kolonnerRad1 = rader.first().find(TableColumn);
    expect(kolonnerRad1).to.have.length(4);
    expect(kolonnerRad1.first().childAt(0).text()).to.eql('Espen Utvikler');
    expect(kolonnerRad1.at(1).childAt(0).text()).to.eql('TEST1');

    const kolonnerRad2 = rader.last().find(TableColumn);
    expect(kolonnerRad2).to.have.length(4);
    expect(kolonnerRad2.first().childAt(0).text()).to.eql('Auto Joachim');
    expect(kolonnerRad2.at(1).childAt(0).text()).to.eql('TEST2');
  });

  it('skal vise modal for å slette saksbehandler ved trykk på slette-knapp', () => {
    const driftsmeldinger = [{
      brukerIdent: 'TEST1',
      navn: 'Espen Utvikler',
      epost: 'epost',
    }];
    const wrapper = shallow(<DriftsmeldingerTabell
      driftsmeldinger={driftsmeldinger}
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
    expect(wrapper.state().valgtSaksbehandler).is.eql(driftsmeldinger[0]);
  });

  it('skal lukke modal ved trykk på avbryt i modal', () => {
    const driftsmeldinger = [{
      brukerIdent: 'TEST1',
      navn: 'Espen Utvikler',
      epost: 'epost',
    }];
    const wrapper = shallow(<DriftsmeldingerTabell
      driftsmeldinger={driftsmeldinger}
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
    const driftsmeldinger = [{
      brukerIdent: 'TEST1',
      navn: 'Espen Utvikler',
      epost: 'epost',
    }];
    const fjernSaksbehandlerFn = sinon.spy();
    const wrapper = shallow(<DriftsmeldingerTabell
      driftsmeldinger={driftsmeldinger}
      fjernSaksbehandler={fjernSaksbehandlerFn}
    />);

    const rader = wrapper.find(TableRow);
    const kolonner = rader.first().find(TableColumn);
    const bildeKnapp = kolonner.last().find(Image);

    bildeKnapp.prop('onMouseDown')();

    const modal = wrapper.find(SletteSaksbehandlerModal);
    expect(modal).to.have.length(1);

    modal.prop('fjernSaksbehandler')(driftsmeldinger[0]);

    expect(wrapper.find(SletteSaksbehandlerModal)).to.have.length(0);
    expect(wrapper.state().valgtSaksbehandler).is.undefined;

    expect(fjernSaksbehandlerFn.calledOnce).to.be.true;
    const { args } = fjernSaksbehandlerFn.getCalls()[0];
    expect(args).to.have.length(1);
    expect(args[0]).to.eql(driftsmeldinger[0].epost);
  });
});
