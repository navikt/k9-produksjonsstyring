import React, { useState } from 'react';
import { action } from '@storybook/addon-actions';

import GjeldendeOppgavekoerTabell from 'avdelingsleder/behandlingskoer/components/GjeldendeOppgavekoerTabell';
import Oppgaveko from 'avdelingsleder/behandlingskoer/oppgavekoTsType';

import withIntl from '../../../decorators/withIntl';

export default {
  title: 'avdelingsleder/behandlingskoer/GjeldendeOppgavekoTabell',
  component: GjeldendeOppgavekoTabell,
  decorators: [withIntl],
};

export const skalVisePanelNårDetIkkeFinnesBehandlingskøer = () => {
  const [opgavekoer, setOppgaveko] = useState([]);
  return (
    <GjeldendeOppgavekoerTabell
      opgavekoer={opgavekoer}
      setValgtOppgavekoId={action('button-click')}
      lagNyOppgaveko={() => setOppgaveko([{
        opgavekoId: 1,
        navn: 'Ny liste',
        sistEndret: '2020-01-01',
        saksbehandlerIdenter: [],
        antallBehandlinger: 1,
      }])}
      fjernOppgaveko={action('button-click')}
      behandlingTyper={[]}
      fagsakYtelseTyper={[]}
      hentAvdelingensOppgaveko={action('button-click') as () => Oppgaveko[]}
      hentAntallOppgaverForAvdeling={action('button-click') as () => Promise<string>}
    />
  );
};

export const skalVisePanelNårDetFinnesEnBehandlingskø = () => {
  const [opgavekoer, setOppgaveko] = useState([{
    opgavekoId: 1,
    navn: 'Oppgaveko 1',
    sistEndret: '2020-01-01',
    saksbehandlerIdenter: ['R23233'],
    antallBehandlinger: 1,
  }]);
  return (
    <GjeldendeOppgavekoerTabell
      opgavekoer={opgavekoer}
      valgtOppgavekoId={1}
      setValgtOppgavekoId={action('button-click')}
      lagNyOppgaveko={() => setOppgaveko([{
        opgavekoId: 2,
        navn: 'Ny liste',
        sistEndret: '2020-01-01',
        saksbehandlerIdenter: [],
        antallBehandlinger: 1,
      }])}
      fjernOppgaveko={action('button-click')}
      behandlingTyper={[]}
      fagsakYtelseTyper={[]}
      hentAvdelingensOppgaveko={action('button-click') as () => Oppgaveko[]}
      hentAntallOppgaverForAvdeling={action('button-click') as () => Promise<string>}
      oppgaverForAvdeling={23}
    />
  );
};
