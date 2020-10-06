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
import { K9LosApiKeys, RestApiGlobalStatePathsKeys } from 'api/k9LosApi';
import useRestApi from 'api/rest-api-hooks/src/local-data/useRestApi';
import useTrackRouteParam from 'app/data/trackRouteParam';
import IkkeTilgangTilAvdelingslederPanel from './components/IkkeTilgangTilAvdelingslederPanel';
import AdminPanels from './AdminPanels';
import EndreDriftsmeldingerIndex from './driftsmeldinger/EndreDriftsmeldingerIndex';

import styles from './adminIndex.less';
import AdminDashboard from './components/AdminDashboard';
import { Driftsmelding } from './driftsmeldinger/driftsmeldingTsType';

const classNames = classnames.bind(styles);

const renderPanel = (avdelingslederPanel, driftsmeldinger) => {
  switch (avdelingslederPanel) {
    case AdminPanels.DRIFTSMELDINGER:
      return <EndreDriftsmeldingerIndex alleDriftsmeldinger={driftsmeldinger} />;
    default:
      return null;
  }
};

const messageId = {
  [AdminPanels.DRIFTSMELDINGER]: 'AdminIndex.Driftsmeldinger',
};

const getTab = (avdelingslederPanel, activeAvdelingslederPanel, getDriftsmeldingerPanelLocation) => ({
  label: (<Undertittel><FormattedMessage id={messageId[avdelingslederPanel]} /></Undertittel>),
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

const hentPanelFromUrlOrDefault = (location) => {
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
  const { data: driftsmeldinger = [] } = useRestApi<Driftsmelding[]>(K9LosApiKeys.DRIFTSMELDINGER);

  if (!kanDrifte) {
    return <IkkeTilgangTilAvdelingslederPanel />;
  } if (activePanel) {
    return (
      <AdminDashboard key={activePanel}>
        <div>
          <Tabs tabs={[
            getTab(AdminPanels.DRIFTSMELDINGER, activePanel, getDriftsmeldingerPanelLocation),
          ]}
          />
          <Panel className={styles.panelPadding}>
            {renderPanel(activePanel, driftsmeldinger)}
          </Panel>
        </div>
      </AdminDashboard>
    );
  }
  return <LoadingPanel />;
};

export default AdminIndex;
