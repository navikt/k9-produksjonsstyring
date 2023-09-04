import React, { FunctionComponent, useState } from 'react';
import { Normaltekst } from 'nav-frontend-typografi';
import { v4 as uuid4 } from 'uuid';
import { TrashIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';
import SletteSaksbehandlerModal from 'avdelingsleder/bemanning/components/SletteSaksbehandlerModal';
import { Saksbehandler } from 'avdelingsleder/bemanning/saksbehandlerTsType';
import styles from './saksbehandlerInfo.css';

interface OwnProps {
	saksbehandler: Saksbehandler;
	fjernSaksbehandler: (epost: string) => void;
}

const SaksbehandlerInfo: FunctionComponent<OwnProps> = ({ saksbehandler, fjernSaksbehandler }) => {
	const [visSlettModal, setVisSlettModal] = useState(false);
	const lukkSlettModal = () => {
		setVisSlettModal(false);
	};

	return (
		<div>
			<Normaltekst className={styles.overskrift}>Køer</Normaltekst>
			{!saksbehandler?.oppgavekoer?.length && <Normaltekst className={styles.info}>Ingen køer tildelt</Normaltekst>}
			{saksbehandler?.oppgavekoer?.length > 0 &&
				saksbehandler.oppgavekoer.map((ko) => (
					<Normaltekst key={ko} className={styles.info}>
						{ko}
					</Normaltekst>
				))}
			{/* eslint-disable-next-line jsx-a11y/interactive-supports-focus */}
			<Button
				onClick={() => {
					setVisSlettModal(true);
				}}
				className="bg-red-400 hover:bg-red-600 mt-6"
				size="small"
				icon={<TrashIcon />}
			>
				Slett saksbehandler
			</Button>
			{visSlettModal === true && (
				<SletteSaksbehandlerModal
					valgtSaksbehandler={saksbehandler}
					closeSletteModal={lukkSlettModal}
					fjernSaksbehandler={fjernSaksbehandler}
				/>
			)}
		</div>
	);
};

export default SaksbehandlerInfo;
