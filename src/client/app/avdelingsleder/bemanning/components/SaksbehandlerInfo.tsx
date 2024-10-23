import React, { FunctionComponent, useState } from 'react';
import { useQueryClient } from 'react-query';
import { TrashIcon } from '@navikt/aksel-icons';
import { BodyShort, Button } from '@navikt/ds-react';
import apiPaths from 'api/apiPaths';
import { K9LosApiKeys } from 'api/k9LosApi';
import { useSlettSaksbehandler } from 'api/queries/avdelingslederQueries';
import { useRestApiRunner } from 'api/rest-api-hooks';
import SletteSaksbehandlerModal from 'avdelingsleder/bemanning/components/SletteSaksbehandlerModal';
import { Saksbehandler } from 'avdelingsleder/bemanning/saksbehandlerTsType';
import * as styles from './saksbehandlerInfo.css';

interface OwnProps {
	saksbehandler: Saksbehandler;
}

const SaksbehandlerInfo: FunctionComponent<OwnProps> = ({ saksbehandler }) => {
	const [visSlettModal, setVisSlettModal] = useState(false);
	const lukkSlettModal = () => {
		setVisSlettModal(false);
	};

	const { mutate } = useSlettSaksbehandler();
	const slettSaksbehandler = () => mutate({ epost: saksbehandler.epost }, { onSuccess: lukkSlettModal });

	return (
		<div>
			<BodyShort className={styles.overskrift}>Køer</BodyShort>
			{!saksbehandler?.oppgavekoer?.length && <BodyShort className={styles.info}>Ingen køer tildelt</BodyShort>}
			{saksbehandler?.oppgavekoer?.length > 0 &&
				saksbehandler.oppgavekoer.map((ko) => (
					<BodyShort size="small" key={ko} className={styles.info}>
						{ko}
					</BodyShort>
				))}
			{/* eslint-disable-next-line jsx-a11y/interactive-supports-focus */}
			<Button
				onClick={() => {
					setVisSlettModal(true);
				}}
				className="bg-red-400 hover:bg-red-600 mt-6"
				size="small"
				icon={<TrashIcon height="1.5rem" width="1.5rem" />}
			>
				Slett saksbehandler
			</Button>
			{visSlettModal && (
				<SletteSaksbehandlerModal
					valgtSaksbehandler={saksbehandler}
					closeSletteModal={lukkSlettModal}
					slettSaksbehandler={slettSaksbehandler}
				/>
			)}
		</div>
	);
};

export default SaksbehandlerInfo;
