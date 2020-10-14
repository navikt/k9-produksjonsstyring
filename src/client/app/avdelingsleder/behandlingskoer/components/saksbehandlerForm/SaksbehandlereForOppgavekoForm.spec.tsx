import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';
import { Form } from 'react-final-form';
import { Column } from 'nav-frontend-grid';

import andreKriterierType from 'kodeverk/andreKriterierType';
import { CheckboxField } from 'form/FinalFields';
import RestApiTestMocker from 'testHelpers/RestApiTestMocker';
import SaksbehandlereForOppgavekoForm from './SaksbehandlereForOppgavekoForm';

describe('<SaksbehandlereForOppgavekoForm>', () => {
  const oppgaveko = {
    id: '1',
    navn: 'Nyansatte',
    sistEndret: '2017-08-31',
    skjermet: false,
    andreKriterierTyper: [{
      kode: andreKriterierType.TIL_BESLUTTER,
      navn: 'Til beslutter',
    }, {
      kode: andreKriterierType.AVKLAR_MEDLEMSKAP,
      navn: 'Avklar medlemskap',
    }],
    antallBehandlinger: 68,
    saksbehandlere: [],
  };

  it('skal vise kun en kolonne med saksbehandlere når det er tilordnet en saksbehandler', () => {
    const saksbehandlere = [{
      brukerIdent: 'TEST1',
      navn: 'Espen Utvikler',
      epost: 'epost',
      oppgavekoer: ['OMP'],
    }];

    const wrapper = shallow(<SaksbehandlereForOppgavekoForm
      valgtOppgaveko={oppgaveko}
      alleSaksbehandlere={saksbehandlere}
      hentOppgaveko={sinon.spy()}
    />).find(Form).renderProp('render')();

    const kolonner = wrapper.find(Column);
    expect(kolonner).to.have.length(2);

    const checkBox = kolonner.first().find(CheckboxField);
    expect(checkBox).to.have.length(1);
    expect(checkBox.prop('name')).is.eql('epost');
    expect(checkBox.prop('label')).is.eql('Espen Utvikler');

    expect(kolonner.last().find(CheckboxField)).to.have.length(0);
  });

  it('skal vise to kolonner med saksbehandlere når det er tilordnet to saksbehandler', () => {
    const saksbehandlere = [{
      brukerIdent: 'TEST1',
      navn: 'Walter Lemon',
      epost: 'epost1',
      oppgavekoer: ['OMP'],
    }, {
      brukerIdent: 'TEST2',
      navn: 'Water Melon',
      epost: 'epost2',
      oppgavekoer: ['OMP'],
    }];

    new RestApiTestMocker()
      .withDummyRunner()
      .runTest(() => {
        const wrapper = shallow(<SaksbehandlereForOppgavekoForm
          valgtOppgaveko={oppgaveko}
          alleSaksbehandlere={saksbehandlere}
          hentOppgaveko={sinon.spy()}
        />).find(Form).renderProp('render')();

        const kolonner = wrapper.find(Column);
        expect(kolonner).to.have.length(2);

        const checkBox1 = kolonner.first().find(CheckboxField);
        expect(checkBox1).to.have.length(1);
        expect(checkBox1.prop('name')).is.eql('epost1');
        expect(checkBox1.prop('label')).is.eql('Walter Lemon');

        const checkBox2 = kolonner.last().find(CheckboxField);
        expect(checkBox2).to.have.length(1);
        expect(checkBox2.prop('name')).is.eql('epost2');
        expect(checkBox2.prop('label')).is.eql('Water Melon');
      });
  });
});
