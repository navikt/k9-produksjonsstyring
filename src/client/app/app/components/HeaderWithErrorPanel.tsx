import React, { FunctionComponent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import { useNavigate } from 'react-router';
import { MenuGridIcon } from '@navikt/aksel-icons';
import { ActionMenu, Dropdown, InternalHeader, Spacer } from '@navikt/ds-react';
import Endringslogg from '@navikt/familie-endringslogg';
import { BoxedListWithLinks, Header, SystemButton } from '@navikt/ft-plattform-komponenter';
import DriftsmeldingPanel from 'app/components/DriftsmeldingPanel';
import ErrorFormatter from 'app/feilhandtering/ErrorFormatter';
import { RETTSKILDE_URL, SHAREPOINT_URL } from 'api/eksterneLenker';
import useRestApiError from 'api/error/useRestApiError';
import useRestApiErrorDispatcher from 'api/error/useRestApiErrorDispatcher';
import { K9LosApiKeys } from 'api/k9LosApi';
import { useInnloggetSaksbehandler } from 'api/queries/saksbehandlerQueries';
import useRestApi from 'api/rest-api-hooks/src/local-data/useRestApi';
import { Driftsmelding } from '../../admin/driftsmeldinger/driftsmeldingTsType';
import ErrorMessagePanel from './ErrorMessagePanel';
import * as styles from './headerWithErrorPanel.css';

interface OwnProps {
	queryStrings: {
		errormessage?: string;
		errorcode?: string;
	};
	crashMessage?: string;
}

const isDev = !window.location.hostname.includes('intern.nav.no');

const useOutsideClickEvent = (
	erLenkepanelApent,
	erAvdelingerPanelApent,
	setLenkePanelApent,
	setAvdelingerPanelApent,
) => {
	const wrapperRef = useRef(null);
	const handleClickOutside = useCallback(
		(event) => {
			if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
				setLenkePanelApent(false);
				setAvdelingerPanelApent(false);
			}
		},
		[wrapperRef.current],
	);

	useEffect(() => {
		if (erLenkepanelApent || erAvdelingerPanelApent) {
			document.addEventListener('mousedown', handleClickOutside);
		} else {
			document.removeEventListener('mousedown', handleClickOutside);
		}
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [erLenkepanelApent, erAvdelingerPanelApent]);

	return wrapperRef;
};

/**
 * HeaderWithErrorPanel
 *
 * Presentasjonskomponent. Definerer header-linjen som alltid vises øverst nettleservinduet.
 * Denne viser lenke tilbake til hovedsiden, nettside-navnet og NAV-ansatt navn.
 * I tillegg vil den vise potensielle feilmeldinger i ErrorMessagePanel.
 */
const HeaderWithErrorPanel: FunctionComponent<OwnProps> = ({ queryStrings, crashMessage }) => {
	const [erLenkePanelApent, setLenkePanelApent] = useState(false);
	const [erAvdelingerPanelApent, setAvdelingerPanelApent] = useState(false);
	const navigate = useNavigate();
	const intl = useIntl();

	const { data: innloggetSaksbehandler } = useInnloggetSaksbehandler();
	const { data: driftsmeldinger = [] } = useRestApi<Driftsmelding[]>(K9LosApiKeys.DRIFTSMELDINGER);

	const errorMessages = useRestApiError() || [];

	const formaterteFeilmeldinger = useMemo(
		() => new ErrorFormatter().format(errorMessages, crashMessage),
		[errorMessages],
	);
	const { removeErrorMessage } = useRestApiErrorDispatcher();
	const wrapperRef = useOutsideClickEvent(
		erLenkePanelApent,
		erAvdelingerPanelApent,
		setLenkePanelApent,
		setAvdelingerPanelApent,
	);
	const fixedHeaderRef = useRef(null);

	const goTilAvdelingslederPanel = () => {
		navigate('/avdelingsleder');
	};

	const goTilDriftsmeldingerPanel = () => {
		navigate('/admin');
	};

	const goToHomepage = () => {
		navigate('/');
	};

	const loggUt = () => {
		window.location.assign('/logout');
		setTimeout(() => {
			goToHomepage();
		}, 1000);
	};

	const visAvdelingslederKnapp = (): boolean => {
		if (!innloggetSaksbehandler?.kanOppgavestyre) {
			return false;
		}
		if (innloggetSaksbehandler?.kanOppgavestyre && window.location.href.includes('avdelingsleder')) {
			return false;
		}
		return true;
	};

	const visAdminKnapp = (): boolean => {
		if (!innloggetSaksbehandler?.kanDrifte) {
			return false;
		}
		if (innloggetSaksbehandler?.kanDrifte && window.location.href.includes('admin')) {
			return false;
		}
		return true;
	};

	const popperPropsChildren = useCallback(
		() => (
			<BoxedListWithLinks
				onClick={() => {
					setLenkePanelApent(false);
				}}
				items={[
					{
						name: intl.formatMessage({ id: 'Header.Rettskilde' }),
						href: RETTSKILDE_URL,
						isExternal: true,
					},
					{
						name: intl.formatMessage({ id: 'Header.Sharepoint' }),
						href: SHAREPOINT_URL,
						isExternal: true,
					},
				]}
			/>
		),
		[],
	);

	const referencePropsChildren = useCallback(
		({ ref }) => (
			<div ref={ref}>
				<SystemButton
					onClick={() => {
						if (erAvdelingerPanelApent) {
							setAvdelingerPanelApent(false);
						}
						setLenkePanelApent(!erLenkePanelApent);
					}}
					isToggled={erLenkePanelApent}
				/>
			</div>
		),
		[erLenkePanelApent],
	);

	return (
		<header ref={fixedHeaderRef} className={`${styles.container} ${isDev ? styles.containerDev : ''}`}>
			<div ref={wrapperRef}>
				<Header title={intl.formatMessage({ id: 'Header.K9Los' })} changeLocation={goToHomepage}>
					{visAdminKnapp() && (
						<button type="button" className={styles.knapp} onClick={goTilDriftsmeldingerPanel}>
							Driftsmeldinger
						</button>
					)}
					{visAvdelingslederKnapp() && (
						<button type="button" className={styles.knapp} onClick={goTilAvdelingslederPanel}>
							Avdelingslederpanel
						</button>
					)}
					{/*
            Går mot en backend som foreldrepenger styrer.
            https://github.com/navikt/familie-endringslogg
            For å nå backend lokalt må man være tilkoblet naisdevice og kjøre opp k9-sak-web på port 8000 pga CORS
            */}
					{innloggetSaksbehandler?.brukerIdent && window.location.hostname.includes('nav') && (
						<div className={styles['endringslogg-container']}>
							<Endringslogg
								userId={innloggetSaksbehandler?.brukerIdent}
								appId="K9_SAK"
								appName="K9 Sak"
								backendUrl={
									isDev
										? 'https://familie-endringslogg.intern.dev.nav.no'
										: 'https://familie-endringslogg.intern.nav.no'
								}
								stil="lys"
								alignLeft
								maxEntries={150}
							/>
						</div>
					)}
					<ActionMenu>
						<ActionMenu.Trigger>
							<InternalHeader.Button>
								<MenuGridIcon fontSize="1.5rem" title="Systemer og oppslagsverk" />
							</InternalHeader.Button>
						</ActionMenu.Trigger>
						<ActionMenu.Content>
							<ActionMenu.Group label="Systemer og oppslagsverk">
								<ActionMenu.Item>
									<a href={RETTSKILDE_URL} target="_blank" rel="noopener noreferrer">
										Rettskilde
									</a>
								</ActionMenu.Item>
								<ActionMenu.Item>
									<a href={SHAREPOINT_URL} target="_blank" rel="noopener noreferrer">
										Sharepoint
									</a>
								</ActionMenu.Item>
							</ActionMenu.Group>
						</ActionMenu.Content>
					</ActionMenu>
					<Dropdown.Menu.Divider />
					<Spacer />
					<InternalHeader.User className="text-white" name="Ola Normann" />
					{isDev && (
						<button type="button" className={styles.knapp} onClick={loggUt}>
							Logg ut
						</button>
					)}
				</Header>
			</div>
			<DriftsmeldingPanel driftsmeldinger={driftsmeldinger} />
			<ErrorMessagePanel
				errorMessages={formaterteFeilmeldinger}
				queryStrings={queryStrings}
				removeErrorMessages={removeErrorMessage}
			/>
		</header>
	);
};

export default HeaderWithErrorPanel;
