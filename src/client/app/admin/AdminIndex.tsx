import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import classnames from 'classnames/bind';
import { NavLink } from 'react-router-dom';
import Panel from 'nav-frontend-paneler';
import Tabs from 'nav-frontend-tabs';
import { Undertittel } from 'nav-frontend-typografi';

import LoadingPanel from 'sharedComponents/LoadingPanel';
import { getNavAnsattKanDrifte } from 'app/duck';
import { parseQueryString } from 'utils/urlUtils';
import { getPanelLocationCreatorDriftsmeldinger } from 'app/paths';
import trackRouteParam from 'app/data/trackRouteParam';
import { Location } from 'app/locationTsType';
import { getSelectedPanel, setSelectedPanel } from './duck';
import AvdelingslederDashboard from './components/AvdelingslederDashboard';
import IkkeTilgangTilAvdelingslederPanel from './components/IkkeTilgangTilAvdelingslederPanel';
import AdminPanels from './AdminPanels';
import EndreDriftsmeldingerIndex from './driftsmeldinger/EndreDriftsmeldingerIndex';

import styles from './adminIndex.less';

const classNames = classnames.bind(styles);

const renderPanel = (avdelingslederPanel) => {
  switch (avdelingslederPanel) {
    case AdminPanels.DRIFTSMELDINGER:
      return <EndreDriftsmeldingerIndex />;
    default:
      return null;
  }
};

const messageId = {
  [AdminPanels.DRIFTSMELDINGER]: 'AdminIndex.Driftsmeldinger',
};

interface TsProps {
  activePanel: string;
  getDriftsmeldingerPanelLocation: (panel: string) => Location;
  kanDrifte?: boolean;
  kanBehandleKode6?: boolean;
}

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

/**
 * AdminIndex
 */
export const AdminIndex = ({
  activePanel,
  getDriftsmeldingerPanelLocation,
  kanDrifte,
}: TsProps) => {
  if (!kanDrifte) {
    return <IkkeTilgangTilAvdelingslederPanel />;
  } if (activePanel) {
    return (
      <AvdelingslederDashboard key={activePanel}>
        <div>
          <Tabs tabs={[
            getTab(AdminPanels.DRIFTSMELDINGER, activePanel, getDriftsmeldingerPanelLocation),
          ]}
          />
          <Panel className={styles.panelPadding}>
            {renderPanel(activePanel)}
          </Panel>
        </div>
      </AvdelingslederDashboard>
    );
  }
  return <LoadingPanel />;
};

AdminIndex.propTypes = {
  activePanel: PropTypes.string.isRequired,
  getDriftsmeldingerPanelLocation: PropTypes.func.isRequired,
  kanDrifte: PropTypes.bool,
};

AdminIndex.defaultProps = {
  kanDrifte: false,
};

const getPanelFromUrlOrDefault = (location) => {
  const panelFromUrl = parseQueryString(location.search);
  return panelFromUrl.avdelingsleder ? panelFromUrl.avdelingsleder : AdminPanels.DRIFTSMELDINGER;
};


const mapStateToProps = (state) => ({
  activePanel: getSelectedPanel(state),
  kanDrifte: getNavAnsattKanDrifte(state),
});

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...ownProps,
  ...dispatchProps,
  ...stateProps,
  getDriftsmeldingerPanelLocation: getPanelLocationCreatorDriftsmeldinger(ownProps.location), // gets prop 'location' from trackRouteParam
  activePanel: stateProps.activeAvdelingslederPanel ? stateProps.activeAvdelingslederPanel : getPanelFromUrlOrDefault(ownProps.location),
});

export default trackRouteParam({
  paramName: 'fane',
  paramPropType: PropTypes.string,
  storeParam: setSelectedPanel,
  getParamFromStore: getSelectedPanel,
  isQueryParam: true,
})(connect(mapStateToProps, null, mergeProps)(AdminIndex));
