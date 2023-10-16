import React, { FunctionComponent, useState } from 'react';
import { FormattedMessage, WrappedComponentProps, useIntl } from 'react-intl';
import advarselImageUrl from 'images/advarsel.svg';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import NavAnsatt from 'app/navAnsattTsType';
import { K9LosApiKeys, RestApiGlobalStatePathsKeys } from 'api/k9LosApi';
import { OppgaveStatus } from 'saksbehandler/oppgaveStatusTsType';
import Oppgave from 'saksbehandler/oppgaveTsType';
import Image from 'sharedComponents/Image';
import Modal from 'sharedComponents/Modal';
import useGlobalStateRestApiData from '../../../api/rest-api-hooks/src/global-data/useGlobalStateRestApiData';
import useRestApiRunner from '../../../api/rest-api-hooks/src/local-data/useRestApiRunner';
import styles from './flyttReservasjonsmodal.css';

interface OwnProps {
	oppgave: Oppgave;
	oppgaveStatus: OppgaveStatus;
	lukkFlyttReservasjonsmodal: () => void;
	openSak: (oppgave: Oppgave) => void;
	hentOppgaverTilBehandling?: () => void;
}

export const FlyttReservasjonsmodal: FunctionComponent<OwnProps & WrappedComponentProps> = ({
	oppgave,
	oppgaveStatus,
	lukkFlyttReservasjonsmodal,
	openSak,
	hentOppgaverTilBehandling,
}) => {
	const { startRequest: reserverOppgave } = useRestApiRunner<OppgaveStatus>(K9LosApiKeys.RESERVER_OPPGAVE);
	const { kanReservere } = useGlobalStateRestApiData<NavAnsatt>(RestApiGlobalStatePathsKeys.NAV_ANSATT);

	const intl = useIntl();

	const [visManglerReservasjonsrettigheterFeilmelding, setVisManglerReservasjonsrettigheterFeilmelding] =
		useState<boolean>(false);

	const overstyrReservasjonTilSaksbehandlerSomArbeiderMedAnnenPart = () => {
		if (kanReservere) {
			const params = {
				overstyrIdent: oppgaveStatus.reservertAv,
				oppgaveId: oppgave.eksternId,
				overstyrSjekk: true,
				overstyrBegrunnelse: 'Flyttes til deg fordi du jobber med den andre parts sak.',
			};
			reserverOppgave(params).then(() => {
				if (typeof hentOppgaverTilBehandling !== 'undefined') {
					hentOppgaverTilBehandling();
				}
				lukkFlyttReservasjonsmodal();
			});
		} else {
			setVisManglerReservasjonsrettigheterFeilmelding(true);
		}
	};

	const overstyrReservasjonTilInnloggetSaksbehandlerFn = () => {
		if (kanReservere) {
			const params = {
				oppgaveId: oppgave.eksternId,
				overstyrSjekk: true,
			};

			reserverOppgave(params).then((nyOppgaveStatus) => {
				if (nyOppgaveStatus.erReservert && nyOppgaveStatus.erReservertAvInnloggetBruker) {
					openSak(oppgave);
				}
			});
		} else {
			setVisManglerReservasjonsrettigheterFeilmelding(true);
		}
	};

	return (
		<Modal
			className={styles.flyttReservasjonModal}
			isOpen
			closeButton={false}
			contentLabel={intl.formatMessage({ id: 'FlyttReservasjonModal.ReservertAvEnkel' })}
			onRequestClose={() => lukkFlyttReservasjonsmodal()}
		>
			<div className={styles.oppgaveReservertAvAnnenModal}>
				<div className={styles.flyttReservasjonModal_informasjon}>
					<div className={styles.flyttReservasjonModal_image__container}>
						<Image
							className={styles.flyttReservasjonModal_image}
							alt={intl.formatMessage({ id: 'FlyttReservasjonModal.ReservertAvEnkel' })}
							src={advarselImageUrl}
						/>
					</div>
					<div className={styles.flyttReservasjonModal_text}>
						<Normaltekst>
							<FormattedMessage
								id="FlyttReservasjonModal.ReservertAv"
								values={{
									saksbehandlerid: oppgaveStatus.reservertAv,
									saksbehandlernavn: oppgaveStatus.reservertAvNavn,
								}}
							/>
						</Normaltekst>
					</div>
				</div>
				<div className={styles.flyttReservasjonModal_knapper__container}>
					<Hovedknapp
						mini
						htmlType="button"
						className={styles.flyttReservasjonModal_knapper__knapp}
						onClick={() => overstyrReservasjonTilSaksbehandlerSomArbeiderMedAnnenPart()}
					>
						{intl.formatMessage({ id: 'FlyttReservasjonModal.FlyttReservasjon' })}
					</Hovedknapp>

					<Hovedknapp
						className={styles.flyttReservasjonModal_knapper__knapp}
						mini
						htmlType="button"
						onClick={() => overstyrReservasjonTilInnloggetSaksbehandlerFn()}
					>
						{intl.formatMessage({ id: 'FlyttReservasjonModal.OverstyrReservasjon' })}
					</Hovedknapp>
					<Knapp
						className={styles.flyttReservasjonModal_knapper__knapp}
						mini
						htmlType="button"
						onClick={() => lukkFlyttReservasjonsmodal()}
						autoFocus
					>
						{intl.formatMessage({ id: 'OppgaveErReservertAvAnnenModal.GåTilKøen' })}
					</Knapp>
				</div>
				{visManglerReservasjonsrettigheterFeilmelding && (
					<div className={styles.flyttReservasjonModal__feilmelding}>
						<Element>
							<FormattedMessage id="FlyttReservasjonModal.Feil" />
						</Element>
					</div>
				)}
			</div>
		</Modal>
	);
};

export default FlyttReservasjonsmodal;
