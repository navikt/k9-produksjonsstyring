import React, { FunctionComponent, useContext, useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import NavFrontendChevron from 'nav-frontend-chevron';
import { ExclamationmarkTriangleIcon } from '@navikt/aksel-icons';
import { Button, Heading, Label, Modal } from '@navikt/ds-react';
import { K9LosApiKeys } from 'api/k9LosApi';
import { usePlukkOppgaveMutation } from 'api/queries/saksbehandlerQueries';
import { useRestApiRunner } from 'api/rest-api-hooks';
import BehandlingskoerContext from 'saksbehandler/BehandlingskoerContext';
import ReserverteOppgaverTabell from 'saksbehandler/behandlingskoer/components/oppgavetabeller/ReserverteOppgaverTabell';
import Oppgave from 'saksbehandler/oppgaveTsType';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import { getKoId } from '../utils';
import OppgavekoVelgerForm from './OppgavekoVelgerForm';
import * as styles from './oppgavekoPanel.css';
import { OppgavetabellV3Container } from './oppgavetabeller/OppgavetabellV3Container';

interface OwnProps {
	apneOppgave: (oppgave: Oppgave) => void;
}

/**
 * OppgavekoPanel
 */
const OppgavekoPanel: FunctionComponent<OwnProps> = ({ apneOppgave }) => {
	const [visBehandlingerIKo, setVisBehandlingerIKo] = useState<boolean>(false);
	const { valgtOppgavekoId, oppgavekoer } = useContext(BehandlingskoerContext);
	const [visFinnesIngenBehandlingerIKoModal, setVisFinnesIngenBehandlingerIKoModal] = useState<boolean>(false);
	const { startRequest: leggTilBehandletOppgave } = useRestApiRunner(K9LosApiKeys.LEGG_TIL_BEHANDLET_OPPGAVE);
	const { mutate, error, isPending } = usePlukkOppgaveMutation((oppgave) => {
		leggTilBehandletOppgave(oppgave.oppgaveNøkkelDto);
		window.location.assign(oppgave.oppgavebehandlingsUrl);
	});

	useEffect(() => {
		if (error && error.toString().includes('404')) {
			setVisFinnesIngenBehandlingerIKoModal(true);
		}
	}, [error]);

	const plukkNyOppgave = () => {
		mutate({
			oppgaveKøId: getKoId(valgtOppgavekoId),
		});
	};

	const valgtOppgaveko = oppgavekoer.find((s) => valgtOppgavekoId === `${s.id}`);
	const lukkFinnesIngenBehandlingerIKoModal = () => setVisFinnesIngenBehandlingerIKoModal(false);
	return (
		<div className={styles.container}>
			<Heading size="small">
				<FormattedMessage id="OppgavekoPanel.StartBehandling" />
			</Heading>
			<VerticalSpacer sixteenPx />
			<OppgavekoVelgerForm plukkNyOppgave={plukkNyOppgave} loadingOppgaveFraKo={isPending} />
			<VerticalSpacer twentyPx />
			<div className={styles.behandlingskoerContainer}>
				<ReserverteOppgaverTabell gjelderHastesaker apneOppgave={apneOppgave} />
				<ReserverteOppgaverTabell apneOppgave={apneOppgave} />
			</div>
			<VerticalSpacer eightPx />
			{visFinnesIngenBehandlingerIKoModal && (
				<Modal
					className="min-w-[500px]"
					open
					onClose={lukkFinnesIngenBehandlingerIKoModal}
					header={{ heading: 'Ingen flere ureserverte oppgaver i køen', icon: <ExclamationmarkTriangleIcon /> }}
				>
					<Modal.Body>
						Det ser ut til at det ikke er flere ureserverte behandlinger i den valgte køen. Prøv å velge en annen kø for
						å fortsette.
					</Modal.Body>
					<Modal.Footer>
						<Button onClick={lukkFinnesIngenBehandlingerIKoModal}>Lukk</Button>
					</Modal.Footer>
				</Modal>
			)}
			<div className={styles.behandlingskoerContainer}>
				<button
					type="button"
					className={styles.behandlingskoerKnapp}
					onClick={() => setVisBehandlingerIKo(!visBehandlingerIKo)}
				>
					<NavFrontendChevron type={visBehandlingerIKo ? 'ned' : 'høyre'} className={styles.chevron} />
					<Label>
						<FormattedMessage id="OppgaverTabell.DineNesteSaker" />
					</Label>
				</button>

				{visBehandlingerIKo && valgtOppgaveko && <OppgavetabellV3Container />}
			</div>
		</div>
	);
};

export default OppgavekoPanel;
