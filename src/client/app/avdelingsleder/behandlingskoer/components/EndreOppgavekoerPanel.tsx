import React, { FunctionComponent, useEffect } from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import useRestApiRunner from 'api/rest-api-hooks/src/local-data/useRestApiRunner';
import { K9LosApiKeys } from 'api/k9LosApi';
import RestApiState from 'api/rest-api-hooks/src/RestApiState';
import { Oppgaveko } from '../oppgavekoTsType';
import GjeldendeOppgavekoerTabell from './GjeldendeOppgavekoerTabell';

interface OwnProps {
  setValgtOppgavekoId: (id: string) => void;
  valgtOppgavekoId?: string;
  resetValgtOppgavekoId: () => void;
}

/**
 * EndreOppgavekoerPanel
 */
const EndreOppgavekoerPanel: FunctionComponent<OwnProps & WrappedComponentProps> = ({
  setValgtOppgavekoId,
  valgtOppgavekoId,
  resetValgtOppgavekoId,
}) => {
  const { data: oppgaverAntallTotalt, startRequest: hentOppgaverAntallTotalt } = useRestApiRunner<number>(K9LosApiKeys.OPPGAVE_ANTALL_TOTALT);
  const { data: oppgavekoer = [], startRequest: hentAlleOppgavekoer, state } = useRestApiRunner<Oppgaveko[]>(K9LosApiKeys.OPPGAVEKOER);
  const requestFinished = state === RestApiState.SUCCESS;
  // eslint-disable-next-line
  console.log('EndreOppgavekoerPanel');
  useEffect(() => {
    hentOppgaverAntallTotalt();
    hentAlleOppgavekoer();
  }, [hentAlleOppgavekoer]);

  return (
    <GjeldendeOppgavekoerTabell
      oppgavekoer={oppgavekoer}
      resetValgtOppgavekoId={resetValgtOppgavekoId}
      requestFinished={requestFinished}
      setValgtOppgavekoId={setValgtOppgavekoId}
      valgtOppgavekoId={valgtOppgavekoId}
      oppgaverTotalt={oppgaverAntallTotalt}
      hentAlleOppgavekoer={hentAlleOppgavekoer}
    />
  );
};

export default injectIntl(EndreOppgavekoerPanel);
