
import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';

import { Form } from 'react-final-form';

import Image from 'sharedComponents/Image';
import LabelWithHeader from 'sharedComponents/LabelWithHeader';
import behandlingType from 'kodeverk/behandlingType';
import fagsakYtelseType from 'kodeverk/fagsakYtelseType';
import andreKriterierType from 'kodeverk/andreKriterierType';
import { SelectField } from 'form/FinalFields';
import { shallowWithIntl, intlMock } from 'testHelpers/intl-enzyme-test-helper';
import { OppgavekoVelgerForm } from './OppgavekoVelgerForm';

describe('<OppgavekoVelgerForm>', () => {
  it('skal vise dropdown med to oppgavekoer', () => {
    const formProps = { };
    const oppgavekoer = [{
      id: '1',
      navn: 'Testliste 1',
      behandlingTyper: [],
      fagsakYtelseTyper: [],
      andreKriterier: [],
      sortering: {
        sorteringType: {
          kode: 'test',
          navn: 'test',
        },
        fra: 1,
        til: 2,
        fomDato: '2019-01-01',
        tomDato: '2019-01-10',
      },
    }, {
      id: '2',
      navn: 'Testliste 2',
      behandlingTyper: [],
      fagsakYtelseTyper: [],
      andreKriterier: [],
      sortering: {
        sorteringType: {
          kode: 'test',
          navn: 'test',
        },
        fra: 1,
        til: 2,
        fomDato: '2019-01-01',
        tomDato: '2019-01-10',
      },
    }];
    const wrapper = shallowWithIntl(<OppgavekoVelgerForm
      intl={intlMock}
      oppgavekoer={oppgavekoer}
      fetchOppgavekoOppgaver={sinon.spy()}
      totaltBehandlingTypeAntall={5}
      fetchOppgavekoensSaksbehandlere={sinon.spy()}
      fetchAntallOppgaverForBehandlingsko={sinon.spy()}
    />).find(Form).drill(props => props.render(formProps)).shallow();

    const select = wrapper.find(SelectField);
    expect(select).to.have.length(1);
    const options = select.prop('selectValues');
    expect(options[0].key).to.eql('1');
    expect(options[0].props.value).to.eql('1');
    expect(options[0].props.children).to.eql('Testliste 1');
    expect(options[1].key).to.eql('2');
    expect(options[1].props.value).to.eql('2');
    expect(options[1].props.children).to.eql('Testliste 2');
  });

  it('skal ikke vise informasjon om oppgavekø når ingen oppgavekø er valgt', () => {
    const oppgavekoer = [{
      id: '1',
      navn: 'Testliste 1',
      behandlingTyper: [],
      fagsakYtelseTyper: [],
      andreKriterier: [],
      sortering: {
        sorteringType: {
          kode: 'test',
          navn: 'test',
        },
        fra: 1,
        til: 2,
        fomDato: '2019-01-01',
        tomDato: '2019-01-10',
      },
    }];

    const formProps = { values: { id: undefined } };
    const wrapper = shallowWithIntl(<OppgavekoVelgerForm
      intl={intlMock}
      oppgavekoer={oppgavekoer}
      fetchOppgavekoOppgaver={sinon.spy()}
      totaltBehandlingTypeAntall={5}
      fetchOppgavekoensSaksbehandlere={sinon.spy()}
      fetchAntallOppgaverForBehandlingsko={sinon.spy()}
    />).find(Form).drill(props => props.render(formProps)).shallow();

    expect(wrapper.find(LabelWithHeader)).to.have.length(0);
  });

  it('skal vise at alle behandlingstyper og fagsakYtelseTyper er valgt når ingen verdier er oppgitt', () => {
    const oppgavekoer = [{
      id: '1',
      navn: 'Testliste 1',
      behandlingTyper: [],
      fagsakYtelseTyper: [],
      andreKriterier: [],
      sortering: {
        sorteringType: {
          kode: 'test',
          navn: 'Sortert på noko',
        },
        fra: 1,
        til: 2,
        fomDato: '2019-01-01',
        tomDato: '2019-01-10',
      },
    }];

    const formProps = { values: { id: '1' } };
    const wrapper = shallowWithIntl(<OppgavekoVelgerForm
      intl={intlMock}
      oppgavekoer={oppgavekoer}
      fetchOppgavekoOppgaver={sinon.spy()}
      totaltBehandlingTypeAntall={5}
      fetchOppgavekoensSaksbehandlere={sinon.spy()}
      fetchAntallOppgaverForBehandlingsko={sinon.spy()}
    />).find(Form).drill(props => props.render(formProps)).shallow();

    const labels = wrapper.find(LabelWithHeader);
    expect(labels).to.have.length(4);
    expect(labels.first().prop('texts')).to.eql(['Alle']);
    expect(labels.at(0).prop('texts')).to.eql(['Alle']);
    expect(labels.at(1).prop('texts')).to.eql(['Alle']);
  });

  it('skal vise at alle behandlingstyper er valgt når alle verdiene er oppgitt', () => {
    const oppgavekoer = [{
      id: '1',
      navn: 'Testliste 1',
      behandlingTyper: [{
        kode: behandlingType.FORSTEGANGSSOKNAD,
        navn: 'Førstegangssøknad',
      }],
      fagsakYtelseTyper: [],
      andreKriterier: [],
      sortering: {
        sorteringType: {
          kode: 'test',
          navn: 'Sortert på noko',
        },
        fra: 1,
        til: 2,
        fomDato: '2019-01-01',
        tomDato: '2019-01-10',
      },
    }];

    const formProps = { values: { id: '1' } };
    // totaltBehandlingTypeAntall er satt til 1 som er lik antall behandlingstypar satt på oppgavekøen
    const wrapper = shallowWithIntl(<OppgavekoVelgerForm
      intl={intlMock}
      oppgavekoer={oppgavekoer}
      fetchOppgavekoOppgaver={sinon.spy()}
      totaltBehandlingTypeAntall={1}
      fetchOppgavekoensSaksbehandlere={sinon.spy()}
      fetchAntallOppgaverForBehandlingsko={sinon.spy()}
    />).find(Form).drill(props => props.render(formProps)).shallow();

    const labels = wrapper.find(LabelWithHeader);
    expect(labels).to.have.length(4);
    expect(labels.first().prop('texts')).to.eql(['Alle']);
    expect(labels.at(1).prop('texts')).to.eql(['Førstegangssøknad']);
  });

  it('skal vise valgte behandlingstyper og fagsakYtelseTyper', () => {
    const oppgavekoer = [{
      id: '1',
      navn: 'Testliste 1',
      behandlingTyper: [{
        kode: behandlingType.FORSTEGANGSSOKNAD,
        navn: 'Førstegangssøknad',
      }, {
        kode: behandlingType.KLAGE,
        navn: 'Klage',
      }],
      fagsakYtelseTyper: [{
        kode: fagsakYtelseType.ENGANGSSTONAD,
        navn: 'Engangsstønad',
      }],
      andreKriterier: [],
      sortering: {
        sorteringType: {
          kode: 'test',
          navn: 'Sortert på noko',
        },
        fra: 1,
        til: 2,
        fomDato: '2019-01-01',
        tomDato: '2019-01-10',
      },
    }];

    const formProps = { values: { id: '1' } };
    const wrapper = shallowWithIntl(<OppgavekoVelgerForm
      intl={intlMock}
      oppgavekoer={oppgavekoer}
      fetchOppgavekoOppgaver={sinon.spy()}
      totaltBehandlingTypeAntall={5}
      fetchOppgavekoensSaksbehandlere={sinon.spy()}
      fetchAntallOppgaverForBehandlingsko={sinon.spy()}
    />).find(Form).drill(props => props.render(formProps)).shallow();

    const labels = wrapper.find(LabelWithHeader);
    expect(labels).to.have.length(4);
    expect(labels.first().prop('texts')).to.eql(['Engangsstønad']);
    expect(labels.at(1).prop('texts')).to.eql(['Førstegangssøknad', 'Klage']);
  });

  it('skal vise valgte andre kriterier som er inkluderte', () => {
    const oppgavekoer = [{
      id: '1',
      navn: 'Testliste 1',
      behandlingTyper: [],
      fagsakYtelseTyper: [],
      andreKriterier: [{
        andreKriterierType: {
          kode: andreKriterierType.TIL_BESLUTTER,
          navn: 'Til beslutter',
        },
        inkluder: true,
      }],
      sortering: {
        sorteringType: {
          kode: 'test',
          navn: 'test',
        },
        fra: 1,
        til: 2,
        fomDato: '2019-01-01',
        tomDato: '2019-01-10',
      },
    }];

    const formProps = { values: { id: '1' } };
    const wrapper = shallowWithIntl(<OppgavekoVelgerForm
      intl={intlMock}
      oppgavekoer={oppgavekoer}
      fetchOppgavekoOppgaver={sinon.spy()}
      totaltBehandlingTypeAntall={5}
      fetchOppgavekoensSaksbehandlere={sinon.spy()}
      fetchAntallOppgaverForBehandlingsko={sinon.spy()}
    />).find(Form).drill(props => props.render(formProps)).shallow();

    const labels = wrapper.find(LabelWithHeader);
    expect(labels).to.have.length(4);
    expect(labels.at(2).prop('texts')).to.eql(['Til beslutter']);
  });

  it('skal vise valgte andre kriterier som er ekskludert', () => {
    const oppgavekoer = [{
      id: '1',
      navn: 'Testliste 1',
      behandlingTyper: [],
      fagsakYtelseTyper: [],
      andreKriterier: [{
        andreKriterierType: {
          kode: andreKriterierType.TIL_BESLUTTER,
          navn: 'Til beslutter',
        },
        inkluder: false,
      }],
      sortering: {
        sorteringType: {
          kode: 'test',
          navn: 'test',
        },
        fra: 1,
        til: 2,
        fomDato: '2019-01-01',
        tomDato: '2019-01-10',
      },
    }];

    const formProps = { values: { id: '1' } };
    const wrapper = shallowWithIntl(<OppgavekoVelgerForm
      intl={intlMock}
      oppgavekoer={oppgavekoer}
      fetchOppgavekoOppgaver={sinon.spy()}
      totaltBehandlingTypeAntall={5}
      fetchOppgavekoensSaksbehandlere={sinon.spy()}
      fetchAntallOppgaverForBehandlingsko={sinon.spy()}
    />).find(Form).drill(props => props.render(formProps)).shallow();

    const labels = wrapper.find(LabelWithHeader);
    expect(labels).to.have.length(4);
    expect(labels.at(2).prop('texts')).to.eql(['Uten: Til beslutter']);
  });

  it('skal vise at alle andre kriterier er valgte', () => {
    const oppgavekoer = [{
      id: '1',
      navn: 'Testliste 1',
      behandlingTyper: [],
      fagsakYtelseTyper: [],
      andreKriterier: [],
      sortering: {
        sorteringType: {
          kode: 'test',
          navn: 'test',
        },
        fra: 1,
        til: 2,
        fomDato: '2019-01-01',
        tomDato: '2019-01-10',
      },
    }];

    const formProps = { values: { id: '1' } };
    const wrapper = shallowWithIntl(<OppgavekoVelgerForm
      intl={intlMock}
      oppgavekoer={oppgavekoer}
      fetchOppgavekoOppgaver={sinon.spy()}
      totaltBehandlingTypeAntall={5}
      fetchOppgavekoensSaksbehandlere={sinon.spy()}
      fetchAntallOppgaverForBehandlingsko={sinon.spy()}
    />).find(Form).drill(props => props.render(formProps)).shallow();

    const labels = wrapper.find(LabelWithHeader);
    expect(labels).to.have.length(4);
    expect(labels.at(2).prop('texts')).to.eql(['Alle']);
  });

  it('skal vise køens saksbehandlere i tooltip', () => {
    const oppgavekoer = [{
      id: '1',
      navn: 'Testliste 1',
      behandlingTyper: [],
      fagsakYtelseTyper: [],
      andreKriterier: [],
      sortering: {
        sorteringType: {
          kode: 'test',
          navn: 'test',
        },
        fra: 1,
        til: 2,
        fomDato: '2019-01-01',
        tomDato: '2019-01-10',
      },
    }];

    const formProps = { values: { id: '1' } };
    const wrapper = shallowWithIntl(<OppgavekoVelgerForm
      intl={intlMock}
      oppgavekoer={oppgavekoer}
      fetchOppgavekoOppgaver={sinon.spy()}
      totaltBehandlingTypeAntall={5}
      fetchOppgavekoensSaksbehandlere={sinon.spy()}
      fetchAntallOppgaverForBehandlingsko={sinon.spy()}
      saksbehandlere={[{
        brukerIdent: 'T120101',
        navn: 'Espen Utvikler',
      }, {
        brukerIdent: 'A120102',
        navn: 'Auto Joachim',
      }, {
        brukerIdent: 'T120102',
        navn: 'Helge Ingstad',
      }]}
    />).find(Form).drill(props => props.render(formProps)).shallow();

    const labels = wrapper.find(Image);
    expect(labels).to.have.length(1);
    expect(labels.first().prop('tooltip').header.props.children).to.eql('Saksbehandlere');
    expect(labels.first().prop('tooltip').body).to.have.length(3);
    expect(labels.first().prop('tooltip').body[0].key).to.eql('Auto Joachim');
    expect(labels.first().prop('tooltip').body[1].key).to.eql('Espen Utvikler');
    expect(labels.first().prop('tooltip').body[2].key).to.eql('Helge Ingstad');
  });
});
