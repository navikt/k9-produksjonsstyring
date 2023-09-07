import React from 'react';
import { BodyShort, Button, ErrorMessage, Heading, Modal } from '@navikt/ds-react';

interface LagreKoModalProps {
	visLagreModal: boolean;
	setVisLagreModal: React.Dispatch<React.SetStateAction<boolean>>;
	onSubmit: () => void;
	lagreMutation: any;
}

const LagreKoModal: React.FC<LagreKoModalProps> = ({ visLagreModal, setVisLagreModal, onSubmit, lagreMutation }) => {
	const onClose = () => {
		setVisLagreModal(false);
		lagreMutation.reset();
	};
	return (
		<Modal className="w-2/6" open={visLagreModal} onClose={onClose} portal>
			<Modal.Body>
				<Heading spacing level="1" size="medium">
					Lagre behandlingskø
				</Heading>
				<div className="h-[75px] flex items-center">
					<BodyShort>Er du sikker på at du ønsker å lagre behandlingskøen?</BodyShort>
				</div>
				{lagreMutation.isError && (
					<div>
						<ErrorMessage>Noe gikk galt ved lagring av kø</ErrorMessage>
					</div>
				)}
				<Button className="mt-2" onClick={onSubmit}>
					Lagre behandlingskø
				</Button>
				<Button className="ml-2" variant="secondary" onClick={onClose}>
					Avbryt
				</Button>
			</Modal.Body>
		</Modal>
	);
};

export default LagreKoModal;
