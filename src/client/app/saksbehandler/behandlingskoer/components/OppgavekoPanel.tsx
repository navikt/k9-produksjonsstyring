import React, { FunctionComponent, useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import NavFrontendChevron from 'nav-frontend-chevron';
import { Element, Undertittel } from 'nav-frontend-typografi';
import { OppgavekøV2MedNavn } from 'types/OppgavekøV2Type';
import { K9LosApiKeys } from 'api/k9LosApi';
import { useRestApiRunner } from 'api/rest-api-hooks';
import merknadType from 'kodeverk/merknadType';
import OppgaveTabellMenyAntallOppgaver from 'saksbehandler/behandlingskoer/components/oppgavetabeller/OppgaveTabellMenyAntallOppgaver';
import ReserverteOppgaverTabell from 'saksbehandler/behandlingskoer/components/oppgavetabeller/ReserverteOppgaverTabell';
import { OppgavekøV1 } from 'saksbehandler/behandlingskoer/oppgavekoTsType';
import Oppgave from 'saksbehandler/oppgaveTsType';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import ModalMedIkon from 'sharedComponents/modal/ModalMedIkon';
import advarselImageUrl from '../../../../images/advarsel.svg';
import RestApiState from '../../../api/rest-api-hooks/src/RestApiState';
import OppgavekoVelgerForm from './OppgavekoVelgerForm';
import styles from './oppgavekoPanel.css';
import OppgaverTabell from './oppgavetabeller/OppgaverTabell';

interface OwnProps {
	setValgtOppgavekoId: (id: string) => void;
	valgtOppgavekoId: string;
	oppgavekoer: Array<OppgavekøV1 | OppgavekøV2MedNavn>;
	apneOppgave: (oppgave: Oppgave) => void;
	reserverteOppgaver: Oppgave[];
	oppgaverTilBehandling: Oppgave[];
	hentReserverteOppgaver: () => void;
	requestFinished: boolean;
}

/**
 * OppgavekoPanel
 */
const OppgavekoPanel: FunctionComponent<OwnProps> = ({
	apneOppgave,
	oppgavekoer,
	setValgtOppgavekoId,
	valgtOppgavekoId,
	hentReserverteOppgaver,
	reserverteOppgaver,
	requestFinished,
	oppgaverTilBehandling,
}) => {
	const [visBehandlingerIKo, setVisBehandlingerIKo] = useState<boolean>(false);
	const [visReservasjoneriKo, setVisReservasjonerIKO] = useState<boolean>(true);
	const [visHastesakReservasjoner, setVisHastesakReservasjoner] = useState<boolean>(true);
	const [visFinnesIngenBehandlingerIKoModal, setVisFinnesIngenBehandlingerIKoModal] = useState<boolean>(false);
	const {
		startRequest: fåOppgaveFraKo,
		state: restApiState,
		error: restApiError,
		resetRequestData,
	} = useRestApiRunner<Oppgave>(K9LosApiKeys.FÅ_OPPGAVE_FRA_KO);

	const valgtKo = oppgavekoer.find((ko) => ko.id === valgtOppgavekoId);

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

	const plukkNyOppgave = () => {
		fåOppgaveFraKo({ oppgaveKøId: valgtOppgavekoId }).then((reservertOppgave) => {
			resetRequestData();
			apneOppgave(reservertOppgave);
		});
	};

	const hastesaker = reserverteOppgaver.filter(
		(oppgave) => oppgave.merknad?.merknadKoder?.includes(merknadType.HASTESAK),
	);
	const reserverteOppgaverUtenHastesaker = reserverteOppgaver.filter(
		(oppgave) => !oppgave.merknad?.merknadKoder?.includes(merknadType.HASTESAK),
	);

	// TODO: legge inn visning for oppgaver fra ny oppgavemodell
	return (
		<div className={styles.container}>
			<Undertittel>
				<FormattedMessage id="OppgavekoPanel.StartBehandling" />
			</Undertittel>
			<VerticalSpacer sixteenPx />
			<OppgavekoVelgerForm
				oppgavekoer={oppgavekoer}
				setValgtOppgavekoId={setValgtOppgavekoId}
				plukkNyOppgave={plukkNyOppgave}
				erRestApiKallLoading={restApiState === RestApiState.LOADING}
			/>
			<VerticalSpacer twentyPx />

			<div className={styles.behandlingskoerContainer}>
				<button
					type="button"
					className={styles.behandlingskoerKnapp}
					onClick={() => setVisHastesakReservasjoner(!visHastesakReservasjoner)}
				>
					<NavFrontendChevron type={visHastesakReservasjoner ? 'ned' : 'høyre'} className={styles.chevron} />
					<Element style={{ marginRight: '0.825rem' }}>
						<FormattedMessage id="OppgaverTabell.ReserverteHastesaker" />
					</Element>
					<OppgaveTabellMenyAntallOppgaver
						antallOppgaver={hastesaker.length}
						tekstId="OppgaverTabell.ReserverteHastesakerAntall"
						hastesak
					/>
				</button>
				{visHastesakReservasjoner && (
					<ReserverteOppgaverTabell
						hastesaker
						apneOppgave={apneOppgave}
						requestFinished={requestFinished}
						reserverteOppgaver={hastesaker}
						hentReserverteOppgaver={hentReserverteOppgaver}
					/>
				)}
				<button
					type="button"
					className={styles.behandlingskoerKnapp}
					onClick={() => setVisReservasjonerIKO(!visReservasjoneriKo)}
				>
					<NavFrontendChevron type={visReservasjoneriKo ? 'ned' : 'høyre'} className={styles.chevron} />
					<Element>
						<FormattedMessage id="OppgaverTabell.ReserverteOppgaver" />
					</Element>
					<OppgaveTabellMenyAntallOppgaver
						antallOppgaver={reserverteOppgaverUtenHastesaker?.length}
						tekstId="OppgaverTabell.ReserverteOppgaverAntall"
					/>
				</button>
				{visReservasjoneriKo && (
					<ReserverteOppgaverTabell
						apneOppgave={apneOppgave}
						requestFinished={requestFinished}
						reserverteOppgaver={reserverteOppgaverUtenHastesaker}
						hentReserverteOppgaver={hentReserverteOppgaver}
					/>
				)}
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

			{visReservasjoneriKo && <VerticalSpacer thirtyTwoPx />}
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

				{visBehandlingerIKo && (
					<OppgaverTabell
						valgtKo={valgtKo}
						valgtOppgavekoId={valgtOppgavekoId}
						oppgaverTilBehandling={oppgaverTilBehandling}
						requestFinished={requestFinished}
					/>
				)}
			</div>
		</div>
	);
};

export default OppgavekoPanel;
