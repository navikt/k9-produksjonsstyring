import React, { FunctionComponent, useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import NavFrontendChevron from 'nav-frontend-chevron';
import { Element, Undertittel } from 'nav-frontend-typografi';
import { K9LosApiKeys } from 'api/k9LosApi';
import { useSaksbehandlerReservasjoner } from 'api/queries/saksbehandlerQueries';
import { useRestApiRunner } from 'api/rest-api-hooks';
import merknadType from 'kodeverk/merknadType';
import OppgaveTabellMenyAntallOppgaver from 'saksbehandler/behandlingskoer/components/oppgavetabeller/OppgaveTabellMenyAntallOppgaver';
import ReserverteOppgaverTabell from 'saksbehandler/behandlingskoer/components/oppgavetabeller/ReserverteOppgaverTabell';
import Oppgave from 'saksbehandler/oppgaveTsType';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import ModalMedIkon from 'sharedComponents/modal/ModalMedIkon';
import {
	getValueFromLocalStorage,
	removeValueFromLocalStorage,
	setValueInLocalStorage,
} from 'utils/localStorageHelper';
import advarselImageUrl from '../../../../images/advarsel.svg';
import RestApiState from '../../../api/rest-api-hooks/src/RestApiState';
import OppgavekoVelgerForm from './OppgavekoVelgerForm';
import styles from './oppgavekoPanel.css';
import OppgaverTabell from './oppgavetabeller/OppgaverTabell';

interface OwnProps {
	apneOppgave: (oppgave: Oppgave) => void;
}

/**
 * OppgavekoPanel
 */
const OppgavekoPanel: FunctionComponent<OwnProps> = ({ apneOppgave }) => {
	const [visBehandlingerIKo, setVisBehandlingerIKo] = useState<boolean>(false);
	const [visFinnesIngenBehandlingerIKoModal, setVisFinnesIngenBehandlingerIKoModal] = useState<boolean>(false);
	const {
		startRequest: fåOppgaveFraKo,
		state: restApiState,
		error: restApiError,
		resetRequestData,
	} = useRestApiRunner<Oppgave>(K9LosApiKeys.FÅ_OPPGAVE_FRA_KO);

	useEffect(() => {
		if (
			restApiState &&
			restApiState === RestApiState.ERROR &&
			restApiError &&
			restApiError.toString().includes('404')
		) {
			setVisFinnesIngenBehandlingerIKoModal(true);
			resetRequestData();
		}
	}, [restApiState, restApiError]);

	// TODOKOER
	const plukkNyOppgave = () => {
		fåOppgaveFraKo({ oppgaveKøId: valgtOppgavekoId }).then((reservertOppgave) => {
			resetRequestData();
			apneOppgave(reservertOppgave);
		});
	};

	// TODO: legge inn visning for oppgaver fra ny oppgavemodell
	return (
		<div className={styles.container}>
			<Undertittel>
				<FormattedMessage id="OppgavekoPanel.StartBehandling" />
			</Undertittel>
			<VerticalSpacer sixteenPx />
			<OppgavekoVelgerForm
				getValueFromLocalStorage={getValueFromLocalStorage}
				setValueInLocalStorage={setValueInLocalStorage}
				removeValueFromLocalStorage={removeValueFromLocalStorage}
				plukkNyOppgave={plukkNyOppgave}
				erRestApiKallLoading={restApiState === RestApiState.LOADING}
			/>
			<VerticalSpacer twentyPx />

			<div className={styles.behandlingskoerContainer}>
				<ReserverteOppgaverTabell gjelderHastesaker apneOppgave={apneOppgave} />
				<ReserverteOppgaverTabell apneOppgave={apneOppgave} />
			</div>
			<VerticalSpacer eightPx />

			{visFinnesIngenBehandlingerIKoModal && (
				<ModalMedIkon
					cancel={() => setVisFinnesIngenBehandlingerIKoModal(false)}
					tekst={{
						valgmulighetB: 'Gå tilbake til køen',
						formattedMessageId: 'IngenOppgaverIKonModan.Tekst',
					}}
					ikonUrl={advarselImageUrl}
					ikonAlt="Varseltrekant"
				/>
			)}

			<div className={styles.behandlingskoerContainer}>
				<button
					type="button"
					className={styles.behandlingskoerKnapp}
					onClick={() => setVisBehandlingerIKo(!visBehandlingerIKo)}
				>
					<NavFrontendChevron type={visBehandlingerIKo ? 'ned' : 'høyre'} className={styles.chevron} />
					<Element>
						<FormattedMessage id="OppgaverTabell.DineNesteSaker" />
					</Element>
				</button>

				{visBehandlingerIKo &&
					('tittel' in valgtKo ? (
						<div>{valgtKo.tittel}</div>
					) : (
						<OppgaverTabell
							valgtKo={valgtKo}
							valgtOppgavekoId={valgtOppgavekoId}
							oppgaverTilBehandling={oppgaverTilBehandling}
							requestFinished={requestFinished}
						/>
					))}
			</div>
		</div>
	);
};

export default OppgavekoPanel;
