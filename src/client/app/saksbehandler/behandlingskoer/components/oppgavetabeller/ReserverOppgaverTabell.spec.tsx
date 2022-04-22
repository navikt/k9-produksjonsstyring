import React from 'react';
import { expect } from 'chai';
import { FormattedMessage, IntlShape } from 'react-intl';
import sinon from 'sinon';

import behandlingType from 'kodeverk/behandlingType';
import behandlingStatus from 'kodeverk/behandlingStatus';
import fagsakYtelseType from 'kodeverk/fagsakYtelseType';
import DateLabel from 'sharedComponents/DateLabel';
import TableRow from 'sharedComponents/TableRow';
import TableColumn from 'sharedComponents/TableColumn';
import Image from 'sharedComponents/Image';
import { K9LosApiKeys, RestApiGlobalStatePathsKeys } from 'api/k9LosApi';
import ReserverteOppgaverTabell
  from 'saksbehandler/behandlingskoer/components/oppgavetabeller/ReserverteOppgaverTabell';
import { intlMock, shallowWithIntl } from '../../../../../../../setup/testHelpers/intl-enzyme-test-helper';
import RestApiTestMocker from '../../../../../../../setup/testHelpers/RestApiTestMocker';
import kodeverk from "../../../../../mocks/kodeverk";

describe('<ReserverOppgaveTabell>', () => {
  const intl: Partial<IntlShape> = {
    ...intlMock,
  };

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
    behandlingstype: behandlingType.FORSTEGANGSSOKNAD,
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
    journalpostId: '',
  }];

  it('skal vise kriterievelger og liste over neste oppgaver', () => {
    new RestApiTestMocker()
      .withRestCallRunner(K9LosApiKeys.LEGG_TIL_BEHANDLET_OPPGAVE, { startRequest: () => undefined, data: undefined })
      .withRestCallRunner(K9LosApiKeys.FORLENG_OPPGAVERESERVASJON, { startRequest: () => undefined, data: undefined })
      .withGlobalData(RestApiGlobalStatePathsKeys.KODEVERK, kodeverk)
      .runTest(() => {
        const wrapper = shallowWithIntl(<ReserverteOppgaverTabell.WrappedComponent
          intl={intl}
          reserverOppgave={sinon.spy()}
          hentReserverteOppgaver={sinon.spy()}
          reserverteOppgaver={reserverteOppgaver}
          requestFinished
        />);

        const tableRows = wrapper.find(TableRow);
        expect(tableRows).has.length(1);

        const columnsRow1 = tableRows.last().find(TableColumn);
        expect(columnsRow1.first().childAt(0).text()).is.eql('Espen Solstråle 657643535');
        expect(columnsRow1.at(1).childAt(0).text()).is.eql('2');
        expect(columnsRow1.at(2).childAt(0).text()).is.eql('Førstegangsbehandling');
        expect(columnsRow1.at(3).find(DateLabel).prop('dateString')).is.eql('2018-01-02');
      });
  });

  it('skal vise tooltip for reserverte oppgaver som er flyttet', () => {
    const reservertOppgave = [{
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
      behandlingstype: behandlingType.FORSTEGANGSSOKNAD,
      opprettetTidspunkt: '2018-01-02',
      behandlingsfrist: '2018-03-03',
      erTilSaksbehandling: true,
      fagsakYtelseType: fagsakYtelseType.OMSORGSPENGER,
      behandlingStatus: behandlingStatus.OPPRETTET,
      journalpostId: '',
    }];

    new RestApiTestMocker()
      .withRestCallRunner(K9LosApiKeys.LEGG_TIL_BEHANDLET_OPPGAVE, { startRequest: () => undefined, data: undefined })
      .withRestCallRunner(K9LosApiKeys.FORLENG_OPPGAVERESERVASJON, { startRequest: () => undefined, data: undefined })
      .withGlobalData(RestApiGlobalStatePathsKeys.KODEVERK, kodeverk)
      .runTest(() => {
        const wrapper = shallowWithIntl(<ReserverteOppgaverTabell.WrappedComponent
          intl={intl}
          reserverOppgave={sinon.spy()}
          hentReserverteOppgaver={sinon.spy()}
          reserverteOppgaver={reservertOppgave}
          requestFinished
        />);

        const tableRows = wrapper.find(TableRow);
        expect(tableRows).has.length(1);

        const columnsRow1 = tableRows.first().find(TableColumn);
        expect(columnsRow1.first().childAt(0).text()).is.eql('Espen Solstråle 657643535');
        expect(columnsRow1.at(1).childAt(0).text()).is.eql('2');
        expect(columnsRow1.at(2).childAt(0).text()).is.eql('Førstegangsbehandling');
        expect(columnsRow1.at(3).find(DateLabel).prop('dateString')).is.eql('2018-01-02');
        expect(columnsRow1.at(4).find(Image)).has.length(1);
        expect(columnsRow1.at(6).find(Image)).has.length(1);

        const tooltip = shallowWithIntl(columnsRow1.at(4).find(Image).prop('tooltip'));
        const values = tooltip.find(FormattedMessage).prop('values') as { dato: string; tid: string; uid: string; navn: string; beskrivelse: string};

        expect(values.dato).is.eql('02.01.2018');
        expect(values.tid).is.eql('00:00');
        expect(values.uid).is.eql('1234556');
        expect(values.navn).is.eql('Auto Joachim');
        expect(values.beskrivelse).is.eql('Har flytta til deg');
      });
  });
});
