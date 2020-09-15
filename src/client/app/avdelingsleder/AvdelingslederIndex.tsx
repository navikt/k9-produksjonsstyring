import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
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
import { getNavAnsattKanOppgavestyre } from 'app/duck';
import { parseQueryString } from 'utils/urlUtils';
import { getPanelLocationCreator } from 'app/paths';
import trackRouteParam from 'app/data/trackRouteParam';
import { Location } from 'app/locationTsType';
import NokkeltallIndex from 'avdelingsleder/nokkeltall/NokkeltallIndex';
import ReservasjonerIndex from 'avdelingsleder/reservasjoner/ReservasjonerIndex';
import Tabs from 'nav-frontend-tabs';
import Image from 'sharedComponents/Image';
import { FlexRow } from 'sharedComponents/flexGrid';
import { Row } from 'nav-frontend-grid';
import { getSelectedAvdelingslederPanel, setSelectedAvdelingslederPanel } from './duck';
import AvdelingslederDashboard from './components/AvdelingslederDashboard';
import IkkeTilgangTilAvdelingslederPanel from './components/IkkeTilgangTilAvdelingslederPanel';
import AvdelingslederPanels from './avdelingslederPanels';
import EndreSaksbehandlereIndex from './bemanning/BemanningIndex';
import EndreBehandlingskoerIndex from './behandlingskoer/EndreBehandlingskoerIndex';

import styles from './avdelingslederIndex.less';

const classNames = classnames.bind(styles);

const renderAvdelingslederPanel = (avdelingslederPanel) => {
  switch (avdelingslederPanel) {
    case AvdelingslederPanels.BEHANDLINGSKOER:
      return <EndreBehandlingskoerIndex />;
    case AvdelingslederPanels.SAKSBEHANDLERE:
      return <EndreSaksbehandlereIndex />;
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
  [AvdelingslederPanels.SAKSBEHANDLERE]: 'AvdelingslederIndex.Saksbehandlere',
  [AvdelingslederPanels.NOKKELTALL]: 'AvdelingslederIndex.Nokkeltall',
  [AvdelingslederPanels.RESERVASJONER]: 'AvdelingslederIndex.Reservasjoner',
};

const tabStyle = {
  [AvdelingslederPanels.BEHANDLINGSKOER]: [koerSvart, koerBla],
  [AvdelingslederPanels.NOKKELTALL]: [nokkelSvart, nokkelBla],
  [AvdelingslederPanels.RESERVASJONER]: [reservasjonSvart, reservasjonBla],
};

interface TsProps {
  activeAvdelingslederPanel: string;
  getAvdelingslederPanelLocation: (panel: string) => Location;
  kanOppgavestyre?: boolean;
  kanBehandleKode6?: boolean;
}

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
export const AvdelingslederIndex = ({
  activeAvdelingslederPanel,
  getAvdelingslederPanelLocation,
  kanOppgavestyre,
}: TsProps) => {
  if (!kanOppgavestyre) {
    return <IkkeTilgangTilAvdelingslederPanel />;
  } if (activeAvdelingslederPanel) {
    return (
      <>
        <Row>
          <Normaltekst className={styles.paneltekst}>Avdelingslederpanel</Normaltekst>
        </Row>
        <Row>
          <AvdelingslederDashboard key={activeAvdelingslederPanel} visSaksbehandlere={activeAvdelingslederPanel === AvdelingslederPanels.BEHANDLINGSKOER}>
            <div>
              <Tabs tabs={[
                getTab(AvdelingslederPanels.BEHANDLINGSKOER, activeAvdelingslederPanel, getAvdelingslederPanelLocation),
                getTab(AvdelingslederPanels.NOKKELTALL, activeAvdelingslederPanel, getAvdelingslederPanelLocation),
                getTab(AvdelingslederPanels.RESERVASJONER, activeAvdelingslederPanel, getAvdelingslederPanelLocation),
              ]}
              />
              <Panel className={styles.panelPadding}>
                {renderAvdelingslederPanel(activeAvdelingslederPanel)}
              </Panel>
            </div>
          </AvdelingslederDashboard>
        </Row>
      </>
    );
  }
  return <LoadingPanel />;
};

AvdelingslederIndex.propTypes = {
  activeAvdelingslederPanel: PropTypes.string.isRequired,
  getAvdelingslederPanelLocation: PropTypes.func.isRequired,
  kanOppgavestyre: PropTypes.bool,
};

AvdelingslederIndex.defaultProps = {
  kanOppgavestyre: false,
};

const getPanelFromUrlOrDefault = (location) => {
  const panelFromUrl = parseQueryString(location.search);
  return panelFromUrl.avdelingsleder ? panelFromUrl.avdelingsleder : AvdelingslederPanels.BEHANDLINGSKOER;
};


const mapStateToProps = (state) => ({
  activeAvdelingslederPanel: getSelectedAvdelingslederPanel(state),
  kanOppgavestyre: getNavAnsattKanOppgavestyre(state),
});

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...ownProps,
  ...dispatchProps,
  ...stateProps,
  getAvdelingslederPanelLocation: getPanelLocationCreator(ownProps.location), // gets prop 'location' from trackRouteParam
  activeAvdelingslederPanel: stateProps.activeAvdelingslederPanel ? stateProps.activeAvdelingslederPanel : getPanelFromUrlOrDefault(ownProps.location),
});

export default trackRouteParam({
  paramName: 'fane',
  paramPropType: PropTypes.string,
  storeParam: setSelectedAvdelingslederPanel,
  getParamFromStore: getSelectedAvdelingslederPanel,
  isQueryParam: true,
})(connect(mapStateToProps, null, mergeProps)(AvdelingslederIndex));
