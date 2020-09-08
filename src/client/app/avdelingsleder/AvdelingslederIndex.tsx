import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import classnames from 'classnames/bind';
import { NavLink } from 'react-router-dom';
import Panel from 'nav-frontend-paneler';
import { Normaltekst, Undertittel } from 'nav-frontend-typografi';
import reservasjonIcon from 'images/reservasjon.svg';
import nokkelIcon from 'images/keyhole.svg';
import koerIcon from 'images/drawer.svg';
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
import { getSelectedAvdelingslederPanel, setSelectedAvdelingslederPanel } from './duck';
import AvdelingslederDashboard from './components/AvdelingslederDashboard';
import IkkeTilgangTilAvdelingslederPanel from './components/IkkeTilgangTilAvdelingslederPanel';
import AvdelingslederPanels from './avdelingslederPanels';
import EndreSaksbehandlereIndex from './saksbehandlere/EndreSaksbehandlereIndex';
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
  [AvdelingslederPanels.BEHANDLINGSKOER]: [styles.koer, koerIcon],
  [AvdelingslederPanels.NOKKELTALL]: [styles.nokkeltall, nokkelIcon],
  [AvdelingslederPanels.RESERVASJONER]: [styles.reservasjoner, reservasjonIcon],
};

interface TsProps {
  activeAvdelingslederPanel: string;
  getAvdelingslederPanelLocation: (panel: string) => Location;
  kanOppgavestyre?: boolean;
  kanBehandleKode6?: boolean;
}

const getTab = (avdelingslederPanel, activeAvdelingslederPanel, getAvdelingslederPanelLocation) => ({
  label: (<div>
    <Image className={tabStyle[avdelingslederPanel][0]} src={tabStyle[avdelingslederPanel][1]} />
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
      <AvdelingslederDashboard key={activeAvdelingslederPanel}>
        <Normaltekst className={styles.paneltekst}>Avdelingslederpanel</Normaltekst>
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
