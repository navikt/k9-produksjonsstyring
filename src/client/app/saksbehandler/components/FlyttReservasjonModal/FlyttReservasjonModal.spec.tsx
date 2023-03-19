import React from 'react';
import { FormattedMessage } from 'react-intl';
import { expect } from 'chai';
import sinon from 'sinon';
import { RestApiGlobalStatePathsKeys } from 'api/k9LosApi';
import FlyttReservasjonsmodal from 'saksbehandler/components/FlyttReservasjonModal/FlyttReservasjonModal';
import Oppgave from 'saksbehandler/oppgaveTsType';
import Modal from 'sharedComponents/Modal';
import RestApiTestMocker from '../../../../../../setup/testHelpers/RestApiTestMocker';
import { intlMock, shallowWithIntl } from '../../../../../../setup/testHelpers/intl-enzyme-test-helper';

describe('<FlyttReservasjonModal>', () => {
  const oppgave: Oppgave = {
    status: {
      erReservert: false,
      reservertTilTidspunkt: '2021-10-11T23:59:00',
      erReservertAvInnloggetBruker: false,
      reservertAv: 'Z994674',
      reservertAvNavn: 'F_Z994674 E_Z994674',
      flyttetReservasjon: null,
      kanOverstyres: true,
    },
    behandlingId: null,
    journalpostId: null,
    saksnummer: '1DMC7iW',
    navn: 'RHODODENRON ABSURD',
    system: 'K9TILBAKE',
    personnummer: '123456',
    behandlingstype: {
      kode: 'BT-007',
      navn: 'Tilbakekreving',
      kodeverk: '',
    },
    fagsakYtelseType: {
      kode: 'PSB',
      navn: 'Pleiepenger sykt barn',
      kodeverk: 'FAGSAK_YTELSE_TYPE',
    },
    behandlingStatus: {
      kode: 'UTRED',
      navn: 'Utredes',
      kodeverk: 'BEHANDLING_TYPE',
    },
    erTilSaksbehandling: true,
    opprettetTidspunkt: '2021-05-31T07:15:56.159',
    behandlingsfrist: '2021-06-29T07:49:13.118571868',
    eksternId: '1',
    tilBeslutter: false,
    utbetalingTilBruker: false,
    avklarArbeidsforhold: false,
    selvstendigFrilans: false,
    søktGradering: false,
    fagsakPeriode: null,
    paaVent: null,
  };

  const navAnsatt = {
    kanSaksbehandle: true,
    navn: 'Per',
  };

  it('skal vise modal med riktig data', () => {
    new RestApiTestMocker().withGlobalData(RestApiGlobalStatePathsKeys.NAV_ANSATT, navAnsatt).runTest(() => {
      const wrapper = shallowWithIntl(
        <FlyttReservasjonsmodal
          intl={intlMock}
          lukkFlyttReservasjonsmodal={sinon.spy()}
          oppgave={oppgave}
          oppgaveStatus={oppgave.status}
          openSak={sinon.spy()}
          hentReserverteOppgaver={sinon.spy()}
          hentOppgaverTilBehandling={sinon.spy()}
        />,
      );

      expect(wrapper.find(Modal)).has.length(1);
      const fmessage = wrapper.find(FormattedMessage);
      expect(fmessage).has.length(1);

      expect(fmessage.prop('id')).to.equal('FlyttReservasjonModal.ReservertAv');

      expect(fmessage.prop('values')).is.eql({
        saksbehandlerid: oppgave.status.reservertAv,
        saksbehandlernavn: oppgave.status.reservertAvNavn,
      });

      expect(wrapper.find('.flyttReservasjonModal_knapper__knapp')).has.length(3);
    });
  });
});
