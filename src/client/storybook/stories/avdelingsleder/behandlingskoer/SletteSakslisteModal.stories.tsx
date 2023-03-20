import React from 'react';
import { action } from '@storybook/addon-actions';
import SletteOppgavekoModal from 'avdelingsleder/behandlingskoer/components/SletteOppgavekoModal';
import withIntl from '../../../decorators/withIntl.js';

export default {
	title: 'avdelingsleder/behandlingskoer/SletteOppgavekoModal',
	component: SletteOppgavekoModal,
	decorators: [withIntl],
};

export const skalViseModalForSlettingAvOppgaveko = () => (
	<SletteOppgavekoModal
		valgtOppgaveko={{
			oppgavekoId: 1,
			navn: 'Oppgaveko 1',
			sistEndret: '2020-01-01',
			saksbehandlerIdenter: [],
			antallBehandlinger: 2,
		}}
		cancel={action('button-click')}
		submit={action('button-click')}
	/>
);
