import React, {
 useState, useEffect, FunctionComponent, useRef, useCallback,
} from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';
import Popover from '@navikt/nap-popover';
import SystemButton from '@navikt/nap-system-button';
import UserPanel from '@navikt/nap-user-panel';
import BoxedListWithLinks from '@navikt/boxed-list-with-links';
import Header from '@navikt/nap-header';
import { RETTSKILDE_URL, SYSTEMRUTINE_URL } from 'api/eksterneLenker';
import KnappBase, { Knapp, Flatknapp } from 'nav-frontend-knapper';
import ErrorMessagePanel from './ErrorMessagePanel';
import styles from './headerWithErrorPanel.less';

interface OwnProps {
  intl: any;
  navAnsattName: string;
  removeErrorMessage: () => void;
  queryStrings: {
    errormessage?: string;
    errorcode?: string;
  };
  kanOppgavestyre: boolean;
  goBackUrl: string;
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
const HeaderWithErrorPanel: FunctionComponent<OwnProps> = ({
  intl,
  navAnsattName,
  removeErrorMessage,
  queryStrings,
  kanOppgavestyre,
  goBackUrl,
}) => {
    const [erLenkePanelApent, setLenkePanelApent] = useState(false);
    const [erAvdelingerPanelApent, setAvdelingerPanelApent] = useState(false);
    const wrapperRef = useOutsideClickEvent(erLenkePanelApent, erAvdelingerPanelApent, setLenkePanelApent, setAvdelingerPanelApent);
    const brukerPanel = <UserPanel name={navAnsattName} />;

    const goTilAvdlelingslederPanel = () => {
        window.location.href += 'avdelingsleder';
    };

    const visKnapp = (): boolean => {
        if (!kanOppgavestyre) {
            return false;
        }
        if (kanOppgavestyre && window.location.href.includes('avdelingsleder')) {
            return false;
        }
            return true;
    };

    return (
      <header className={styles.container}>
        <div ref={wrapperRef}>
          <Header title={intl.formatMessage({ id: 'Header.K9Los' })} titleHref={goBackUrl}>
            { console.log(`LENKE: ${goBackUrl}`)}
            {visKnapp() && <KnappBase className={styles.knapp} onClick={goTilAvdlelingslederPanel}>Avdelingslederpanel</KnappBase>}
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
        <ErrorMessagePanel queryStrings={queryStrings} removeErrorMessage={removeErrorMessage} />
      </header>
    );
  };

HeaderWithErrorPanel.propTypes = {
  intl: intlShape.isRequired,
  queryStrings: PropTypes.shape({
    errormessage: PropTypes.string,
    errorcode: PropTypes.string,
  }).isRequired,
  navAnsattName: PropTypes.string.isRequired,
  removeErrorMessage: PropTypes.func.isRequired,
  kanOppgavestyre: PropTypes.bool.isRequired,
    goBackUrl: PropTypes.string,
};

export default injectIntl(HeaderWithErrorPanel);
