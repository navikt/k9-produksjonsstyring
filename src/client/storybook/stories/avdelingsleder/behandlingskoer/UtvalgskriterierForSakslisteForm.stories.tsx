import React from 'react';
import { action } from '@storybook/addon-actions';

import { UtvalgskriterierForOppgavekoForm } from 'avdelingsleder/behandlingskoer/components/oppgavekoForm/UtvalgskriterierForOppgavekoForm';
import koSortering from 'kodeverk/KoSortering';
import andreKriterierType from 'kodeverk/andreKriterierType';
import behandlingType from 'kodeverk/behandlingType';
import fagsakYtelseType from 'kodeverk/fagsakYtelseType';

import withIntl from '../../../decorators/withIntl.js';
import alleKodeverk from '../../../mocks/alleKodeverk.json';

export default {
  title: 'avdelingsleder/behandlingskoer/UtvalgskriterierForOppgavekoForm',
  component: UtvalgskriterierForOppgavekoForm,
  decorators: [withIntl],
};

export const skalViseOppgavekoOppsettPanel = (intl) => (
  <UtvalgskriterierForOppgavekoForm
    intl={intl}
    valgtOppgaveko={{
      oppgavekoId: 1,
      navn: 'Oppgaveko 1',
      sistEndret: '2020-10-10',
      saksbehandlerIdenter: [],
      antallBehandlinger: 1,
      sortering: {
        sorteringType: {
          kode: koSortering.BEHANDLINGSFRIST,
          navn: 'Behandlingsfrist',
          felttype: '',
          feltkategori: '',
        },
        fra: 1,
        til: 4,
        erDynamiskPeriode: true,
      },
      behandlingTyper: [{
        kode: behandlingType.FORSTEGANGSSOKNAD,
        navn: 'Førstegangssøknad',
      }],
      fagsakYtelseTyper: [{
        kode: fagsakYtelseType.FORELDREPRENGER,
        navn: 'Foreldrepenger',
      }],
      andreKriterier: [{
        andreKriterierType: {
          kode: andreKriterierType.TIL_BESLUTTER,
          navn: 'Til beslutter',
        },
        inkluder: true,
      }, {
        andreKriterierType: {
          kode: andreKriterierType.REGISTRER_PAPIRSOKNAD,
          navn: 'Registrer papirsøknad',
        },
        inkluder: false,
      }],
    }}
    antallOppgaver={2}
    lagreOppgavekoNavn={action('button-click')}
    lagreOppgavekoBehandlingstype={action('button-click')}
    lagreOppgavekoFagsakYtelseType={action('button-click')}
    lagreOppgavekoAndreKriterier={action('button-click')}
    valgtAvdelingEnhet=""
    hentAntallOppgaverForOppgaveko={action('button-click') as () => Promise<string>}
    alleKodeverk={alleKodeverk}
    lagreOppgavekoSortering={action('button-click')}
    lagreOppgavekoSorteringErDynamiskPeriode={action('button-click')}
    lagreOppgavekoSorteringTidsintervallDato={action('button-click')}
    lagreOppgavekoSorteringNumeriskIntervall={action('button-click')}
  />
);
