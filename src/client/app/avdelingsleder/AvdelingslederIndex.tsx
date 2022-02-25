import React, { FunctionComponent, useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import classnames from 'classnames/bind';
import { NavLink } from 'react-router-dom';
import Panel from 'nav-frontend-paneler';
import { Normaltekst, Undertittel } from 'nav-frontend-typografi';
import reservasjonBla from 'images/delete-1.svg';
import reservasjonSvart from 'images/delete-11.svg';
import nokkelSvart from 'images/key-hole-1.svg';
import nokkelBla from 'images/key-hole-11.svg';
import koerBla from 'images/drawer-23.svg';
import koerSvart from 'images/drawer-22.svg';
import prognoseBlå from 'images/prognose-bla.svg';
import prognoseSort from 'images/prognose-sort.svg';
import LoadingPanel from 'sharedComponents/LoadingPanel';
import { parseQueryString } from 'utils/urlUtils';
import { getPanelLocationCreator } from 'app/paths';
import NokkeltallIndex from 'avdelingsleder/nokkeltall/NokkeltallIndex';
import ReservasjonerIndex from 'avdelingsleder/reservasjoner/ReservasjonerIndex';
import Tabs from 'nav-frontend-tabs';
import Image from 'sharedComponents/Image';
import { Row } from 'nav-frontend-grid';
import DagensTallPanel from 'avdelingsleder/dagensTall/DagensTallPanel';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import useGlobalStateRestApiData from 'api/rest-api-hooks/src/global-data/useGlobalStateRestApiData';
import { K9LosApiKeys, RestApiGlobalStatePathsKeys } from 'api/k9LosApi';
import NavAnsatt from 'app/navAnsattTsType';
import useTrackRouteParam from 'app/data/trackRouteParam';
import useRestApiRunner from 'api/rest-api-hooks/src/local-data/useRestApiRunner';
import ApneBehandlinger from 'avdelingsleder/dagensTall/apneBehandlingerTsType';
import PrognoseIndex from 'avdelingsleder/prognose/PrognoseIndex';
import AvdelingslederDashboard from './components/AvdelingslederDashboard';
import IkkeTilgangTilAvdelingslederPanel from './components/IkkeTilgangTilAvdelingslederPanel';
import AvdelingslederPanels from './avdelingslederPanels';
import EndreBehandlingskoerIndex from './behandlingskoer/EndreBehandlingskoerIndex';

import styles from './avdelingslederIndex.less';
import {Button} from "@navikt/ds-react";

const classNames = classnames.bind(styles);

const renderAvdelingslederPanel = (avdelingslederPanel) => {
  switch (avdelingslederPanel) {
    case AvdelingslederPanels.BEHANDLINGSKOER:
      return <EndreBehandlingskoerIndex />;
    case AvdelingslederPanels.NOKKELTALL:
      return <NokkeltallIndex />;
    case AvdelingslederPanels.PROGNOSE:
      return <PrognoseIndex />;
    case AvdelingslederPanels.RESERVASJONER:
      return <ReservasjonerIndex />;
    default:
      return null;
  }
};

const messageId = {
  [AvdelingslederPanels.BEHANDLINGSKOER]: 'AvdelingslederIndex.Behandlingskoer',
  [AvdelingslederPanels.NOKKELTALL]: 'AvdelingslederIndex.Nokkeltall',
  [AvdelingslederPanels.PROGNOSE]: 'AvdelingslederIndex.Prognose',
  [AvdelingslederPanels.RESERVASJONER]: 'AvdelingslederIndex.Reservasjoner',
};

const tabStyle = {
  [AvdelingslederPanels.BEHANDLINGSKOER]: [koerSvart, koerBla],
  [AvdelingslederPanels.NOKKELTALL]: [nokkelSvart, nokkelBla],
  [AvdelingslederPanels.PROGNOSE]: [prognoseSort, prognoseBlå],
  [AvdelingslederPanels.RESERVASJONER]: [reservasjonSvart, reservasjonBla],
};

const getTab = (avdelingslederPanel, activeAvdelingslederPanel, getAvdelingslederPanelLocation) => ({
  label: (
    <div className={styles.tabLabel}>
      <Image
        className={styles.tabIcon}
        src={activeAvdelingslederPanel === avdelingslederPanel ? tabStyle[avdelingslederPanel][0] : tabStyle[avdelingslederPanel][1]}
      />
      <Undertittel><FormattedMessage id={messageId[avdelingslederPanel]} /></Undertittel>
    </div>),
  aktiv: avdelingslederPanel === activeAvdelingslederPanel,
  // eslint-disable-next-line react/prop-types
  linkCreator: ({ children, className }) => (
    <NavLink
      to={getAvdelingslederPanelLocation(avdelingslederPanel)}
      className={classNames(className, 'link', { isActive: activeAvdelingslederPanel === avdelingslederPanel })}
    >
      {children}
    </NavLink>
  ),
});

/**
 * AvdelingslederIndex
 */
export const AvdelingslederIndex: FunctionComponent = () => {
  const { selected: activeAvdelingslederPanelTemp, location } = useTrackRouteParam({
    paramName: 'fane',
    isQueryParam: true,
  });

  const { startRequest: hentAntallIdag, data: totaltIdag = 0 } = useRestApiRunner<number>(K9LosApiKeys.OPPGAVE_ANTALL_TOTALT);
  const { startRequest: hentDagensTall, data: dagensTall = [] } = useRestApiRunner<ApneBehandlinger[]>(K9LosApiKeys.HENT_DAGENS_TALL);

  useEffect(() => {
    hentAntallIdag();
    hentDagensTall();
  }, []);

  const getPanelFromUrlOrDefault = (loc) => {
    const panelFromUrl = parseQueryString(loc.search);
    return panelFromUrl.avdelingsleder ? panelFromUrl.avdelingsleder : AvdelingslederPanels.BEHANDLINGSKOER;
  };

  const { kanOppgavestyre } = useGlobalStateRestApiData<NavAnsatt>(RestApiGlobalStatePathsKeys.NAV_ANSATT);

  const getAvdelingslederPanelLocation = getPanelLocationCreator(location);
  const activeAvdelingslederPanel = activeAvdelingslederPanelTemp || getPanelFromUrlOrDefault(location);

  const hellu = () => {
    console.log('hi');
    //@ts-ignore
    denneFinnesIkke();
  };

  if (!kanOppgavestyre) {
    return <IkkeTilgangTilAvdelingslederPanel />;
  }

  if (activeAvdelingslederPanel) {
    return (
      <>
        <Row>
          <Normaltekst className={styles.paneltekst}>Avdelingslederpanel</Normaltekst>
        </Row>
        <Row>
          <DagensTallPanel totaltIdag={totaltIdag} dagensTall={dagensTall} />
        </Row>
        <VerticalSpacer twentyPx />
        <Row>
          <AvdelingslederDashboard key={activeAvdelingslederPanel} visSaksbehandlere={activeAvdelingslederPanel === AvdelingslederPanels.BEHANDLINGSKOER}>
            <div>
              <Tabs tabs={[
                getTab(AvdelingslederPanels.BEHANDLINGSKOER, activeAvdelingslederPanel, getAvdelingslederPanelLocation),
                getTab(AvdelingslederPanels.NOKKELTALL, activeAvdelingslederPanel, getAvdelingslederPanelLocation),
                getTab(AvdelingslederPanels.PROGNOSE, activeAvdelingslederPanel, getAvdelingslederPanelLocation),
                getTab(AvdelingslederPanels.RESERVASJONER, activeAvdelingslederPanel, getAvdelingslederPanelLocation),
              ]}
              />
              <Panel className={styles.panelPadding}>
                {renderAvdelingslederPanel(activeAvdelingslederPanel)}
              </Panel>
            </div>
          </AvdelingslederDashboard>
          <Button onClick={() => hellu()}>Generere sentry feil</Button>
        </Row>
      </>
    );
  }
  return <LoadingPanel />;
};

export default AvdelingslederIndex;
