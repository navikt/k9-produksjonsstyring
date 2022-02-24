import React, {
  FunctionComponent, useCallback, useEffect, useState,
} from 'react';
import { Normaltekst } from 'nav-frontend-typografi';
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
import FlyttReservasjonModal from 'saksbehandler/behandlingskoer/components/menu/FlyttReservasjonModal';
import { TextField } from '@navikt/ds-react';
import _ from 'lodash';
import styles from './reservasjonerTabell.less';
import arrowIcon from '../../../../images/arrow-left-3.svg';
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
  const [showFlyttReservasjonModal, setShowFlyttReservasjonModal] = useState(false);
  const [showOpphevReservasjonModal, setShowOpphevReservasjonModal] = useState(false);
  const [reservasjonerSomSkalVises, setReservasjonerSomSkalVises] = useState([]);
  const [finnesSokResultat, setFinnesSokResultat] = useState(true);

  useEffect(() => {
    if (sorterteReservasjoner.length > 0 && requestFinished) {
      setReservasjonerSomSkalVises(sorterteReservasjoner);
    }
  }, [sorterteReservasjoner, requestFinished]);

  const velgReservasjon = (res: Reservasjon) => {
    if (valgtReservasjon === undefined || valgtReservasjon.oppgaveId !== res.oppgaveId) {
      setValgtReservasjon(res);
    } else {
      setValgtReservasjon(undefined);
    }
  };

  const sokEtterReservasjon = (e) => {
    const sokVerdi = e.target.value.toLowerCase();
    const reservasjonerMedMatch = sorterteReservasjoner.filter((res) => res.reservertAvNavn.toLowerCase().includes(sokVerdi) || res.saksnummer.toLowerCase().includes(sokVerdi));
    if (reservasjonerMedMatch.length > 0) {
      setFinnesSokResultat(true);
      setReservasjonerSomSkalVises(reservasjonerMedMatch);
    } else {
      setFinnesSokResultat(false);
    }
  };

  const debounceFn = useCallback(_.debounce(sokEtterReservasjon, 300), [sorterteReservasjoner]);

  return (
    <>
      <div className={styles.titelContainer}>
        <b><FormattedMessage id="ReservasjonerTabell.Reservasjoner" /></b>
        <div className={styles.sokfelt}><TextField onChange={debounceFn} label="Søk på reservasjon" /></div>
      </div>
      <VerticalSpacer sixteenPx />
      {sorterteReservasjoner.length === 0 && !requestFinished && (
        <NavFrontendSpinner type="XL" className={styles.spinner} />
      )}
      {sorterteReservasjoner.length > 0 && requestFinished && !finnesSokResultat && (
        <>
          <VerticalSpacer eightPx />
          <Normaltekst><FormattedMessage id="ReservasjonerTabell.IngenMatchandeReservasjoner" /></Normaltekst>
          <VerticalSpacer eightPx />
        </>
      )}
      {sorterteReservasjoner.length === 0 && requestFinished && (
      <>
        <VerticalSpacer eightPx />
        <Normaltekst><FormattedMessage id="ReservasjonerTabell.IngenReservasjoner" /></Normaltekst>
        <VerticalSpacer eightPx />
      </>
      )}
      {reservasjonerSomSkalVises.length > 0 && finnesSokResultat && (
        <Table headerTextCodes={headerTextCodes} noHover>
            {reservasjonerSomSkalVises.map((reservasjon) => (
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
              </>
            ))}
        </Table>
      )}
      {showOpphevReservasjonModal && (
      <OpphevReservasjonModal
        oppgaveId={valgtReservasjon.oppgaveId}
        showModal={showOpphevReservasjonModal}
        cancel={() => setShowOpphevReservasjonModal(false)}
        hentReserverteOppgaver={hentAlleReservasjoner}
      />
      )}
      { showFlyttReservasjonModal && (
      <FlyttReservasjonModal
        oppgaveId={valgtReservasjon.oppgaveId}
        showModal={showFlyttReservasjonModal}
        closeModal={() => setShowFlyttReservasjonModal(false)}
      />
      )}
    </>
  );
};

export default injectIntl(ReservasjonerTabell);
