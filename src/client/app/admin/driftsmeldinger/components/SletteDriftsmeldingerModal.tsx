import React, { FunctionComponent } from 'react';
import { useIntl } from 'react-intl';
import { Modal, Button } from '@navikt/ds-react';
import { Driftsmelding } from '../driftsmeldingTsType';
import { ExclamationmarkTriangleIcon } from '@navikt/aksel-icons';

type TsProps = Readonly<{
	valgtDriftsmelding: Driftsmelding;
	closeSletteModal: () => void;
	fjernDriftsmelding: (driftsmelding: Driftsmelding) => void;
}>;

/**
 * SletteDriftsmeldingModal
 *
 * Presentasjonskomponent. Modal som lar en avdelingsleder fjerne tilgjengelige saksbehandlere.
 */
const SletteDriftsmeldingModal: FunctionComponent<TsProps> = ({
	valgtDriftsmelding,
	closeSletteModal,
	fjernDriftsmelding,
}: TsProps) => {
	const intl = useIntl();

	return (
		<Modal
			open
			onClose={closeSletteModal}
			header={{
				heading: intl.formatMessage({ id: 'SletteDriftsmeldingModal.SletteDriftsmelding' }),
				closeButton: false,
				icon: <ExclamationmarkTriangleIcon />,
			}}
		>
			<Modal.Footer>
				<Button variant="primary" onClick={() => fjernDriftsmelding(valgtDriftsmelding)} autoFocus>
					{intl.formatMessage({ id: 'SletteDriftsmeldingModal.Ja' })}
				</Button>
				<Button variant="secondary" onClick={closeSletteModal}>
					{intl.formatMessage({ id: 'SletteDriftsmeldingModal.Nei' })}
				</Button>
			</Modal.Footer>
		</Modal>
	);
};

export default SletteDriftsmeldingModal;
