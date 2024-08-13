import React, { useState } from 'react';
import { TrashIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';
import { OppgavekøV3Enkel } from 'types/OppgavekøV3Type';
import SlettKøModal from './SlettKøModal';

interface Props {
	kø: OppgavekøV3Enkel;
}

const SlettKø = ({ kø }: Props) => {
	const [visSlettKøModal, setVisSlettKøModal] = useState(false);

	return (
		<>
			<Button
				variant="tertiary"
				size="small"
				icon={<TrashIcon height="1.5rem" width="1.5rem" />}
				onClick={() => setVisSlettKøModal(true)}
			>
				Slett
			</Button>
			{visSlettKøModal && <SlettKøModal lukk={() => setVisSlettKøModal(false)} køTittel={kø.tittel} id={kø.id} />}
		</>
	);
};

export default SlettKø;
