import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { withRouter } from 'react-router-dom';
import moment from 'moment';
import { parseQueryString } from 'utils/urlUtils';
import errorHandler from 'api/error-api-redux';
import AppConfigResolver from './AppConfigResolver';
import {
  getFunksjonellTid, getNavAnsattName, getNavAnsattKanOppgavestyre,
} from './duck';
import { Location } from './locationTsType';
import LanguageProvider from './LanguageProvider';
import HeaderWithErrorPanel from './components/HeaderWithErrorPanel';
import Home from './components/Home';

import '../../nomodulestyles/global.less';

type TsProps = Readonly<{
  errorMessagesLength: number;
  removeErrorMessage: () => void;
  crashMessage: string;
  showCrashMessage: (message: string) => void;
  navAnsattName: string;
  funksjonellTid?: string;
  location: Location;
  kanOppgavestyre: boolean;
}>

/**
 * AppIndex
 *
 * Container komponent. Dette er toppkomponenten i applikasjonen. Denne vil rendre header
 * og home-komponentene. Home-komponenten vil rendre barn-komponenter via ruter.
 * Komponenten er også ansvarlig for å hente innlogget NAV-ansatt, rettskilde-url, systemrutine-url
 * og kodeverk fra server og lagre desse i klientens state.
 */
export class AppIndex extends Component<TsProps> {
  static propTypes = {
    errorMessagesLength: PropTypes.number.isRequired,
    removeErrorMessage: PropTypes.func.isRequired,
    crashMessage: PropTypes.string,
    showCrashMessage: PropTypes.func.isRequired,
    navAnsattName: PropTypes.string,
    funksjonellTid: PropTypes.string,
    location: PropTypes.shape({
      search: PropTypes.string,
    }).isRequired,
  };

  static defaultProps = {
    crashMessage: '',
    navAnsattName: '',
    funksjonellTid: undefined,
  };

  componentDidUpdate = (prevProps: TsProps) => {
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

  componentDidCatch = (error: Error, info: any) => {
    const { showCrashMessage: showCrashMsg } = this.props;
    showCrashMsg([
      error.toString(),
      info.componentStack
          .split('\n')
          .map((line: string) => line.trim())
          .find((line: string) => !!line),
    ].join(' '));
  }

  render = () => {
    const {
      location, crashMessage, errorMessagesLength, navAnsattName,
      removeErrorMessage: removeErrorMsg,
    } = this.props;
    const queryStrings = parseQueryString(location.search);

    return (
      <AppConfigResolver>
        <LanguageProvider>
          <HeaderWithErrorPanel
            queryStrings={queryStrings}
            navAnsattName={navAnsattName}
            removeErrorMessage={removeErrorMsg}
          />
          {!crashMessage && (
            <Home nrOfErrorMessages={errorMessagesLength + (queryStrings.errorcode || queryStrings.errormessage ? 1 : 0)} />
            )
            }
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
});

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({
  showCrashMessage: errorHandler.showCrashMessage,
  removeErrorMessage: errorHandler.removeErrorMessage,
}, dispatch);

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AppIndex));
