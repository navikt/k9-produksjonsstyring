import React from 'react';
import { action } from '@storybook/addon-actions';
import koSortering from 'kodeverk/KoSortering';
import andreKriterierType from 'kodeverk/andreKriterierType';
import behandlingType from 'kodeverk/behandlingType';
import fagsakYtelseType from 'kodeverk/fagsakYtelseType';
import { OppgavekoVelgerForm } from 'saksbehandler/behandlingskoer/components/OppgavekoVelgerForm';
import withIntl from '../../../decorators/withIntl.js';

export default {
  title: 'saksbehandler/behandlingskoer/OppgavekoVelgerForm',
  component: OppgavekoVelgerForm,
  decorators: [withIntl],
};

export const skalViseValgtKøOgUtvalgskriterier = intl => (
  <OppgavekoVelgerForm
    intl={intl}
    oppgavekoer={[
      {
        oppgavekoId: 1,
        navn: 'Oppgaveko 1',
        behandlingTyper: [
          {
            kode: behandlingType.FORSTEGANGSSOKNAD,
            navn: 'Førstegangssøknad',
          },
          {
            kode: behandlingType.REVURDERING,
            navn: 'Revurdering',
          },
        ],
        fagsakYtelseTyper: [
          {
            kode: fagsakYtelseType.OMSORGSPENGER,
            navn: 'Foreldrepenger',
          },
        ],
        andreKriterier: [
          {
            andreKriterierType: {
              kode: andreKriterierType.TIL_BESLUTTER,
              navn: 'Til beslutter',
            },
            inkluder: true,
          },
        ],
        sortering: {
          sorteringType: {
            kode: koSortering.BEHANDLINGSFRIST,
            navn: 'Behandlingsfrist',
          },
          fra: 2,
          til: 4,
          erDynamiskPeriode: true,
        },
      },
    ]}
    fetchOppgavekoOppgaver={action('button-click')}
    fetchOppgavekonsSaksbehandlere={action('button-click')}
    fetchAntallOppgaverForBehandlingsko={action('button-click')}
    saksbehandlere={[
      {
        brukerIdent: {
          brukerIdent: '32434',
          verdi: '32434',
        },
        navn: 'Espen Utvikler',
        avdelingsnavn: [],
      },
      {
        brukerIdent: {
          brukerIdent: '31111',
          verdi: '32111',
        },
        navn: 'Auto Joakim',
        avdelingsnavn: [],
      },
    ]}
  />
);
