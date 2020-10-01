import React, {
  FunctionComponent, useState,
} from 'react';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import { FormattedMessage, injectIntl, WrappedComponentProps } from 'react-intl';
import Reservasjon from 'avdelingsleder/reservasjoner/reservasjonTsType';
import Image from 'sharedComponents/Image';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import { getDateAndTime } from 'utils/dateUtils';

import TableColumn from 'sharedComponents/TableColumn';
import Table from 'sharedComponents/Table';
import TableRow from 'sharedComponents/TableRow';
import NavFrontendSpinner from 'nav-frontend-spinner';
import Chevron from 'nav-frontend-chevron';
import { Row } from 'nav-frontend-grid';
import OpphevReservasjonModal from 'saksbehandler/behandlingskoer/components/menu/OpphevReservasjonModal';
import OppgaveReservasjonEndringDatoModal
  from 'saksbehandler/behandlingskoer/components/menu/OppgaveReservasjonEndringDatoModal';
import FlyttReservasjonModal from 'saksbehandler/behandlingskoer/components/menu/FlyttReservasjonModal';
import styles from './reservasjonerTabell.less';
import arrowIcon from '../../../../images/arrow-left-3.svg';
import reservasjonIcon from '../../../../images/delete-1.svg';
import arrowIconRight from '../../../../images/arrow-right-3.svg';

const headerTextCodes = [
  'ReservasjonerTabell.Navn',
  'ReservasjonerTabell.Saksnr',
  'ReservasjonerTabell.BehandlingType',
  'ReservasjonerTabell.ReservertTil',
  'EMPTY_1',
];

interface OwnProps {
  reservasjoner: Reservasjon[];
  hentAlleReservasjoner: () => void;
  requestFinished: boolean;
}

const ReservasjonerTabell: FunctionComponent<OwnProps & WrappedComponentProps> = ({
  reservasjoner,
  hentAlleReservasjoner,
  requestFinished,
}) => {
  const sorterteReservasjoner = reservasjoner.sort((reservasjon1, reservasjon2) => reservasjon1.reservertAvNavn.localeCompare(reservasjon2.reservertAvNavn));

  const [valgtReservasjon, setValgtReservasjon] = useState<Reservasjon>();
  const [showReservasjonEndringDatoModal, setShowReservasjonEndringDatoModal] = useState(false);
  const [showFlyttReservasjonModal, setShowFlyttReservasjonModal] = useState(false);
  const [showOpphevReservasjonModal, setShowOpphevReservasjonModal] = useState(false);

  const velgReservasjon = (res: Reservasjon) => {
    if (valgtReservasjon === undefined || valgtReservasjon.oppgaveId !== res.oppgaveId) {
      setValgtReservasjon(res);
    } else {
      setValgtReservasjon(undefined);
    }
  };

  return (
    <>
      <Element><FormattedMessage id="ReservasjonerTabell.Reservasjoner" /></Element>
      {sorterteReservasjoner.length === 0 && !requestFinished && (
        <NavFrontendSpinner type="XL" className={styles.spinner} />
      )}
      {sorterteReservasjoner.length === 0 && requestFinished && (
      <>
        <VerticalSpacer eightPx />
        <Normaltekst><FormattedMessage id="ReservasjonerTabell.IngenReservasjoner" /></Normaltekst>
        <VerticalSpacer eightPx />
      </>
      )}
      {sorterteReservasjoner.length > 0 && (
        <>
          <Table headerTextCodes={headerTextCodes} noHover>
            {sorterteReservasjoner.map((reservasjon) => (
              <>
                <TableRow
                  key={reservasjon.oppgaveId}
                  onMouseDown={() => velgReservasjon(reservasjon)}
                  onKeyDown={() => velgReservasjon(reservasjon)}
                >
                  <TableColumn>{reservasjon.reservertAvNavn}</TableColumn>
                  <TableColumn>{reservasjon.saksnummer}</TableColumn>
                  <TableColumn>{reservasjon.behandlingType.navn}</TableColumn>
                  <TableColumn>
                    <FormattedMessage
                      id="ReservasjonerTabell.ReservertTilFormat"
                      values={getDateAndTime(reservasjon.reservertTilTidspunkt)}
                    />
                  </TableColumn>
                  <TableColumn>
                    <Chevron
                      key={reservasjon.oppgaveId}
                      type={(valgtReservasjon && valgtReservasjon.oppgaveId === reservasjon.oppgaveId) ? 'opp' : 'ned'}
                      className={styles.chevron}
                    />
                  </TableColumn>
                </TableRow>
                {valgtReservasjon && valgtReservasjon.oppgaveId === reservasjon.oppgaveId && (
                <Row className={styles.actionMenu}>
                  <Row>
                    <div className={styles.menuLine}>
                      <Image src={arrowIcon} className={styles.icon} />
                      <div
                        id="leggTilbake"
                        tabIndex={0}
                        className={styles.action}
                        role="button"
                        onClick={() => setShowOpphevReservasjonModal(true)}
                        onKeyDown={() => { setShowOpphevReservasjonModal(true); }}
                      >
                        <FormattedMessage id="ReservasjonerTabell.LeggTilbake" />
                      </div>
                    </div>
                  </Row>
                  <Row>
                    <div className={styles.menuLine}>
                      <Image src={reservasjonIcon} className={styles.icon} />
                      <div
                        tabIndex={0}
                        id="endreDato"
                        className={styles.action}
                        role="button"
                        onClick={() => { setShowReservasjonEndringDatoModal(true); }}
                        onKeyDown={() => { setShowReservasjonEndringDatoModal(true); }}
                      >
                        <FormattedMessage id="ReservasjonerTabell.EndreReservasjon" />
                      </div>
                    </div>
                  </Row>
                  <Row>
                    <div className={styles.menuLine}>
                      <Image src={arrowIconRight} className={styles.icon} />
                      <div
                        id="flytt"
                        tabIndex={0}
                        className={styles.action}
                        role="button"
                        onClick={() => { setShowFlyttReservasjonModal(true); }}
                        onKeyDown={() => { setShowFlyttReservasjonModal(true); }}
                      >
                        <FormattedMessage id="ReservasjonerTabell.FlyttReservasjon" />
                      </div>
                    </div>
                  </Row>
                </Row>
                )}
                {showOpphevReservasjonModal && (
                <OpphevReservasjonModal
                  oppgaveId={reservasjon.oppgaveId}
                  showModal={showOpphevReservasjonModal}
                  cancel={() => setShowOpphevReservasjonModal(false)}
                  hentReserverteOppgaver={hentAlleReservasjoner}
                />
                )}
                {showReservasjonEndringDatoModal && (
                <OppgaveReservasjonEndringDatoModal
                  showModal={showReservasjonEndringDatoModal}
                  oppgaveId={reservasjon.oppgaveId}
                  closeModal={() => setShowReservasjonEndringDatoModal(false)}
                  hentAlleReservasjonerEllerOppgaver={hentAlleReservasjoner}
                  reserverTilDefault={reservasjon.reservertTilTidspunkt}
                />
                )}
                { showFlyttReservasjonModal && (
                <FlyttReservasjonModal
                  oppgaveId={reservasjon.oppgaveId}
                  showModal={showFlyttReservasjonModal}
                  closeModal={() => setShowFlyttReservasjonModal(false)}
                  hentAlleReservasjonerEllerOppgaver={hentAlleReservasjoner}
                />
                )}
              </>
            ))}
          </Table>

        </>
      )}
    </>
  );
};

export default injectIntl(ReservasjonerTabell);
