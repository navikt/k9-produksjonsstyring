import React, { FunctionComponent, useCallback, useEffect } from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import useRestApiRunner from 'api/rest-api-hooks/local-data/useRestApiRunner';
import { K9LosApiKeys } from 'api/k9LosApi';
import RestApiState from 'api/rest-api-hooks/RestApiState';
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

  const { data: nyOppgavekoObject, startRequest: lagNyOppgaveko } = useRestApiRunner<{id: string}>(K9LosApiKeys.OPPRETT_NY_OPPGAVEKO);

  const lagNyOppgavekoFn = useCallback(() => {
    lagNyOppgaveko().then(() => {
      resetValgtOppgavekoId();
      hentAlleOppgavekoer();
    });
  }, []);

  const nyId = nyOppgavekoObject ? nyOppgavekoObject.id : undefined;
  const valgtId = valgtOppgavekoId !== undefined ? valgtOppgavekoId : nyId;

  const valgtOppgaveko = oppgavekoer.find((s) => s.id === valgtId);

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
      lagNyOppgaveko={lagNyOppgavekoFn}
    />
  );
};

export default injectIntl(EndreOppgavekoerPanel);
