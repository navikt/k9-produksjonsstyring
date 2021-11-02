import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { parseQueryString } from 'utils/urlUtils';
import { RestApiStateContext } from 'api/rest-api-hooks/src/RestApiContext';
import IdleTimer from 'react-idle-timer';
import ModalMedIkon from 'sharedComponents/modal/ModalMedIkon';
import AppConfigResolver from './AppConfigResolver';
import { Location } from './locationTsType';
import LanguageProvider from './LanguageProvider';
import HeaderWithErrorPanel from './components/HeaderWithErrorPanel';
import Home from './components/Home';
import '../../styles/global.less';
import advarselImageUrl from '../../images/advarsel.svg';

interface RouterProps {
  location: Location;
}

interface StateProps {
  headerHeight: number;
  crashMessage: string;
  sessionHarUtlopt: boolean;
}

/**
 * AppIndex
 *
 * Container komponent. Dette er toppkomponenten i applikasjonen. Denne vil rendre header
 * og home-komponentene. Home-komponenten vil rendre barn-komponenter via ruter.
 * Komponenten er også ansvarlig for å hente innlogget NAV-ansatt, rettskilde-url, systemrutine-url
 * og kodeverk fra server og lagre desse i klientens state.
 */
export class AppIndex extends Component<RouterProps, StateProps> {
  static contextType = RestApiStateContext;

  idleTimer:any = null;

  constructor(props) {
    super(props);
    this.state = {
      headerHeight: 0,
      crashMessage: undefined,
      sessionHarUtlopt: false,
    };

    this.idleTimer = React.createRef();
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

  handleOnIdle = (): void => {
    this.setState({ sessionHarUtlopt: true });
    this.idleTimer.reset();
  }

  render = () => {
    const {
      location,
    } = this.props;

    const {
      crashMessage,
      sessionHarUtlopt,
    } = this.state;

    const { headerHeight } = this.state;
    const queryStrings = parseQueryString(location.search);

    return (
      <AppConfigResolver>
        <LanguageProvider>
          <IdleTimer
            ref={(ref) => { this.idleTimer = ref; }}
            timeout={1000 * 60 * 58}
            onIdle={this.handleOnIdle}
          />
          <HeaderWithErrorPanel
            queryStrings={queryStrings}
            setSiteHeight={this.setSiteHeight}
            crashMessage={crashMessage}
          />
          {sessionHarUtlopt && (
          <ModalMedIkon
            cancel={() => { window.location.reload(); }}
            tekst={{
              valgmulighetB: 'Logg inn',
              formattedMessageId: 'LoggetUtModal.Tekst',
            }}
            ikonUrl={advarselImageUrl}
            ikonAlt="Varseltrekant"
          />
          )}
          {crashMessage === undefined && (
            <Home headerHeight={headerHeight} />
          )}
        </LanguageProvider>
      </AppConfigResolver>
    );
  }
}

export default withRouter(AppIndex);
