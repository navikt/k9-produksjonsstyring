import React from 'react';
import NavModal from 'nav-frontend-modal';
import PropTypes from 'prop-types';

/**
 * Modal
 *
 * Presentasjonskomponent. Wrapper Modal-komponenten fra nav-frontend-biblioteket, men tillater ikke bruk av propertien 'shouldCloseOnOverlayClick'.
 */
export const Modal = ({ children, ...otherProps }) => {
	NavModal.setAppElement('div#app');
	return (
		<NavModal ariaHideApp={false} {...otherProps}>
			{children}
		</NavModal>
	);
};

Modal.propTypes = {
	...NavModal.propTypes,
	shouldCloseOnOverlayClick: PropTypes.oneOf([false]),
};

Modal.defaultProps = {
	shouldCloseOnOverlayClick: false,
};

export default Modal;
