import React, { FunctionComponent, useCallback, useState } from 'react';
import { parseQueryString } from 'utils/urlUtils';
import { useIdleTimer } from 'react-idle-timer';
import ModalMedIkon from 'sharedComponents/modal/ModalMedIkon';
import { useLocation } from 'react-router';
import AppConfigResolver from './AppConfigResolver';
import LanguageProvider from './LanguageProvider';
import HeaderWithErrorPanel from './components/HeaderWithErrorPanel';
import Home from './components/Home';
import '../../styles/global.less';
import advarselImageUrl from '../../images/advarsel.svg';
import ErrorBoundary from './ErrorBoundary';

/**
 * AppIndex
 *
 * Container komponent. Dette er toppkomponenten i applikasjonen. Denne vil rendre header
 * og home-komponentene. Home-komponenten vil rendre barn-komponenter via ruter.
 * Komponenten er også ansvarlig for å hente innlogget NAV-ansatt, rettskilde-url, systemrutine-url
 * og kodeverk fra server og lagre desse i klientens state.
 */
const AppIndex: FunctionComponent = () => {
  const [headerHeight, setHeaderHeight] = useState(0);
  const [crashMessage, setCrashMessage] = useState<string>();
  const [sessionHarUtlopt, setSessionHarUtlopt] = useState<boolean>(false);
  const timeout = 1000 * 60 * 58;

  const handleOnIdle = (): void => {
    setSessionHarUtlopt(true);
  };

  useIdleTimer({
    timeout,
    onIdle: handleOnIdle,
  });

  const setSiteHeight = useCallback((newHeaderHeight): void => {
    document.documentElement.setAttribute('style', `height: calc(100% - ${newHeaderHeight}px)`);
    setHeaderHeight(newHeaderHeight);
  }, []);

  const addErrorMessageAndSetAsCrashed = (error: string) => {
    setCrashMessage(error);
  };

  const location = useLocation();
  const queryStrings = parseQueryString(location.search);

  return (
    <ErrorBoundary errorMessageCallback={addErrorMessageAndSetAsCrashed}>
      <AppConfigResolver>
        <LanguageProvider>
          <HeaderWithErrorPanel queryStrings={queryStrings} setSiteHeight={setSiteHeight} crashMessage={crashMessage} />
          {sessionHarUtlopt && (
            <ModalMedIkon
              cancel={() => {
                window.location.reload();
              }}
              tekst={{
                valgmulighetB: 'Logg inn',
                formattedMessageId: 'LoggetUtModal.Tekst',
              }}
              ikonUrl={advarselImageUrl}
              ikonAlt="Varseltrekant"
            />
          )}
          {crashMessage === undefined && <Home headerHeight={headerHeight} />}
        </LanguageProvider>
      </AppConfigResolver>
    </ErrorBoundary>
  );
};

export default AppIndex;
