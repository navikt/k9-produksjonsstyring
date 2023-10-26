import React, { useState } from 'react';
import { OppgavekøV3Enkel } from 'types/OppgavekøV3Type';
import { TrashIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';
import KopierKøModal from './KopierKøModal';

interface Props {
	kø: OppgavekøV3Enkel;
}

const SlettKø = ({ kø }: Props) => {
	const [visSlettKøModal, setVisSlettKøModal] = useState(false);

	return (
		<>
			<Button variant="tertiary" size="small" icon={<TrashIcon />} onClick={() => setVisSlettKøModal(true)}>
				Slett
			</Button>
			{visSlettKøModal && <KopierKøModal lukk={() => setVisSlettKøModal(false)} eksisterendeKø={kø} />}
		</>
	);
};

export default SlettKø;
