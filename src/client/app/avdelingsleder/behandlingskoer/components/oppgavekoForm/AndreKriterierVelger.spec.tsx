import React from 'react';
import sinon from 'sinon';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { K9LosApiKeys } from 'api/k9LosApi';
import kodeverkTyper from 'kodeverk/kodeverkTyper';
import RestApiTestMocker from '../../../../../../../setup/testHelpers/RestApiTestMocker';
import AndreKriterierVelger from './AndreKriterierVelger';

describe('<AndreKriterierVelger>', () => {
  const oppgavekø = {
    id: '65d96681-d3e9-4594-9c26-905e87b7c484',
    navn: 'Ny kø',
    sortering: {
      sorteringType: {
        kode: 'OPPRBEH',
        navn: 'Dato for opprettelse av behandling',
        felttype: 'DATO',
        feltkategori: '',
        kodeverk: 'KO_SORTERING',
      },
      fomDato: null,
      tomDato: null,
    },
    behandlingTyper: [],
    fagsakYtelseTyper: [],
    andreKriterier: [],
    skjermet: false,
    sistEndret: '2022-09-26',
    antallBehandlinger: 0,
    saksbehandlere: [],
    kriterier: [],
  };

  const andreKriterier = [
    {
      kode: '9001',
      navn: 'Sykdom',
      kodeverk: 'OPPGAVE_KODE',
      gruppering: 'Sykdom',
    },
    {
      kode: '5015',
      navn: 'Forslå vedtak',
      kodeverk: 'OPPGAVE_KODE',
      gruppering: 'Vedtak',
    },
    {
      kode: '5028',
      navn: 'Foreslå vedtak manuelt',
      kodeverk: 'OPPGAVE_KODE',
      gruppering: 'Vedtak',
    },
    {
      kode: '5016',
      navn: 'Fatte vedtak',
      kodeverk: 'OPPGAVE_KODE',
      gruppering: 'Vedtak',
    },
  ];

  it('skal kunne filtrere og vise checkbox', () => {
    const lagreOppgavekoKoderFn = sinon.spy();
    new RestApiTestMocker()
      .withKodeverk(kodeverkTyper.OPPGAVE_KODE, andreKriterier)
      .withRestCallRunner(K9LosApiKeys.LAGRE_OPPGAVEKO_KRITERIER, {
        startRequest: params => {
          lagreOppgavekoKoderFn(params);
          return Promise.resolve();
        },
      })
      .runTest(() => {
        render(<AndreKriterierVelger valgtOppgavekoId="1" valgtOppgaveko={oppgavekø} hentOppgaveko={sinon.spy()} />);
        userEvent.type(screen.getByLabelText('Velg aksjonspunkt'), 'Foreslå vedtak manuelt');
        expect(screen.getByLabelText('5028 - Foreslå vedtak manuelt')).toBeVisible();
      });
  });
});
