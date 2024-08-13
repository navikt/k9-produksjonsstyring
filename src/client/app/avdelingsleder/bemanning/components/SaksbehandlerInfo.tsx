import React, { FunctionComponent, useState } from 'react';
import { useQueryClient } from 'react-query';
import { TrashIcon } from '@navikt/aksel-icons';
import { BodyShort, Button } from '@navikt/ds-react';
import apiPaths from 'api/apiPaths';
import { K9LosApiKeys } from 'api/k9LosApi';
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

	const queryClient = useQueryClient();

	const { startRequest: fjernSaksbehandler } = useRestApiRunner<Saksbehandler>(K9LosApiKeys.SLETT_SAKSBEHANDLER);
	const fjernSaksbehandlerFn = (epost: string) =>
		fjernSaksbehandler({ epost }).then(() => {
			queryClient.invalidateQueries({ queryKey: apiPaths.hentSaksbehandlereAvdelingsleder });
			lukkSlettModal();
		});

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
				icon={<TrashIcon />}
			>
				Slett saksbehandler
			</Button>
			{visSlettModal && (
				<SletteSaksbehandlerModal
					valgtSaksbehandler={saksbehandler}
					closeSletteModal={lukkSlettModal}
					fjernSaksbehandler={fjernSaksbehandlerFn}
				/>
			)}
		</div>
	);
};

export default SaksbehandlerInfo;
