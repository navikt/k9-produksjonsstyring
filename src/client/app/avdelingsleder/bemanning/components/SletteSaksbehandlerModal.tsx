import React, { FunctionComponent } from 'react';
import { BodyLong, Button, Modal } from '@navikt/ds-react';
import { Saksbehandler } from '../saksbehandlerTsType';
import { ExclamationmarkTriangleIcon } from '@navikt/aksel-icons';

type OwnProps = Readonly<{
	valgtSaksbehandler: Saksbehandler;
	closeSletteModal: () => void;
	fjernSaksbehandler: (epost: string) => void;
}>;

/**
 * SletteSaksbehandlerModal
 *
 * Presentasjonskomponent. Modal som lar en avdelingsleder fjerne tilgjengelige saksbehandlere.
 */
const SletteSaksbehandlerModal: FunctionComponent<OwnProps> = ({
	valgtSaksbehandler,
	closeSletteModal,
	fjernSaksbehandler,
}) => (
	<>
		<Modal
			header={{ heading: 'Ønsker du å slette saksbehandler?', icon: <ExclamationmarkTriangleIcon /> }}
			onClose={closeSletteModal}
			className="min-w-[500px]"
			open
		>
			<Modal.Body>
				<BodyLong>
					{`Er du sikker på at du vil slette ${
						valgtSaksbehandler.navn || valgtSaksbehandler.epost
					}? Saksbehandleren kan fortsatt logge inn i K9Los og søke opp oppgaver, men vil ikke kunne reservere oppgaver eller legges til i køer.`}
				</BodyLong>
			</Modal.Body>
			<Modal.Footer>
				<Button onClick={() => fjernSaksbehandler(valgtSaksbehandler.epost)}>Ja</Button>
				<Button variant="secondary" onClick={closeSletteModal}>
					Nei
				</Button>
			</Modal.Footer>
		</Modal>
	</>
);

export default SletteSaksbehandlerModal;
