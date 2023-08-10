import React, { useEffect, useRef, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import Oppgave from 'saksbehandler/oppgaveTsType';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import FlyttReservasjonModal from './FlyttReservasjonModal';
import MenuButton from './MenuButton';
import OpphevReservasjonModal from './OpphevReservasjonModal';
import styles from './oppgaveHandlingerMenu.css';

const toggleEventListeners = (turnOnEventListeners, handleOutsideClick) => {
	if (turnOnEventListeners) {
		document.addEventListener('click', handleOutsideClick, false);
		document.addEventListener('mousedown', handleOutsideClick, false);
		document.addEventListener('keydown', handleOutsideClick, false);
	} else {
		document.removeEventListener('click', handleOutsideClick, false);
		document.removeEventListener('mousedown', handleOutsideClick, false);
		document.removeEventListener('keydown', handleOutsideClick, false);
	}
};

interface OwnProps {
	toggleMenu: (valgtOppgave: Oppgave) => void;
	oppgave: Oppgave;
	imageNode: any;
	forlengOppgaveReservasjon: (oppgaveId: string) => Promise<Oppgave[]>;
	hentReserverteOppgaver: (params: any, keepData: boolean) => void;
	setViserModal: (viserModal: boolean) => void;
}

const OppgaveHandlingerMenu: React.FC<OwnProps> = ({
	toggleMenu,
	oppgave,
	imageNode,
	forlengOppgaveReservasjon,
	hentReserverteOppgaver,
	setViserModal,
}) => {
	const node = useRef(null);
	const menuButtonRef = useRef(null);

	const [showOpphevReservasjonModal, setShowOpphevReservasjonModal] = useState(false);
	const [showFlyttReservasjonModal, setShowFlyttReservasjonModal] = useState(false);

	useEffect(() => {
		if (showOpphevReservasjonModal || showFlyttReservasjonModal) {
			setViserModal(true);
		} else {
			setViserModal(false);
		}
	}, [showOpphevReservasjonModal, showFlyttReservasjonModal]);

	const handleOutsideClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		if (event && event.target) {
			const harKlikketMeny = node.current && node.current.contains(event.target);
			const harKlikketIkon = imageNode && imageNode.contains(event.target);
			if (harKlikketMeny || harKlikketIkon) {
				return;
			}
		}
		toggleMenu(null);
	};

	useEffect(() => {
		if (menuButtonRef && menuButtonRef.current) {
			menuButtonRef.current.focus();
		}
		toggleEventListeners(true, handleOutsideClick);
		return () => {
			toggleEventListeners(false, handleOutsideClick);
		};
	}, []);

	const showBegrunnelseModal = () => {
		toggleEventListeners(false, handleOutsideClick);
		setShowOpphevReservasjonModal(true);
	};

	const closeBegrunnelseModal = () => {
		toggleMenu(oppgave);
		toggleEventListeners(true, handleOutsideClick);
		setShowOpphevReservasjonModal(false);
	};

	const showFlytteModal = () => {
		toggleEventListeners(false, handleOutsideClick);
		setShowFlyttReservasjonModal(true);
	};

	const closeFlytteModal = () => {
		toggleMenu(oppgave);
		setShowFlyttReservasjonModal(false);
	};

	const forlengReserverasjon = () => {
		forlengOppgaveReservasjon(oppgave.eksternId).then((_) => {
			toggleMenu(oppgave);
		});
	};

	return (
		<>
			<div className={styles.containerMenu} ref={node}>
				<VerticalSpacer eightPx />
				<MenuButton onClick={showBegrunnelseModal} ref={menuButtonRef}>
					<FormattedMessage id="OppgaveHandlingerMenu.LeggTilbake" values={{ br: <br /> }} />
				</MenuButton>
				<MenuButton onClick={forlengReserverasjon}>
					<FormattedMessage id="OppgaveHandlingerMenu.ForlengReservasjon" values={{ br: <br /> }} />
				</MenuButton>
				<MenuButton onClick={showFlytteModal}>
					<FormattedMessage id="OppgaveHandlingerMenu.FlyttReservasjon" values={{ br: <br /> }} />
				</MenuButton>
			</div>
			{showOpphevReservasjonModal && (
				<OpphevReservasjonModal
					oppgaveId={oppgave.eksternId}
					oppgaveSaksnummer={oppgave.saksnummer}
					showModal={showOpphevReservasjonModal}
					cancel={closeBegrunnelseModal}
					toggleMenu={() => toggleMenu(oppgave)}
					hentReserverteOppgaver={hentReserverteOppgaver}
				/>
			)}

			{showFlyttReservasjonModal && (
				<FlyttReservasjonModal
					oppgaveId={oppgave.eksternId}
					oppgaveReservertTil={oppgave.status.reservertTilTidspunkt.substring(0, 10)}
					showModal={showFlyttReservasjonModal}
					closeModal={closeFlytteModal}
					eksisterendeBegrunnelse={oppgave.status.flyttetReservasjon?.begrunnelse}
				/>
			)}
		</>
	);
};

export default OppgaveHandlingerMenu;
