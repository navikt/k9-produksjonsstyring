import React, { useCallback, useState } from 'react';
import { SaksbehandlereForOppgavekoForm } from 'avdelingsleder/behandlingskoer/components/saksbehandlerForm/SaksbehandlereForOppgavekoForm';
import withIntl from '../../../decorators/withIntl.js';

export default {
  title: 'avdelingsleder/behandlingskoer/SaksbehandlereForOppgavekoForm',
  component: SaksbehandlereForOppgavekoForm,
  decorators: [withIntl],
};

export const skalVisePanelForÅLeggeSaksbehandlereTilEnOppgaveko = () => {
  const [oppgaveko, setOppgaveko] = useState({
    oppgavekoId: 1,
    navn: 'Oppgaveko 1',
    sistEndret: '2020-01-01',
    saksbehandlerIdenter: ['S34354'],
    antallBehandlinger: 1,
  });

  const leggTilSaksbehandler = useCallback((_oppgavekoId, brukerIdent, isChecked) => {
    setOppgaveko(oldState => ({
      ...oldState,
      saksbehandlerIdenter: isChecked
        ? oldState.saksbehandlerIdenter.concat(brukerIdent)
        : oldState.saksbehandlerIdenter.filter(i => i !== brukerIdent),
    }));
  }, []);

  return (
    <SaksbehandlereForOppgavekoForm
      valgtOppgaveko={oppgaveko}
      avdelingensSaksbehandlere={[
        {
          brukerIdent: 'E23232',
          navn: 'Espen Utvikler',
          avdelingsnavn: ['NAV Viken'],
        },
        {
          brukerIdent: 'S34354',
          navn: 'Steffen',
          avdelingsnavn: ['NAV Viken'],
        },
        {
          brukerIdent: 'E24353',
          navn: 'Eirik',
          avdelingsnavn: ['NAV Viken'],
        },
      ]}
      knyttSaksbehandlerTilOppgaveko={leggTilSaksbehandler}
    />
  );
};
