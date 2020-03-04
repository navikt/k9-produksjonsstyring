
import React from 'react';
import PropTypes from 'prop-types';

import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import oppgavePropType from '../../oppgavePropType';
import { Oppgave } from '../../oppgaveTsType';
import SistBehandledeSaker from './SistBehandledeSaker';

interface TsProps {
  k9sakUrl: string;
  sistBehandledeSaker: Oppgave[];
  valgtSakslisteId?: number;
}

/**
 * SaksstottePaneler
 */
const SaksstottePaneler = ({
  k9sakUrl,
  sistBehandledeSaker,
  valgtSakslisteId,
}: TsProps) => (
  <>
    <SistBehandledeSaker k9sakUrl={k9sakUrl} sistBehandledeSaker={sistBehandledeSaker} />
    <VerticalSpacer twentyPx />
  </>
);

SaksstottePaneler.propTypes = {
  k9sakUrl: PropTypes.string.isRequired,
  sistBehandledeSaker: PropTypes.arrayOf(oppgavePropType).isRequired,
  valgtSakslisteId: PropTypes.number,
};

SaksstottePaneler.defaultProps = {
  valgtSakslisteId: undefined,
};

export default SaksstottePaneler;
