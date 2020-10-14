import React from 'react';
import { expect } from 'chai';
import { FormattedMessage, IntlShape } from 'react-intl';
import sinon from 'sinon';
import NavFrontendChevron from 'nav-frontend-chevron';

import behandlingType from 'kodeverk/behandlingType';
import behandlingStatus from 'kodeverk/behandlingStatus';
import fagsakYtelseType from 'kodeverk/fagsakYtelseType';
import DateLabel from 'sharedComponents/DateLabel';
import TableRow from 'sharedComponents/TableRow';
import TableColumn from 'sharedComponents/TableColumn';
import Image from 'sharedComponents/Image';
import { intlMock, shallowWithIntl } from 'testHelpers/intl-enzyme-test-helper';
import { K9LosApiKeys } from 'api/k9LosApi';
import RestApiTestMocker from 'testHelpers/RestApiTestMocker';
import { OppgaverTabell } from './OppgaverTabell';

describe('<OppgaverTabell>', () => {
  const intl: Partial<IntlShape> = {
    ...intlMock,
  };
  it('skal vise kriterievelger og liste over neste oppgaver', () => {
    const oppgaverTilBehandling = [{
      eksternId: '1',
      status: {
        erReservert: false,
      },
      saksnummer: '1',
      behandlingId: 2,
      personnummer: '123456789',
      navn: 'Espen Utvikler',
      system: 'K9SAK',
      behandlingstype: {
        kode: behandlingType.FORSTEGANGSSOKNAD,
        navn: 'Førstegangssøknad',
      },
      opprettetTidspunkt: '2019-01-02',
      behandlingsfrist: '2019-03-03',
      erTilSaksbehandling: true,
      fagsakYtelseType: {
        kode: fagsakYtelseType.OMSORGSPENGER,
        navn: 'Omsorgspenger',
      },
      behandlingStatus: {
        kode: behandlingStatus.OPPRETTET,
        navn: '',
      },
    }, {
      eksternId: '2',
      status: {
        erReservert: false,
      },
      saksnummer: '2',
      behandlingId: 2,
      personnummer: '657643535',
      navn: 'Espen Solstråle',
      system: 'FPSAK',
      behandlingstype: {
        kode: behandlingType.FORSTEGANGSSOKNAD,
        navn: 'Førstegangssøknad far',
      },
      opprettetTidspunkt: '2018-01-02',
      behandlingsfrist: '2018-03-03',
      erTilSaksbehandling: true,
      fagsakYtelseType: {
        kode: fagsakYtelseType.OMSORGSPENGER,
        navn: 'FP',
      },
      behandlingStatus: {
        kode: behandlingStatus.OPPRETTET,
        navn: '',
      },
    }];

    new RestApiTestMocker()
      .withRestCallRunner(K9LosApiKeys.FORLENG_OPPGAVERESERVASJON, { startRequest: () => undefined, data: undefined })
      .withRestCallRunner(K9LosApiKeys.LEGG_TIL_BEHANDLET_OPPGAVE, { startRequest: () => undefined, data: undefined })
      .withRestCallRunner(K9LosApiKeys.BEHANDLINGSKO_OPPGAVE_ANTALL, { startRequest: () => undefined, data: undefined })
      .withRestCallRunner(K9LosApiKeys.OPPGAVEKO, { startRequest: () => undefined, data: undefined })
      .runTest(() => {
        const wrapper = shallowWithIntl(<OppgaverTabell
          intl={intl as IntlShape}
          reserverOppgave={sinon.spy()}
          valgtOppgavekoId="1"
          oppgaverTilBehandling={oppgaverTilBehandling}
          reserverteOppgaver={[]}
          requestFinished
          hentReserverteOppgaver={sinon.spy()}
        />);

        const tableRows = wrapper.find(TableRow);
        expect(tableRows).has.length(2);

        const columnsRow1 = tableRows.first().find(TableColumn);
        expect(columnsRow1.first().childAt(0).text()).is.eql('Espen Utvikler 123456789');
        expect(columnsRow1.at(1).childAt(0).text()).is.eql('Førstegangssøknad');
        expect(columnsRow1.at(2).find(DateLabel).prop('dateString')).is.eql('2019-01-02');

        const columnsRow2 = tableRows.last().find(TableColumn);
        expect(columnsRow2.first().childAt(0).text()).is.eql('Espen Solstråle 657643535');
        expect(columnsRow2.at(1).childAt(0).text()).is.eql('Førstegangssøknad far');
        expect(columnsRow2.at(2).find(DateLabel).prop('dateString')).is.eql('2018-01-02');

        const message = wrapper.find(FormattedMessage);
        expect(message).has.length(1);
        expect(message.prop('id')).is.eql('OppgaverTabell.DineNesteSaker');
      });
  });

  it('skal vise de behandlingene som fremdeles er valgt av saksbehandler først i listen samt et menyikon for disse', () => {
    const oppgaverTilBehandling = [{
      eksternId: '1',
      status: {
        erReservert: false,
      },
      saksnummer: '1',
      behandlingId: 2,
      personnummer: '123456789',
      navn: 'Espen Utvikler',
      system: 'K9SAK',
      behandlingstype: {
        kode: behandlingType.FORSTEGANGSSOKNAD,
        navn: 'Førstegangssøknad',
      },
      opprettetTidspunkt: '2019-01-02',
      behandlingsfrist: '2019-03-03',
      erTilSaksbehandling: true,
      fagsakYtelseType: {
        kode: fagsakYtelseType.OMSORGSPENGER,
        navn: 'K9',
      },
      behandlingStatus: {
        kode: behandlingStatus.OPPRETTET,
        navn: '',
      },
    }];
    const reserverteOppgaver = [{
      eksternId: '2',
      status: {
        erReservert: true,
      },
      saksnummer: '2',
      behandlingId: 2,
      personnummer: '657643535',
      navn: 'Espen Solstråle',
      system: 'FPSAK',
      behandlingstype: {
        kode: behandlingType.FORSTEGANGSSOKNAD,
        navn: 'Førstegangssøknad far',
      },
      opprettetTidspunkt: '2018-01-02',
      behandlingsfrist: '2018-03-03',
      erTilSaksbehandling: true,
      fagsakYtelseType: {
        kode: fagsakYtelseType.OMSORGSPENGER,
        navn: 'FP',
      },
      behandlingStatus: {
        kode: behandlingStatus.OPPRETTET,
        navn: '',
      },
    }];

    new RestApiTestMocker()
      .withRestCallRunner(K9LosApiKeys.FORLENG_OPPGAVERESERVASJON, { startRequest: () => undefined, data: undefined })
      .withRestCallRunner(K9LosApiKeys.LEGG_TIL_BEHANDLET_OPPGAVE, { startRequest: () => undefined, data: undefined })
      .withRestCallRunner(K9LosApiKeys.BEHANDLINGSKO_OPPGAVE_ANTALL, { startRequest: () => undefined, data: undefined })
      .withRestCallRunner(K9LosApiKeys.OPPGAVEKO, { startRequest: () => undefined, data: undefined })
      .runTest(() => {
        const wrapper = shallowWithIntl(<OppgaverTabell
          intl={intl as IntlShape}
          reserverOppgave={sinon.spy()}
          valgtOppgavekoId="1"
          oppgaverTilBehandling={oppgaverTilBehandling}
          reserverteOppgaver={reserverteOppgaver}
          requestFinished
          hentReserverteOppgaver={sinon.spy()}
        />);

        const tableRows = wrapper.find(TableRow);
        expect(tableRows).has.length(2);

        const columnsRow1 = tableRows.first().find(TableColumn);
        expect(columnsRow1.first().childAt(0).text()).is.eql('Espen Solstråle 657643535');
        expect(columnsRow1.at(1).childAt(0).text()).is.eql('Førstegangssøknad far');
        expect(columnsRow1.at(2).find(DateLabel).prop('dateString')).is.eql('2018-01-02');
        expect(columnsRow1.at(3).find(Image)).has.length(0);
        expect(columnsRow1.at(5).find(Image)).has.length(1);

        const columnsRow2 = tableRows.last().find(TableColumn);
        expect(columnsRow2.first().childAt(0).text()).is.eql('Espen Utvikler 123456789');
        expect(columnsRow2.at(1).childAt(0).text()).is.eql('Førstegangssøknad');
        expect(columnsRow2.at(2).find(DateLabel).prop('dateString')).is.eql('2019-01-02');
        expect(columnsRow2.at(3).find(Image)).has.length(0);
        expect(columnsRow2.at(5).find(NavFrontendChevron)).has.length(1);
      });
  });

  it('skal ikke vise liste når en ikke har oppgaver', () => {
    new RestApiTestMocker()
      .withRestCallRunner(K9LosApiKeys.FORLENG_OPPGAVERESERVASJON, { startRequest: () => undefined, data: undefined })
      .withRestCallRunner(K9LosApiKeys.LEGG_TIL_BEHANDLET_OPPGAVE, { startRequest: () => undefined, data: undefined })
      .withRestCallRunner(K9LosApiKeys.BEHANDLINGSKO_OPPGAVE_ANTALL, { startRequest: () => undefined, data: undefined })
      .withRestCallRunner(K9LosApiKeys.OPPGAVEKO, { startRequest: () => undefined, data: undefined })
      .runTest(() => {
        const wrapper = shallowWithIntl(<OppgaverTabell
          intl={intl as IntlShape}
          reserverOppgave={sinon.spy()}
          valgtOppgavekoId="1"
          oppgaverTilBehandling={[]}
          reserverteOppgaver={[]}
          requestFinished
          hentReserverteOppgaver={sinon.spy()}

        />);

        const message = wrapper.find(FormattedMessage);
        expect(message).has.length(3);
        expect(message.first().prop('id')).is.eql('OppgaverTabell.DineNesteSaker');
        expect(message.last().prop('id')).is.eql('OppgaverTabell.IngenTilgang');

        expect(wrapper.find(TableRow)).has.length(0);
      });
  });

  it('skal vise tooltip for reserverte oppgaver som er flyttet', () => {
    const reserverteOppgaver = [{
      eksternId: '2',
      status: {
        erReservert: true,
        flyttetReservasjon: {
          tidspunkt: '2018-01-02',
          uid: '1234556',
          navn: 'Auto Joachim',
          begrunnelse: 'Har flytta til deg',
        },
      },
      saksnummer: '2',
      behandlingId: 2,
      personnummer: '657643535',
      navn: 'Espen Solstråle',
      system: 'K9SAK',
      behandlingstype: {
        kode: behandlingType.FORSTEGANGSSOKNAD,
        navn: 'Førstegangssøknad far',
      },
      opprettetTidspunkt: '2018-01-02',
      behandlingsfrist: '2018-03-03',
      erTilSaksbehandling: true,
      fagsakYtelseType: {
        kode: fagsakYtelseType.OMSORGSPENGER,
        navn: 'OMP',
      },
      behandlingStatus: {
        kode: behandlingStatus.OPPRETTET,
        navn: '',
      },
    }];

    new RestApiTestMocker()
      .withRestCallRunner(K9LosApiKeys.FORLENG_OPPGAVERESERVASJON, { startRequest: () => undefined, data: undefined })
      .withRestCallRunner(K9LosApiKeys.LEGG_TIL_BEHANDLET_OPPGAVE, { startRequest: () => undefined, data: undefined })
      .withRestCallRunner(K9LosApiKeys.BEHANDLINGSKO_OPPGAVE_ANTALL, { startRequest: () => undefined, data: undefined })
      .withRestCallRunner(K9LosApiKeys.OPPGAVEKO, { startRequest: () => undefined, data: undefined })
      .runTest(() => {
        const wrapper = shallowWithIntl(<OppgaverTabell
          intl={intl as IntlShape}
          reserverOppgave={sinon.spy()}
          valgtOppgavekoId="1"
          oppgaverTilBehandling={[]}
          reserverteOppgaver={reserverteOppgaver}
          requestFinished
          hentReserverteOppgaver={sinon.spy()}
        />);

        const tableRows = wrapper.find(TableRow);
        expect(tableRows).has.length(1);

        const columnsRow1 = tableRows.first().find(TableColumn);
        expect(columnsRow1.first().childAt(0).text()).is.eql('Espen Solstråle 657643535');
        expect(columnsRow1.at(1).childAt(0).text()).is.eql('Førstegangssøknad far');
        expect(columnsRow1.at(2).find(DateLabel).prop('dateString')).is.eql('2018-01-02');
        expect(columnsRow1.at(3).find(Image)).has.length(1);
        expect(columnsRow1.at(5).find(Image)).has.length(1);

        const tooltip = shallowWithIntl(columnsRow1.at(3).find(Image).prop('tooltip'));
        const values = tooltip.find(FormattedMessage).prop('values') as { dato: string; tid: string; uid: string; navn: string; beskrivelse: string};

        expect(values.dato).is.eql('02.01.2018');
        expect(values.tid).is.eql('00:00');
        expect(values.uid).is.eql('1234556');
        expect(values.navn).is.eql('Auto Joachim');
        expect(values.beskrivelse).is.eql('Har flytta til deg');
      });
  });
});
