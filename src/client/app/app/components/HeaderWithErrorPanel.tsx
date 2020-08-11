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
import ErrorMessagePanel from './ErrorMessagePanel';
import styles from './headerWithErrorPanel.less';

interface OwnProps {
  navAnsattName: string;
  kanOppgavestyre: boolean;
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
}

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
    window.location.href += 'avdelingsleder';
  };

  const goTilDriftsmeldingerPanel = () => {
    window.location.href += 'driftsmeldinger';
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
    if (!kanOppgavestyre) {
      return false;
    }
    if (kanOppgavestyre && window.location.href.includes('avdelingsleder')) {
      return false;
    }
    return true;
  };

  return (
    <header ref={fixedHeaderRef} className={styles.container}>
      <div ref={wrapperRef}>
        <Header title={intl.formatMessage({ id: 'Header.K9Los' })} titleHref="/">
          {visAdminKnapp() && <KnappBase className={styles.knapp} onClick={goTilDriftsmeldingerPanel}>Driftsmeldinger</KnappBase>}
          {visAvdelingslederKnapp() && <KnappBase className={styles.knapp} onClick={goTilAvdlelingslederPanel}>Avdelingslederpanel</KnappBase>}
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
        </Header>
      </div>
      <ErrorMessagePanel errorMessages={errorMessages} queryStrings={queryStrings} removeErrorMessage={removeErrorMessage} />
    </header>
  );
};

export default injectIntl(HeaderWithErrorPanel);
