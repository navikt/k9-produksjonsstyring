import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { withRouter } from 'react-router-dom';
import moment from 'moment';
import { parseQueryString } from 'utils/urlUtils';
import errorHandler from 'api/error-api-redux';
import EventType from 'api/rest-api/src/requestApi/eventType';
import { RestApiGlobalStatePathsKeys } from 'api/k9LosApi';
import useGlobalStateRestApiData from 'api/global-data/useGlobalStateRestApiData';
import AppConfigResolver from './AppConfigResolver';
import {
  getFunksjonellTid, getNavAnsattName, getNavAnsattKanOppgavestyre, getNavAnsattKanDrifte, getAlleDriftsmeldinger,
} from './duck';
import { Location } from './locationTsType';
import LanguageProvider from './LanguageProvider';
import HeaderWithErrorPanel from './components/HeaderWithErrorPanel';
import Home from './components/Home';
import '../../styles/global.less';
import { fetchAlleDriftsmeldinger, getDriftsmeldinger } from '../admin/driftsmeldinger/duck';
import { Driftsmelding } from '../admin/driftsmeldinger/driftsmeldingTsType';
import NavAnsatt from 'app/navAnsattTsType';

interface StateProps {
  errorMessages?: {
    type: EventType;
    code?: string;
    params?: {
      errorDetails?: string;
    };
    text?: string;
  }[];
  removeErrorMessage: () => void;
  crashMessage: string;
  showCrashMessage: (message: string) => void;
  navAnsattName: string;
  funksjonellTid?: string;
  location: Location;
  driftsmeldinger: Driftsmelding[];
}

/**
 * AppIndex
 *
 * Container komponent. Dette er toppkomponenten i applikasjonen. Denne vil rendre header
 * og home-komponentene. Home-komponenten vil rendre barn-komponenter via ruter.
 * Komponenten er også ansvarlig for å hente innlogget NAV-ansatt, rettskilde-url, systemrutine-url
 * og kodeverk fra server og lagre desse i klientens state.
 */
export class AppIndex extends Component<StateProps> {
  state = {
    headerHeight: 0,
  };

  componentDidCatch = (error: Error, info: { componentStack: string }): void => {
    const crashMessage = [
      error.toString(),
      info.componentStack
        .split('\n')
        .map((line: string) => line.trim())
        .find((line: string) => !!line),
    ].join(' ');

    this.setState((state) => ({ ...state, crashMessage }));
  }

  setSiteHeight = (headerHeight: number): void => {
    document.documentElement.setAttribute('style', `height: calc(100% - ${headerHeight}px)`);
    this.setState((state) => ({ ...state, headerHeight }));
  }

  render = () => {
    const {
      location, crashMessage,
      removeErrorMessage: removeErrorMsg, driftsmeldinger,
    } = this.props;
    const { navn, kanOppgavestyre, kanDrifte } = useGlobalStateRestApiData<NavAnsatt>(RestApiGlobalStatePathsKeys.NAV_ANSATT);
    const { headerHeight } = this.state;
    const queryStrings = parseQueryString(location.search);

    return (
      <AppConfigResolver>
        <LanguageProvider>
          <HeaderWithErrorPanel
            kanOppgavestyre={kanOppgavestyre}
            kanDrifte={kanDrifte}
            queryStrings={queryStrings}
            navAnsattName={navn}
            removeErrorMessage={removeErrorMsg}
            setSiteHeight={this.setSiteHeight}
            driftsmeldinger={driftsmeldinger}
          />
          {!crashMessage && (
            <Home headerHeight={headerHeight} />
          )}
        </LanguageProvider>
      </AppConfigResolver>
    );
  }
}

const mapStateToProps = (state: any) => ({
  errorMessagesLength: errorHandler.getAllErrorMessages(state).length,
  crashMessage: errorHandler.getCrashMessage(state),
  navAnsattName: getNavAnsattName(state),
  funksjonellTid: getFunksjonellTid(state),
  kanOppgavestyre: getNavAnsattKanOppgavestyre(state),
  kanDrifte: getNavAnsattKanDrifte(state),
  driftsmeldinger: getAlleDriftsmeldinger(state),
});

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({
  showCrashMessage: errorHandler.showCrashMessage,
  removeErrorMessage: errorHandler.removeErrorMessage,
}, dispatch);

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AppIndex));
