import React, { FunctionComponent } from 'react';
import { FormattedMessage, WrappedComponentProps, injectIntl, useIntl } from 'react-intl';
import { Modal, Button, Alert, Heading } from '@navikt/ds-react';
import { WarningColored } from '@navikt/ds-icons';
import { Driftsmelding } from '../driftsmeldingTsType';

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
const SletteDriftsmeldingModal: FunctionComponent<TsProps & WrappedComponentProps> = ({
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
