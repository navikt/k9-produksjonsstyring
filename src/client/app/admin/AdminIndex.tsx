import React, { FunctionComponent } from 'react';
import { FormattedMessage } from 'react-intl';
import classnames from 'classnames/bind';
import { NavLink } from 'react-router-dom';
import Panel from 'nav-frontend-paneler';
import Tabs from 'nav-frontend-tabs';
import { Undertittel } from 'nav-frontend-typografi';

import LoadingPanel from 'sharedComponents/LoadingPanel';
import { parseQueryString } from 'utils/urlUtils';
import { getPanelLocationCreator } from 'app/paths';
import useGlobalStateRestApiData from 'api/rest-api-hooks/src/global-data/useGlobalStateRestApiData';
import NavAnsatt from 'app/navAnsattTsType';
import { RestApiGlobalStatePathsKeys } from 'api/k9LosApi';
import useTrackRouteParam from 'app/data/trackRouteParam';
import IkkeTilgangTilAvdelingslederPanel from './components/IkkeTilgangTilAvdelingslederPanel';
import AdminPanels from './AdminPanels';

import styles from './adminIndex.css';
import AdminDashboard from './components/AdminDashboard';
import EndreDriftsmeldingerIndex from './driftsmeldinger/EndreDriftsmeldingerIndex';

const classNames = classnames.bind(styles);

const renderPanel = avdelingslederPanel => {
  if (avdelingslederPanel === AdminPanels.DRIFTSMELDINGER) {
    return <EndreDriftsmeldingerIndex />;
  }
  return null;
};

const messageId = {
  [AdminPanels.DRIFTSMELDINGER]: 'AdminIndex.Driftsmeldinger',
};

const getTab = (avdelingslederPanel, activeAvdelingslederPanel, getDriftsmeldingerPanelLocation) => ({
  label: (
    <Undertittel>
      <FormattedMessage id={messageId[avdelingslederPanel]} />
    </Undertittel>
  ),
  aktiv: avdelingslederPanel === activeAvdelingslederPanel,
  // eslint-disable-next-line react/prop-types
  linkCreator: ({ children, className }) => (
    <NavLink
      to={getDriftsmeldingerPanelLocation(avdelingslederPanel)}
      className={classNames(className, 'link', { isActive: activeAvdelingslederPanel === avdelingslederPanel })}
    >
      {children}
    </NavLink>
  ),
});

const hentPanelFromUrlOrDefault = location => {
  const panelFromUrl = parseQueryString(location.search);
  return panelFromUrl.avdelingsleder ? panelFromUrl.avdelingsleder : AdminPanels.DRIFTSMELDINGER;
};

/**
 * AdminIndex
 */
export const AdminIndex: FunctionComponent = () => {
  const { selected: activePanelTemp, location } = useTrackRouteParam({
    paramName: 'fane',
    isQueryParam: true,
  });
  const getDriftsmeldingerPanelLocation = getPanelLocationCreator(location);
  const activePanel = activePanelTemp || hentPanelFromUrlOrDefault(location);

  const { kanDrifte } = useGlobalStateRestApiData<NavAnsatt>(RestApiGlobalStatePathsKeys.NAV_ANSATT);

  if (!kanDrifte) {
    return <IkkeTilgangTilAvdelingslederPanel />;
  }
  if (activePanel) {
    return (
      <AdminDashboard key={activePanel}>
        <div>
          <Tabs tabs={[getTab(AdminPanels.DRIFTSMELDINGER, activePanel, getDriftsmeldingerPanelLocation)]} />
          <Panel className={styles.panelPadding}>{renderPanel(activePanel)}</Panel>
        </div>
      </AdminDashboard>
    );
  }
  return <LoadingPanel />;
};

export default AdminIndex;
