import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { withRouter } from 'react-router-dom';
import moment from 'moment';
import { parseQueryString } from 'utils/urlUtils';
import errorHandler from 'api/error-api-redux';
import EventType from 'api/rest-api/src/requestApi/eventType';
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


interface OwnProps {
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
  kanOppgavestyre: boolean;
  kanDrifte: boolean;
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
export class AppIndex extends Component<OwnProps> {
  state = {
    headerHeight: 0,
  };

  componentDidUpdate = (prevProps: OwnProps) => {
    const { funksjonellTid } = this.props;

    if (funksjonellTid && prevProps.funksjonellTid !== funksjonellTid) {
      // TODO (TOR) Dette endrar jo berre moment. Kva med kode som brukar Date direkte?
      const diffInMinutes = moment().diff(funksjonellTid, 'minutes');
      // Hvis diffInMinutes har avvik på over 5min: override moment.now (ref. http://momentjs.com/docs/#/customization/now/)
      if (diffInMinutes >= 5 || diffInMinutes <= -5) {
        const diff = moment().diff(funksjonellTid);
        moment.now = () => Date.now() - diff;
      }
    }
  }

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
      location, crashMessage, navAnsattName,
      removeErrorMessage: removeErrorMsg, kanOppgavestyre, kanDrifte, driftsmeldinger,
    } = this.props;
    const { headerHeight } = this.state;
    const queryStrings = parseQueryString(location.search);

    return (
      <AppConfigResolver>
        <LanguageProvider>
          <HeaderWithErrorPanel
            kanOppgavestyre={kanOppgavestyre}
            kanDrifte={kanDrifte}
            queryStrings={queryStrings}
            navAnsattName={navAnsattName}
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
