import React from 'react';
import AksjonspunkterPerEnhetPanel from 'avdelingsleder/nokkeltall/components/aksjonspunkterPerEnhet/AksjonspunkterPerEnhetPanel';
import InngangOgFerdigstiltePanel from 'avdelingsleder/nokkeltall/components/dagensTallPanel/InngangOgFerdigstiltePanel';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';

function NokkeltallIndex() {
	return (
		<div>
			<InngangOgFerdigstiltePanel />
			<VerticalSpacer twentyPx />
			<AksjonspunkterPerEnhetPanel />
		</div>
	);
}

export default NokkeltallIndex;
