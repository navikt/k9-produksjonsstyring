import React, { FunctionComponent, useState } from 'react';
import { Normaltekst } from 'nav-frontend-typografi';
import { TrashIcon } from '@navikt/aksel-icons';
import apiPaths from 'api/apiPaths';
import { Button } from '@navikt/ds-react';
import SletteSaksbehandlerModal from 'avdelingsleder/bemanning/components/SletteSaksbehandlerModal';
import { Saksbehandler } from 'avdelingsleder/bemanning/saksbehandlerTsType';
import { K9LosApiKeys } from 'api/k9LosApi';
import { useRestApiRunner } from 'api/rest-api-hooks';
import { useQueryClient } from 'react-query';
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
