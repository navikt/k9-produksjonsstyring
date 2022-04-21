import React, { FunctionComponent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import { Popover, SystemButton, UserPanel, Header, BoxedListWithLinks } from '@navikt/k9-react-components';
import Endringslogg from '@navikt/familie-endringslogg';
import { RETTSKILDE_URL, SYSTEMRUTINE_URL } from 'api/eksterneLenker';
import Knapp from 'nav-frontend-knapper';

import { K9LosApiKeys, RestApiGlobalStatePathsKeys } from 'api/k9LosApi';
import ErrorFormatter from 'app/feilhandtering/ErrorFormatter';
import useRestApi from 'api/rest-api-hooks/src/local-data/useRestApi';
import { useGlobalStateRestApiData } from 'api/rest-api-hooks';
import NavAnsatt from 'app/navAnsattTsType';
import DriftsmeldingPanel from 'app/components/DriftsmeldingPanel';
import useRestApiErrorDispatcher from 'api/error/useRestApiErrorDispatcher';
import useRestApiError from 'api/error/useRestApiError';
import styles from './headerWithErrorPanel.less';
import ErrorMessagePanel from './ErrorMessagePanel';
import { Driftsmelding } from '../../admin/driftsmeldinger/driftsmeldingTsType';

interface OwnProps {
  queryStrings: {
    errormessage?: string;
    errorcode?: string;
  };
  crashMessage?: string;
  setSiteHeight: (clientHeight: number) => void;
}

const isDev = window.location.hostname.includes('dev.adeo.no');

const useOutsideClickEvent = (
  erLenkepanelApent,
  erAvdelingerPanelApent,
  setLenkePanelApent,
  setAvdelingerPanelApent,
) => {
  const wrapperRef = useRef(null);
  const handleClickOutside = useCallback(
    event => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setLenkePanelApent(false);
        setAvdelingerPanelApent(false);
      }
    },
    [wrapperRef.current],
  );

  useEffect(() => {
    if (erLenkepanelApent || erAvdelingerPanelApent) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [erLenkepanelApent, erAvdelingerPanelApent]);

  return wrapperRef;
};

/**
 * HeaderWithErrorPanel
 *
 * Presentasjonskomponent. Definerer header-linjen som alltid vises øverst nettleservinduet.
 * Denne viser lenke tilbake til hovedsiden, nettside-navnet og NAV-ansatt navn.
 * I tillegg vil den vise potensielle feilmeldinger i ErrorMessagePanel.
 */
const HeaderWithErrorPanel: FunctionComponent<OwnProps & WrappedComponentProps> = ({
  intl,
  queryStrings,
  crashMessage,
  setSiteHeight,
}) => {
  const [erLenkePanelApent, setLenkePanelApent] = useState(false);
  const [erAvdelingerPanelApent, setAvdelingerPanelApent] = useState(false);

  const navAnsatt = useGlobalStateRestApiData<NavAnsatt>(RestApiGlobalStatePathsKeys.NAV_ANSATT);
  const { data: driftsmeldinger = [] } = useRestApi<Driftsmelding[]>(K9LosApiKeys.DRIFTSMELDINGER);

  const errorMessages = useRestApiError() || [];

  const formaterteFeilmeldinger = useMemo(
    () => new ErrorFormatter().format(errorMessages, crashMessage),
    [errorMessages],
  );
  const { removeErrorMessage } = useRestApiErrorDispatcher();
  const wrapperRef = useOutsideClickEvent(
    erLenkePanelApent,
    erAvdelingerPanelApent,
    setLenkePanelApent,
    setAvdelingerPanelApent,
  );
  const brukerPanel = <UserPanel name={navAnsatt.navn} />;
  const fixedHeaderRef = useRef(null);
  useEffect(() => {
    setSiteHeight(fixedHeaderRef.current.clientHeight);
  }, [errorMessages.length, driftsmeldinger.length]);

  const goTilAvdelingslederPanel = () => {
    window.location.href = '/avdelingsleder';
  };

  const goTilDriftsmeldingerPanel = () => {
    window.location.href = '/admin';
  };

  const goToHomepage = () => {
    window.location.href = '/';
  };

  const loggUt = () => {
    window.location.assign('https://k9-los-oidc-auth-proxy.dev.intern.nav.no/logout');
    setTimeout(() => {
      goToHomepage();
    }, 1000);
  };

  const visAvdelingslederKnapp = (): boolean => {
    if (!navAnsatt.kanOppgavestyre) {
      return false;
    }
    if (navAnsatt.kanOppgavestyre && window.location.href.includes('avdelingsleder')) {
      return false;
    }
    return true;
  };

  const visAdminKnapp = (): boolean => {
    if (!navAnsatt.kanDrifte) {
      return false;
    }
    if (navAnsatt.kanDrifte && window.location.href.includes('admin')) {
      return false;
    }
    return true;
  };

  return (
    <header ref={fixedHeaderRef} className={isDev ? styles.containerDev : styles.container}>
      <div ref={wrapperRef}>
        <Header title={intl.formatMessage({ id: 'Header.K9Los' })} titleHref="/">
          {visAdminKnapp() && (
            <Knapp className={styles.knapp} onClick={goTilDriftsmeldingerPanel}>
              Driftsmeldinger
            </Knapp>
          )}
          {visAvdelingslederKnapp() && (
            <Knapp className={styles.knapp} onClick={goTilAvdelingslederPanel}>
              Avdelingslederpanel
            </Knapp>
          )}
          {/*
            Går mot en backend som foreldrepenger styrer.
            https://github.com/navikt/familie-endringslogg
            For å nå backend lokalt må man være tilkoblet naisdevice og kjøre opp k9-sak-web på port 8000 pga CORS
            */}
          {navAnsatt?.brukerIdent && (
            <div className={styles['endringslogg-container']}>
              <Endringslogg
                userId={navAnsatt.brukerIdent}
                appId="K9_SAK"
                appName="K9 Sak"
                backendUrl={
                  isDev
                    ? 'https://familie-endringslogg.dev.intern.nav.no'
                    : 'https://familie-endringslogg.intern.nav.no'
                }
                stil="lys"
                alignLeft
              />
            </div>
          )}
          <Popover
            popperIsVisible={erLenkePanelApent}
            renderArrowElement
            customPopperStyles={{ top: '11px', zIndex: 1 }}
            popperProps={{
              children: () => (
                <BoxedListWithLinks
                  onClick={() => {
                    setLenkePanelApent(false);
                  }}
                  items={[
                    {
                      name: intl.formatMessage({ id: 'Header.Rettskilde' }),
                      href: RETTSKILDE_URL,
                      isExternal: true,
                    },
                    {
                      name: intl.formatMessage({ id: 'Header.Systemrutine' }),
                      href: SYSTEMRUTINE_URL,
                      isExternal: true,
                    },
                  ]}
                />
              ),
              placement: 'bottom-start',
              positionFixed: true,
            }}
            referenceProps={{
              // eslint-disable-next-line react/prop-types
              children: ({ ref }) => (
                <div ref={ref}>
                  <SystemButton
                    onClick={() => {
                      if (erAvdelingerPanelApent) {
                        setAvdelingerPanelApent(false);
                      }
                      setLenkePanelApent(!erLenkePanelApent);
                    }}
                    isToggled={erLenkePanelApent}
                  />
                </div>
              ),
            }}
          />
          {brukerPanel}
          {isDev && (
            <Knapp className={styles.knapp} onClick={loggUt}>
              Logg ut
            </Knapp>
          )}
        </Header>
      </div>
      <DriftsmeldingPanel driftsmeldinger={driftsmeldinger} />
      <ErrorMessagePanel
        errorMessages={formaterteFeilmeldinger}
        queryStrings={queryStrings}
        removeErrorMessages={removeErrorMessage}
      />
    </header>
  );
};

export default injectIntl(HeaderWithErrorPanel);
