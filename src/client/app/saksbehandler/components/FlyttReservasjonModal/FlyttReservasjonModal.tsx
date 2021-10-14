import React, { FunctionComponent, useCallback, useState } from 'react';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';
import { Element, Normaltekst } from 'nav-frontend-typografi';

import Oppgave from 'saksbehandler/oppgaveTsType';
import Image from 'sharedComponents/Image';
import Modal from 'sharedComponents/Modal';
import advarselImageUrl from 'images/advarsel.svg';
import { FormattedMessage, WrappedComponentProps } from 'react-intl';
import { K9LosApiKeys, RestApiGlobalStatePathsKeys } from 'api/k9LosApi';
import { OppgaveStatus } from 'saksbehandler/oppgaveStatusTsType';
import NavAnsatt from 'app/navAnsattTsType';
import styles from './flyttReservasjonsmodal.less';
import useRestApiRunner from '../../../api/rest-api-hooks/src/local-data/useRestApiRunner';
import useGlobalStateRestApiData from '../../../api/rest-api-hooks/src/global-data/useGlobalStateRestApiData';

interface OwnProps{
  oppgave: Oppgave;
  oppgaveStatus: OppgaveStatus;
  lukkFlyttReservasjonsmodal: () => void;
  openSak: (oppgave: Oppgave) => void;
  hentReserverteOppgaver?: () => void;
}

export const FlyttReservasjonsmodal: FunctionComponent<OwnProps & WrappedComponentProps> = ({
                                                                                              intl,
                                                                                              oppgave,
                                                                                              oppgaveStatus,
                                                                                              lukkFlyttReservasjonsmodal,
                                                                                              openSak,
                                                                                              hentReserverteOppgaver,
                                                                                            }) => {
  const { startRequest: flyttOppgaveReservasjon } = useRestApiRunner(K9LosApiKeys.FLYTT_RESERVASJON);
  const { startRequest: reserverOppgave } = useRestApiRunner<OppgaveStatus>(K9LosApiKeys.RESERVER_OPPGAVE);
  const { kanReservere } = useGlobalStateRestApiData<NavAnsatt>(RestApiGlobalStatePathsKeys.NAV_ANSATT);

  const [visManglerReservasjonsrettigheterFeilmelding, setVisManglerReservasjonsrettigheterFeilmelding] = useState<boolean>(false);

  const flyttOppgaveReservasjonFn = useCallback(
    (oppgaveId: string, brukerIdent: string, begrunnelse: string): Promise<any> => flyttOppgaveReservasjon({
      oppgaveId,
      brukerIdent,
      begrunnelse,
    })
      .then(() => {
        if (typeof hentReserverteOppgaver !== 'undefined') {
          hentReserverteOppgaver();
        }
        lukkFlyttReservasjonsmodal();
      }),
    [],
  );

  const overstyrReservasjonFn = () => {
    if (kanReservere) {
      const params = {
        oppgaveId: oppgave.eksternId,
        overstyrSjekk: true,
      };

      reserverOppgave(params).then((nyOppgaveStatus) => {
        if (nyOppgaveStatus.erReservert && nyOppgaveStatus.erReservertAvInnloggetBruker) {
          openSak(oppgave);
        }
      }).then(() => hentReserverteOppgaver());
    } else {
      setVisManglerReservasjonsrettigheterFeilmelding(true);
    }
  };
  return (
    <Modal
      className={styles.flyttReservasjonModal}
      isOpen
      closeButton={false}
      contentLabel={intl.formatMessage({ id: 'FlyttReservasjonModal.ReservertAvEnkel' })}
      onRequestClose={() => lukkFlyttReservasjonsmodal()}
    >
      <div className={styles.oppgaveReservertAvAnnenModal}>
        <div className={styles.flyttReservasjonModal_informasjon}>
          <div className={styles.flyttReservasjonModal_image__container}>
            <Image
              className={styles.flyttReservasjonModal_image}
              alt={intl.formatMessage({ id: 'FlyttReservasjonModal.ReservertAvEnkel' })}
              src={advarselImageUrl}
            />
          </div>
          <div className={styles.flyttReservasjonModal_text}>
            <Normaltekst>
              <FormattedMessage
                id="FlyttReservasjonModal.ReservertAv"
                values={{
                  saksbehandlerid: oppgaveStatus.reservertAv,
                  saksbehandlernavn: oppgaveStatus.reservertAvNavn,
                }}
              />
            </Normaltekst>
          </div>
        </div>
        <div className={styles.flyttReservasjonModal_knapper__container}>
          <Hovedknapp
            mini
            htmlType="button"
            className={styles.flyttReservasjonModal_knapper__knapp}
            onClick={() => flyttOppgaveReservasjonFn(oppgave.eksternId, oppgaveStatus.reservertAv, 'Flyttes til deg fordi du jobber med den andre parts sak.')}
          >
            {intl.formatMessage({ id: 'FlyttReservasjonModal.FlyttReservasjon' })}
          </Hovedknapp>

          <Hovedknapp
            className={styles.flyttReservasjonModal_knapper__knapp}
            mini
            htmlType="button"
            onClick={() => overstyrReservasjonFn()}
          >
            {intl.formatMessage({ id: 'FlyttReservasjonModal.OverstyrReservasjon' })}

          </Hovedknapp>
          <Knapp
            className={styles.flyttReservasjonModal_knapper__knapp}
            mini
            htmlType="button"
            onClick={() => lukkFlyttReservasjonsmodal()}
            autoFocus
          >
            {intl.formatMessage({ id: 'OppgaveErReservertAvAnnenModal.GåTilKøen' })}
          </Knapp>
        </div>
        {visManglerReservasjonsrettigheterFeilmelding && (
          <div className={styles.flyttReservasjonModal__feilmelding}>
            <Element><FormattedMessage id="FlyttReservasjonModal.Feil" /></Element>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default FlyttReservasjonsmodal;