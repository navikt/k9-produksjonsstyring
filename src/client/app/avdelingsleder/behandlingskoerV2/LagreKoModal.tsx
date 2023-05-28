import React from 'react';
import { BodyShort, Button, ErrorMessage, Heading, Modal } from '@navikt/ds-react';

interface LagreKoModalProps {
	visLagreModal: boolean;
	setVisLagreModal: React.Dispatch<React.SetStateAction<boolean>>;
	onSubmit: () => void;
	lagreMutation: any;
}

const LagreKoModal: React.FC<LagreKoModalProps> = ({ visLagreModal, setVisLagreModal, onSubmit, lagreMutation }) => (
	<Modal className="w-2/6" open={visLagreModal} onClose={() => setVisLagreModal(false)}>
		<Modal.Content>
			<Heading spacing level="1" size="medium">
				Lagre kø
			</Heading>
			<div className="h-[75px] flex items-center">
				<BodyShort>Er du sikker på at du ønsker å lagre køen?</BodyShort>
			</div>
			{lagreMutation.isError && (
				<div>
					<ErrorMessage>Noe gikk galt ved lagring av kø</ErrorMessage>
				</div>
			)}
			<Button className="mt-2" onClick={onSubmit}>
				Lagre kø
			</Button>
			<Button className="ml-2" variant="secondary" onClick={() => setVisLagreModal(false)}>
				Avbryt
			</Button>
		</Modal.Content>
	</Modal>
);

export default LagreKoModal;
