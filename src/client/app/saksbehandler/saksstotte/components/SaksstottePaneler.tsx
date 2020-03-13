
import React from 'react';
import PropTypes from 'prop-types';

import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import oppgavePropType from '../../oppgavePropType';
import { Oppgave } from '../../oppgaveTsType';
import SistBehandledeSaker from './SistBehandledeSaker';

interface TsProps {
  k9sakUrl: string;
  sistBehandledeSaker: Oppgave[];
}

/**
 * SaksstottePaneler
 */
const SaksstottePaneler = ({
  k9sakUrl,
  sistBehandledeSaker,
}: TsProps) => (
  <>
    <SistBehandledeSaker k9sakUrl={k9sakUrl} sistBehandledeSaker={sistBehandledeSaker} />
    <VerticalSpacer twentyPx />
  </>
);

SaksstottePaneler.propTypes = {
  k9sakUrl: PropTypes.string.isRequired,
  sistBehandledeSaker: PropTypes.arrayOf(oppgavePropType).isRequired,
};

export default SaksstottePaneler;
