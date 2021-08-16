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
import AvdelingslederDashboard from './components/AvdelingslederDashboard';
import IkkeTilgangTilAvdelingslederPanel from './components/IkkeTilgangTilAvdelingslederPanel';
import AvdelingslederPanels from './avdelingslederPanels';
import EndreBehandlingskoerIndex from './behandlingskoer/EndreBehandlingskoerIndex';

import styles from './avdelingslederIndex.less';

const classNames = classnames.bind(styles);

const renderAvdelingslederPanel = (avdelingslederPanel) => {
  switch (avdelingslederPanel) {
    case AvdelingslederPanels.BEHANDLINGSKOER:
      return <EndreBehandlingskoerIndex />;
    case AvdelingslederPanels.NOKKELTALL:
      return <NokkeltallIndex />;
    case AvdelingslederPanels.RESERVASJONER:
      return <ReservasjonerIndex />;
    default:
      return null;
  }
};

const messageId = {
  [AvdelingslederPanels.BEHANDLINGSKOER]: 'AvdelingslederIndex.Behandlingskoer',
  [AvdelingslederPanels.NOKKELTALL]: 'AvdelingslederIndex.Nokkeltall',
  [AvdelingslederPanels.RESERVASJONER]: 'AvdelingslederIndex.Reservasjoner',
};

const tabStyle = {
  [AvdelingslederPanels.BEHANDLINGSKOER]: [koerSvart, koerBla],
  [AvdelingslederPanels.NOKKELTALL]: [nokkelSvart, nokkelBla],
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
export const AvdelingslederIndex: FunctionComponent = (
) => <LoadingPanel />;

export default AvdelingslederIndex;
