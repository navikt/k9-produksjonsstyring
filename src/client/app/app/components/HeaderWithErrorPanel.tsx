import React, {
  useState, useEffect, FunctionComponent, useRef, useCallback,
} from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import Popover from '@navikt/nap-popover';
import SystemButton from '@navikt/nap-system-button';
import UserPanel from '@navikt/nap-user-panel';
import BoxedListWithLinks from '@navikt/boxed-list-with-links';
import Header from '@navikt/nap-header';
import { RETTSKILDE_URL, SYSTEMRUTINE_URL } from 'api/eksterneLenker';
import KnappBase, { Knapp, Flatknapp } from 'nav-frontend-knapper';
import EventType from 'api/rest-api/src/requestApi/eventType';

import { getK9sakHref } from 'app/paths';
import ErrorMessagePanel from './ErrorMessagePanel';
import styles from './headerWithErrorPanel.less';
import { Driftsmelding } from '../../admin/driftsmeldinger/driftsmeldingTsType';

interface OwnProps {
  navAnsattName: string;
  kanOppgavestyre: boolean;
  kanDrifte: boolean;
  removeErrorMessage: () => void;
  queryStrings: {
    errormessage?: string;
    errorcode?: string;
  };
  errorMessages?: {
    type: EventType;
    code?: string;
    params?: {
      errorDetails?: string;
      location?: string;
    };
    text?: string;
  }[];
  setSiteHeight: (clientHeight: number) => void;
  driftsmeldinger: Driftsmelding[];
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
  navAnsattName,
  removeErrorMessage,
  queryStrings,
  errorMessages = [],
  setSiteHeight,
  kanOppgavestyre,
  kanDrifte,
  driftsmeldinger,
}) => {
  const [erLenkePanelApent, setLenkePanelApent] = useState(false);
  const [erAvdelingerPanelApent, setAvdelingerPanelApent] = useState(false);
  const wrapperRef = useOutsideClickEvent(erLenkePanelApent, erAvdelingerPanelApent, setLenkePanelApent, setAvdelingerPanelApent);
  const brukerPanel = <UserPanel name={navAnsattName} />;
  const fixedHeaderRef = useRef(null);
  useEffect(() => {
    setSiteHeight(fixedHeaderRef.current.clientHeight);
  }, [errorMessages.length]);


  const goTilAvdlelingslederPanel = () => {
    window.location.href = '/avdelingsleder';
  };

  const goTilDriftsmeldingerPanel = () => {
    window.location.href = '/admin';
  };

  const loggUt = () => {
    window.location.assign('https://k9-los-oidc-auth-proxy.dev.adeo.no/logout');
    window.location.href = '/';
  };

  const visAvdelingslederKnapp = (): boolean => {
    if (!kanOppgavestyre) {
      return false;
    }
    if (kanOppgavestyre && window.location.href.includes('avdelingsleder')) {
      return false;
    }
    return true;
  };

  const visAdminKnapp = (): boolean => {
    if (!kanDrifte) {
      return false;
    }
    if (kanDrifte && window.location.href.includes('admin')) {
      return false;
    }
    return true;
  };

  return (
    <header ref={fixedHeaderRef} className={styles.container}>
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
          {isDev && <Knapp className={styles.kanpp} onClick={loggUt}>Logg ut</Knapp>}
        </Header>
      </div>
      <ErrorMessagePanel
        errorMessages={errorMessages}
        queryStrings={queryStrings}
        removeErrorMessage={removeErrorMessage}
        driftsmeldinger={driftsmeldinger}
      />
    </header>
  );
};

export default injectIntl(HeaderWithErrorPanel);
