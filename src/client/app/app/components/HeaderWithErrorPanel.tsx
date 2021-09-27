import React, {
  FunctionComponent, useCallback, useEffect, useMemo, useRef, useState,
} from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import {
  Popover, SystemButton, UserPanel, Header, BoxedListWithLinks,
} from '@navikt/k9-react-components';
import { RETTSKILDE_URL, SYSTEMRUTINE_URL } from 'api/eksterneLenker';
import Knapp from 'nav-frontend-knapper';

import useRestApiError from 'api/rest-api/error/useRestApiError';
import { K9LosApiKeys, RestApiGlobalStatePathsKeys } from 'api/k9LosApi';
import ErrorFormatter from 'app/feilhandtering/ErrorFormatter';
import useRestApi from 'api/rest-api-hooks/src/local-data/useRestApi';
import { useGlobalStateRestApiData } from 'api/rest-api-hooks';
import NavAnsatt from 'app/navAnsattTsType';
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

const useOutsideClickEvent = (erLenkepanelApent, erAvdelingerPanelApent, setLenkePanelApent, setAvdelingerPanelApent) => {
  const wrapperRef = useRef(null);
  const handleClickOutside = useCallback((event) => {
    if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
      setLenkePanelApent(false);
      setAvdelingerPanelApent(false);
    }
  }, [wrapperRef.current]);

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
  const formaterteFeilmeldinger = useMemo(() => new ErrorFormatter().format(errorMessages, crashMessage), [errorMessages]);
  const wrapperRef = useOutsideClickEvent(erLenkePanelApent, erAvdelingerPanelApent, setLenkePanelApent, setAvdelingerPanelApent);
  const brukerPanel = <UserPanel name={navAnsatt.navn} />;
  const fixedHeaderRef = useRef(null);
  useEffect(() => {
    setSiteHeight(fixedHeaderRef.current.clientHeight);
  }, [errorMessages.length, driftsmeldinger.length]);

  const goTilAvdlelingslederPanel = () => {
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
    setTimeout(() => { goToHomepage(); }, 1000);
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
          {visAdminKnapp() && <Knapp className={styles.knapp} onClick={goTilDriftsmeldingerPanel}>Driftsmeldinger</Knapp>}
          {visAvdelingslederKnapp() && <Knapp className={styles.knapp} onClick={goTilAvdlelingslederPanel}>Avdelingslederpanel</Knapp>}
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
                  items={[{
                    name: intl.formatMessage({ id: 'Header.Rettskilde' }),
                    href: RETTSKILDE_URL,
                    isExternal: true,
                  }, {
                    name: intl.formatMessage({ id: 'Header.Systemrutine' }),
                    href: SYSTEMRUTINE_URL,
                    isExternal: true,
                  }]}
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
          {isDev && <Knapp className={styles.knapp} onClick={loggUt}>Logg ut</Knapp>}
        </Header>
      </div>
      <ErrorMessagePanel
        driftsmeldinger={driftsmeldinger}
        errorMessages={formaterteFeilmeldinger}
        queryStrings={queryStrings}
      />
    </header>
  );
};

export default injectIntl(HeaderWithErrorPanel);
