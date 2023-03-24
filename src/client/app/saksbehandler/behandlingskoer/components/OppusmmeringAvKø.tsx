import React from 'react';
import { OppgavekøV2 } from 'types/OppgavekøV2Type';
import { BodyShort, Detail } from '@navikt/ds-react';
import { OppgavekøV1 } from '../oppgavekoTsType';

interface OwnProps {
	oppgavekø: OppgavekøV1 | OppgavekøV2;
}
const OppusmmeringAvKø = ({ oppgavekø }: OwnProps) => {
	if (!oppgavekø || !('versjon' in oppgavekø)) {
		return null;
	}

	return (
		<div className="ml-8">
			<Detail>Beskrivelse av køen</Detail>
			<BodyShort className="mt-4">{oppgavekø.beskrivelse}</BodyShort>
		</div>
	);
};

export default OppusmmeringAvKø;
