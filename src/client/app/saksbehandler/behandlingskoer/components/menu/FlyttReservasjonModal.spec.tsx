
import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { IntlShape } from 'react-intl';
import { Form } from 'react-final-form';
import { Hovedknapp } from 'nav-frontend-knapper';
import { Normaltekst } from 'nav-frontend-typografi';

import { shallowWithIntl, intlMock } from 'testHelpers/intl-enzyme-test-helper';
import behandlingStatus from 'kodeverk/behandlingStatus';
import fagsakYtelseType from 'kodeverk/fagsakYtelseType';
import moment from 'moment';
import behandlingType from 'kodeverk/behandlingType';
import { FlyttReservasjonModal } from './FlyttReservasjonModal';

describe('<FlyttReservasjonModal>', () => {
  const intl: Partial<IntlShape> = {
    ...intlMock,
  };
  // @ts-ignore
  const oppgave = {
    eksternId: '1',
    status: {
      erReservert: false,
      reservertTilTidspunkt: moment().add(2, 'hours').format(),
    },
    saksnummer: '1',
    behandlingId: 2,
    personnummer: '1234567',
    navn: 'Espen Utvikler',
    system: 'K9SAK',
    behandlingstype: {
      kode: behandlingType.FORSTEGANGSSOKNAD,
      navn: '',
    },
    opprettetTidspunkt: '2017-01-01',
    behandlingsfrist: '2017-01-01',
    erTilSaksbehandling: true,
    fagsakYtelseType: {
      kode: fagsakYtelseType.PLEIEPENGER_SYKT_BARN,
      navn: 'K9',
    },
    behandlingStatus: {
      kode: behandlingStatus.OPPRETTET,
      navn: '',
    },
  };

  const oppgaveId = 1;

  it('skal ikke vise saksbehandler før søk er utført', () => {
    const formProps = {
      handleSubmit: sinon.spy(),
      values: {},
    };
    const wrapper = shallowWithIntl(
      <FlyttReservasjonModal
        intl={intl as IntlShape}
        showModal
        oppgave={oppgave}
        closeModal={sinon.spy()}
        submit={sinon.spy()}
        finnSaksbehandler={sinon.spy()}
        resetSaksbehandler={sinon.spy()}
        erSaksbehandlerSokStartet={false}
        erSaksbehandlerSokFerdig={false}
      />,
      // @ts-ignore
    ).find(Form).first().renderProp('render')(formProps);

    expect(wrapper.find(Normaltekst)).has.length(0);
  });

  it('skal vise at saksbehandler ikke finnes når søket er utført og ingen saksbehandler vart returnert', () => {
    const formProps = {
      handleSubmit: sinon.spy(),
      values: {},
    };
    const wrapper = shallowWithIntl(
      <FlyttReservasjonModal
        intl={intl as IntlShape}
        showModal
        oppgave={oppgave}
        closeModal={sinon.spy()}
        submit={sinon.spy()}
        finnSaksbehandler={sinon.spy()}
        resetSaksbehandler={sinon.spy()}
        erSaksbehandlerSokStartet={false}
        erSaksbehandlerSokFerdig
      />,
      // @ts-ignore
    ).find(Form).first().renderProp('render')(formProps);

    const tekst = wrapper.find(Normaltekst);
    expect(tekst).has.length(1);
    expect(tekst.childAt(0).text()).is.eql('Kan ikke finne bruker');
  });

  it('skal vise saksbehandler', () => {
    const saksbehandler = {
      brukerIdent: 'P039283',
      navn: 'Brukernavn',
      epost: 'epost',
    };
    const formProps = {
      handleSubmit: sinon.spy(),
      values: {},
    };

    const wrapper = shallowWithIntl(
      <FlyttReservasjonModal
        intl={intl as IntlShape}
        showModal
        oppgave={oppgave}
        closeModal={sinon.spy()}
        submit={sinon.spy()}
        finnSaksbehandler={sinon.spy()}
        resetSaksbehandler={sinon.spy()}
        erSaksbehandlerSokStartet={false}
        erSaksbehandlerSokFerdig
        saksbehandler={saksbehandler}
      />,
      // @ts-ignore
    ).find(Form).first().renderProp('render')(formProps);

    const tekst = wrapper.find(Normaltekst);
    expect(tekst).has.length(1);
    expect(tekst.childAt(0).text()).is.eql('Brukernavn');
  });

  it('skal vise søkeknapp som enablet når en har skrive inn minst ett tegn og en ikke har startet søket', () => {
    const formProps = {
      handleSubmit: sinon.spy(),
      values: {
        brukerIdent: '1',
      },
    };
    const wrapper = shallowWithIntl(
      <FlyttReservasjonModal
        intl={intl as IntlShape}
        showModal
        oppgave={oppgave}
        closeModal={sinon.spy()}
        submit={sinon.spy()}
        finnSaksbehandler={sinon.spy()}
        resetSaksbehandler={sinon.spy()}
        erSaksbehandlerSokStartet={false}
        erSaksbehandlerSokFerdig={false}
      />,
      // @ts-ignore
    ).find(Form).first().renderProp('render')(formProps);

    const knapper = wrapper.find(Hovedknapp);
    expect(knapper).has.length(1);
    expect(knapper.first().prop('disabled')).is.false;
  });

  it('skal vise søkeknapp som disablet når en ikke har skrevet noe i brukerident-feltet', () => {
    const formProps = {
      handleSubmit: sinon.spy(),
      values: {},
    };
    const wrapper = shallowWithIntl(
      <FlyttReservasjonModal
        intl={intl as IntlShape}
        showModal
        oppgave={oppgave}
        closeModal={sinon.spy()}
        submit={sinon.spy()}
        finnSaksbehandler={sinon.spy()}
        resetSaksbehandler={sinon.spy()}
        erSaksbehandlerSokStartet={false}
        erSaksbehandlerSokFerdig={false}
      />,
      // @ts-ignore
    ).find(Form).first().renderProp('render')(formProps);

    const knapper = wrapper.find(Hovedknapp);
    expect(knapper).has.length(1);
    expect(knapper.first().prop('disabled')).is.true;
  });

  it('skal vise søkeknapp som disablet når søk er startet', () => {
    const formProps = {
      handleSubmit: sinon.spy(),
      values: {
        brukerIdent: '1',
      },
    };
    const wrapper = shallowWithIntl(
      <FlyttReservasjonModal
        intl={intl as IntlShape}
        showModal
        oppgave={oppgave}
        closeModal={sinon.spy()}
        submit={sinon.spy()}
        finnSaksbehandler={sinon.spy()}
        resetSaksbehandler={sinon.spy()}
        erSaksbehandlerSokStartet
        erSaksbehandlerSokFerdig={false}
      />,
      // @ts-ignore
    ).find(Form).first().renderProp('render')(formProps);

    const knapper = wrapper.find(Hovedknapp);
    expect(knapper).has.length(1);
    expect(knapper.first().prop('disabled')).is.true;
  });

  it('skal vise ok-knapp som enablet når en har saksbehandler og begrunnelsen er minst tre bokstaver', () => {
    const saksbehandler = {
      brukerIdent: 'P039283',
      navn: 'Brukernavn',
      epost: 'epost',
    };
    const formProps = {
      handleSubmit: sinon.spy(),
      values: {
        brukerIdent: '1',
        begrunnelse: 'oki',
      },
    };

    const wrapper = shallowWithIntl(
      <FlyttReservasjonModal
        intl={intl as IntlShape}
        showModal
        oppgaveId={oppgaveId}
        closeModal={sinon.spy()}
        submit={sinon.spy()}
        finnSaksbehandler={sinon.spy()}
        resetSaksbehandler={sinon.spy()}
        erSaksbehandlerSokStartet={false}
        erSaksbehandlerSokFerdig={false}
        saksbehandler={saksbehandler}
      />,
      // @ts-ignore
    ).find(Form).last().renderProp('render')(formProps);

    const knapper = wrapper.find(Hovedknapp);
    expect(knapper).has.length(1);
    expect(knapper.last().prop('disabled')).is.false;
  });

  it('skal vise ok-knapp som disablet når en ikke har saksbehandler', () => {
    const formProps = {
      handleSubmit: sinon.spy(),
      values: {
        brukerIdent: '1',
        begrunnelse: 'oki',
      },
    };
    const wrapper = shallowWithIntl(
      <FlyttReservasjonModal
        intl={intl as IntlShape}
        showModal
        oppgave={oppgave}
        closeModal={sinon.spy()}
        submit={sinon.spy()}
        finnSaksbehandler={sinon.spy()}
        resetSaksbehandler={sinon.spy()}
        erSaksbehandlerSokStartet={false}
        erSaksbehandlerSokFerdig={false}
      />,
      // @ts-ignore
    ).find(Form).last().renderProp('render')(formProps);

    const knapper = wrapper.find(Hovedknapp);
    expect(knapper).has.length(1);
    expect(knapper.last().prop('disabled')).is.true;
  });

  it('skal vise ok-knapp som disablet når begrunnelsen er mindre enn tre bokstaver', () => {
    const saksbehandler = {
      brukerIdent: 'P039283',
      navn: 'Brukernavn',
      epost: 'epost',
    };
    const formProps = {
      handleSubmit: sinon.spy(),
      values: {
        brukerIdent: '1',
        begrunnelse: 'ok',
      },
    };
    const wrapper = shallowWithIntl(
      <FlyttReservasjonModal
        intl={intl as IntlShape}
        showModal
        oppgave={oppgave}
        closeModal={sinon.spy()}
        submit={sinon.spy()}
        finnSaksbehandler={sinon.spy()}
        resetSaksbehandler={sinon.spy()}
        erSaksbehandlerSokStartet={false}
        erSaksbehandlerSokFerdig={false}
        saksbehandler={saksbehandler}
      />,
      // @ts-ignore
    ).find(Form).last().renderProp('render')(formProps);

    const knapper = wrapper.find(Hovedknapp);
    expect(knapper).has.length(1);
    expect(knapper.last().prop('disabled')).is.true;
  });
});
