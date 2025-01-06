import React from 'react';
import PropTypes from 'prop-types';
import { Detail } from '@navikt/ds-react';
import * as styles from './menuButton.css';

type TsProps = Readonly<{
	onClick: () => void;
	children: JSX.Element;
}>;

/**
 * MenuButton
 *
 * Presentasjonskomponent. Lager lenker i behandlingsmeny
 */
const MenuButton = React.forwardRef(({ onClick, children }: TsProps, ref) => (
	<button ref={ref} className={styles.button} onClick={onClick} type="button">
		<Detail>{children}</Detail>
	</button>
));

MenuButton.propTypes = {
	onClick: PropTypes.func.isRequired,
	children: PropTypes.element.isRequired,
};

export default MenuButton;
