
import React, { FunctionComponent } from 'react';
import PropTypes from 'prop-types';

import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import { SaksbehandlerNokkeltallIndex } from 'saksbehandler/saksstotte/nokkeltall/SaksbehandlerNokkeltallIndex';
import { fetchNyeOgFerdigstilteOppgaverNokkeltall } from 'saksbehandler/saksstotte/nokkeltall/duck';
import oppgavePropType from '../../oppgavePropType';
import { Oppgave } from '../../oppgaveTsType';
import SistBehandledeSaker from './SistBehandledeSaker';

interface TsProps {
  k9sakUrl: string;
  sistBehandledeSaker: Oppgave[];
  valgtOppgavekoId?: string;
}

/**
 * SaksstottePaneler
 */
const SaksstottePaneler = ({
  k9sakUrl,
  sistBehandledeSaker,
  valgtOppgavekoId,
}: TsProps) => (
  <>
    <SistBehandledeSaker k9sakUrl={k9sakUrl} sistBehandledeSaker={sistBehandledeSaker} />
    <VerticalSpacer twentyPx />
    {valgtOppgavekoId
      && (
      <SaksbehandlerNokkeltallIndex
        valgtOppgavekoId={valgtOppgavekoId}
        fetchNyeOgFerdigstilteOppgaverNokkeltall={fetchNyeOgFerdigstilteOppgaverNokkeltall}
      />
      )}
  </>
);

SaksstottePaneler.propTypes = {
  k9sakUrl: PropTypes.string.isRequired,
  sistBehandledeSaker: PropTypes.arrayOf(oppgavePropType).isRequired,
  valgtOppgavekoId: PropTypes.string,
};

export default SaksstottePaneler;
