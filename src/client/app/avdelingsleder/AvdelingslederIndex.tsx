import React, { FunctionComponent, useEffect, useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import { useQuery } from 'react-query';
import { NavLink } from 'react-router-dom';
import classnames from 'classnames/bind';
import reservasjonBla from 'images/delete-1.svg';
import reservasjonSvart from 'images/delete-11.svg';
import koerSvart from 'images/drawer-22.svg';
import koerBla from 'images/drawer-23.svg';
import nokkelSvart from 'images/key-hole-1.svg';
import nokkelBla from 'images/key-hole-11.svg';
import prognoseBlå from 'images/prognose-bla.svg';
import prognoseSort from 'images/prognose-sort.svg';
import { Row } from 'nav-frontend-grid';
import Panel from 'nav-frontend-paneler';
import Tabs from 'nav-frontend-tabs';
import { Normaltekst, Undertittel } from 'nav-frontend-typografi';
import { PersonGroupIcon } from '@navikt/aksel-icons';
import useTrackRouteParam from 'app/data/trackRouteParam';
import NavAnsatt from 'app/navAnsattTsType';
import { getPanelLocationCreator } from 'app/paths';
import apiPaths from 'api/apiPaths';
import { K9LosApiKeys, RestApiGlobalStatePathsKeys } from 'api/k9LosApi';
import useGlobalStateRestApiData from 'api/rest-api-hooks/src/global-data/useGlobalStateRestApiData';
import useRestApiRunner from 'api/rest-api-hooks/src/local-data/useRestApiRunner';
import { Saksbehandler } from 'avdelingsleder/bemanning/saksbehandlerTsType';
import DagensTallPanel from 'avdelingsleder/dagensTall/DagensTallPanel';
import ApneBehandlinger from 'avdelingsleder/dagensTall/apneBehandlingerTsType';
import NokkeltallIndex from 'avdelingsleder/nokkeltall/NokkeltallIndex';
import PrognoseIndex from 'avdelingsleder/prognose/PrognoseIndex';
import Image from 'sharedComponents/Image';
import LoadingPanel from 'sharedComponents/LoadingPanel';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import { parseQueryString } from 'utils/urlUtils';
import { avdelingslederTilgangTilNyeKoer } from '../featureToggles';
import styles from './avdelingslederIndex.css';
import AvdelingslederPanels from './avdelingslederPanels';
import EndreBehandlingskoerIndex from './behandlingskoer/EndreBehandlingskoerIndex';
import BehandlingskoerIndex from './behandlingskoerV2/BehandlingskoerIndex';
import SaksbehandlereTabell from './bemanning/components/SaksbehandlereTabell';
import AvdelingslederDashboard from './components/AvdelingslederDashboard';
import IkkeTilgangTilAvdelingslederPanel from './components/IkkeTilgangTilAvdelingslederPanel';
import { AvdelingslederContext, AvdelingslederContextState } from './context';
import ReservasjonerTabell from './reservasjoner/components/ReservasjonerTabell';

const classNames = classnames.bind(styles);

const renderAvdelingslederPanel = (avdelingslederPanel) => {
	switch (avdelingslederPanel) {
		case AvdelingslederPanels.BEHANDLINGSKOER:
			return <EndreBehandlingskoerIndex />;
		case AvdelingslederPanels.BEHANDLINGSKOER_V2:
			return <BehandlingskoerIndex />;
		case AvdelingslederPanels.NOKKELTALL:
			return <NokkeltallIndex />;
		case AvdelingslederPanels.PROGNOSE:
			return <PrognoseIndex />;
		case AvdelingslederPanels.RESERVASJONER:
			return <ReservasjonerTabell />;
		case AvdelingslederPanels.SAKSBEHANDLERE:
			return <SaksbehandlereTabell />;
		default:
			return null;
	}
};

const messageId = {
	[AvdelingslederPanels.BEHANDLINGSKOER]: 'AvdelingslederIndex.Behandlingskoer',
	[AvdelingslederPanels.BEHANDLINGSKOER_V2]: 'AvdelingslederIndex.Behandlingskoer.V2',
	[AvdelingslederPanels.NOKKELTALL]: 'AvdelingslederIndex.Nokkeltall',
	[AvdelingslederPanels.PROGNOSE]: 'AvdelingslederIndex.Prognose',
	[AvdelingslederPanels.RESERVASJONER]: 'AvdelingslederIndex.Reservasjoner',
	[AvdelingslederPanels.SAKSBEHANDLERE]: 'AvdelingslederIndex.Saksbehandlere',
};

const tabStyle = {
	[AvdelingslederPanels.BEHANDLINGSKOER]: [koerSvart, koerBla],
	[AvdelingslederPanels.BEHANDLINGSKOER_V2]: [koerSvart, koerBla],
	[AvdelingslederPanels.NOKKELTALL]: [nokkelSvart, nokkelBla],
	[AvdelingslederPanels.PROGNOSE]: [prognoseSort, prognoseBlå],
	[AvdelingslederPanels.RESERVASJONER]: [reservasjonSvart, reservasjonBla],
	[AvdelingslederPanels.SAKSBEHANDLERE]: [
		<PersonGroupIcon key="aktiv" title="a11y-title" fontSize="1.5rem" />,
		<PersonGroupIcon key="inaktiv" title="a11y-title" fontSize="1.5rem" />,
	],
};

type TabProps = {
	label: React.ReactNode;
	aktiv: boolean;
	linkCreator: (props: { children: React.ReactNode; className: string }) => React.ReactNode;
};

const getTab = (
	avdelingslederPanel: string,
	activeAvdelingslederPanel: string,
	getAvdelingslederPanelLocation: (panel: string) => string,
): TabProps => {
	const isActive = avdelingslederPanel === activeAvdelingslederPanel;
	const icon = isActive ? tabStyle[avdelingslederPanel][0] : tabStyle[avdelingslederPanel][1];

	return {
		label: (
			<div className={styles.tabLabel}>
				{typeof icon === 'string' ? <Image className={styles.tabIcon} src={icon} /> : icon}
				<Undertittel>
					<FormattedMessage id={messageId[avdelingslederPanel]} />
				</Undertittel>
			</div>
		),
		aktiv: isActive,
		linkCreator: ({ children, className }) => (
			<NavLink
				to={getAvdelingslederPanelLocation(avdelingslederPanel)}
				className={classNames(className, 'link', { isActive })}
			>
				{children}
			</NavLink>
		),
	};
};

/**
 * AvdelingslederIndex
 */
export const AvdelingslederIndex: FunctionComponent = () => {
	const { selected: activeAvdelingslederPanelTemp, location } = useTrackRouteParam({
		paramName: 'fane',
		isQueryParam: true,
	});

	const { startRequest: hentAntallIdag, data: totaltIdag = 0 } = useRestApiRunner<number>(
		K9LosApiKeys.OPPGAVE_ANTALL_TOTALT,
	);
	const { startRequest: hentDagensTall, data: dagensTall = [] } = useRestApiRunner<ApneBehandlinger[]>(
		K9LosApiKeys.HENT_DAGENS_TALL,
	);

	const { data: alleSaksbehandlere, isSuccess } = useQuery<Saksbehandler[]>(apiPaths.hentSaksbehandlere);

	useEffect(() => {
		hentAntallIdag();
		hentDagensTall();
	}, []);

	const avdelingslederContextValue = useMemo<AvdelingslederContextState>(
		() => ({
			saksbehandlere: isSuccess ? alleSaksbehandlere : [],
		}),
		[alleSaksbehandlere],
	);

	const getPanelFromUrlOrDefault = (loc) => {
		const panelFromUrl = parseQueryString(loc.search);
		return panelFromUrl.avdelingsleder ? panelFromUrl.avdelingsleder : AvdelingslederPanels.BEHANDLINGSKOER;
	};

	const { kanOppgavestyre } = useGlobalStateRestApiData<NavAnsatt>(RestApiGlobalStatePathsKeys.NAV_ANSATT);

	const getAvdelingslederPanelLocation = getPanelLocationCreator(location);
	const activeAvdelingslederPanel = activeAvdelingslederPanelTemp || getPanelFromUrlOrDefault(location);

	if (!kanOppgavestyre) {
		return <IkkeTilgangTilAvdelingslederPanel />;
	}

	if (activeAvdelingslederPanel) {
		return (
			<AvdelingslederContext.Provider value={avdelingslederContextValue}>
				<Row>
					<Normaltekst className={styles.paneltekst}>Avdelingslederpanel</Normaltekst>
				</Row>
				<Row>
					<DagensTallPanel totaltIdag={totaltIdag} dagensTall={dagensTall} />
				</Row>
				<VerticalSpacer twentyPx />
				<Row>
					<AvdelingslederDashboard>
						<div>
							<Tabs
								tabs={[
									getTab(
										AvdelingslederPanels.BEHANDLINGSKOER,
										activeAvdelingslederPanel,
										getAvdelingslederPanelLocation,
									),
									avdelingslederTilgangTilNyeKoer() &&
										getTab(
											AvdelingslederPanels.BEHANDLINGSKOER_V2,
											activeAvdelingslederPanel,
											getAvdelingslederPanelLocation,
										),
									getTab(AvdelingslederPanels.NOKKELTALL, activeAvdelingslederPanel, getAvdelingslederPanelLocation),
									getTab(AvdelingslederPanels.PROGNOSE, activeAvdelingslederPanel, getAvdelingslederPanelLocation),
									getTab(AvdelingslederPanels.RESERVASJONER, activeAvdelingslederPanel, getAvdelingslederPanelLocation),
									getTab(
										AvdelingslederPanels.SAKSBEHANDLERE,
										activeAvdelingslederPanel,
										getAvdelingslederPanelLocation,
									),
								].filter(Boolean)}
							/>
							<Panel className={styles.panelPadding}>{renderAvdelingslederPanel(activeAvdelingslederPanel)}</Panel>
						</div>
					</AvdelingslederDashboard>
				</Row>
			</AvdelingslederContext.Provider>
		);
	}
	return <LoadingPanel />;
};

export default AvdelingslederIndex;
