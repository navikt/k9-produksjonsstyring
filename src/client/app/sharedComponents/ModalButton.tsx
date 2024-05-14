import React, { useState } from 'react';

interface Props {
	renderButton: React.FunctionComponent<{ openModal: () => void }>;
	renderModal: React.FunctionComponent<{ open: boolean; closeModal: () => void }>;
}

const ModalButton = (props: Props) => {
	const [open, setOpen] = useState(false);

	return (
		<>
			{props.renderButton({ openModal: () => setOpen(true) })}
			{open && props.renderModal({ open, closeModal: () => setOpen(false) })}
		</>
	);
};

export default ModalButton;
