import React, { useState } from 'react';
import { OppgavekøV2Enkel } from 'types/OppgavekøV2Type';
import KopierKøModal from './KopierKøModal';
import SlettKøModal from './SlettKøModal';

interface Props {
	kø: OppgavekøV2Enkel;
}

const ModalContainer = ({ kø }: Props) => {
	const [visSlettKøModal, setVisSlettKøModal] = useState(false);
	const [visKopierKøModal, setVisKopierKøModal] = useState(false);

	return (
		<div>
			{' '}
			{visSlettKøModal && <SlettKøModal lukk={() => setVisSlettKøModal(false)} id={kø.id} køTittel={kø.tittel} />}
			{visKopierKøModal && <KopierKøModal lukk={() => setVisKopierKøModal(false)} eksisterendeKø={kø} />}
		</div>
	);
};

export default ModalContainer;
