import React, { FunctionComponent, useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { Normaltekst, Element } from 'nav-frontend-typografi';
import Image from 'sharedComponents/Image';
import removeIcon from 'images/remove.svg';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import Table from 'sharedComponents/Table';
import TableRow from 'sharedComponents/TableRow';
import TableColumn from 'sharedComponents/TableColumn';
import { Checkbox } from 'nav-frontend-skjema';
import { getDateAndTime } from 'utils/dateUtils';
import useRestApiRunner from 'api/rest-api-hooks/src/local-data/useRestApiRunner';
import { K9LosApiKeys } from 'api/k9LosApi';
import { Driftsmelding } from '../driftsmeldingTsType';

import styles from './driftsmeldingerTabell.less';
import SletteDriftsmeldingerModal from './SletteDriftsmeldingerModal';

const headerTextCodes = [
  'DriftsmeldingTabell.Tekst',
  'DriftsmeldingTabell.Aktiv',
  'DriftsmeldingTabell.Dato',
];

interface OwnProps {
  driftsmeldinger: Driftsmelding[];
  hentAlleDriftsmeldinger: () => void;
}

/**
 * DriftsmeldingerTabell
 */
const DriftsmeldingerTabell: FunctionComponent<OwnProps> = ({
  driftsmeldinger,
  hentAlleDriftsmeldinger,
}) => {
  const [showSlettModal, setShowSlettModal] = useState(false);
  const [valgtDriftsmelding, setValgtDriftsmelding] = useState<Driftsmelding>(undefined);

  const { startRequest: fjernDriftsmelding } = useRestApiRunner<Driftsmelding>(K9LosApiKeys.SLETT_DRIFTSMELDING);
  const { startRequest: switchDriftsmelding } = useRestApiRunner<Driftsmelding>(K9LosApiKeys.TOGGLE_DRIFTSMELDING);

  const showSletteDriftsmeldingModal = (driftsmelding: Driftsmelding) => {
    setShowSlettModal(true);
    setValgtDriftsmelding(driftsmelding);
  };

  const closeSletteModal = () => {
    setShowSlettModal(false);
    setValgtDriftsmelding(undefined);
  };

  const slettDriftsmelding = (dm: Driftsmelding) => {
    fjernDriftsmelding({ id: dm.id }).then(() => hentAlleDriftsmeldinger());
    closeSletteModal();
  };
  const sorterteDriftsmeldinger = driftsmeldinger.sort((d1, d2) => d1.dato.localeCompare(d2.dato));

  return (
    <>
      <Element><FormattedMessage id="DriftsmeldingerTabell.Driftsmeldinger" /></Element>
      {sorterteDriftsmeldinger.length === 0 && (
      <>
        <VerticalSpacer eightPx />
        <Normaltekst><FormattedMessage id="DriftsmeldingerTabell.IngenDriftsmeldinger" /></Normaltekst>
        <VerticalSpacer eightPx />
      </>
      )}
      {sorterteDriftsmeldinger.length > 0 && (
        <Table headerTextCodes={headerTextCodes} noHover>
          {sorterteDriftsmeldinger.map((driftsmelding) => (
            <TableRow key={driftsmelding.id}>
              <TableColumn>{driftsmelding.melding}</TableColumn>
              <TableColumn>
                <div className={styles.checkBox}>
                  <Checkbox
                    label=""
                    checked={driftsmelding.aktiv}
                    onChange={(e) => switchDriftsmelding({ id: driftsmelding.id, aktiv: e.target.checked }).then(() => hentAlleDriftsmeldinger())}
                    name="aktiv"
                  />
                </div>
              </TableColumn>
              <TableColumn>
                <FormattedMessage
                  id="DriftsmeldingerTabell.Dato"
                  values={{
                    ...getDateAndTime(driftsmelding.dato),
                    b: (...chunks) => <b>{chunks}</b>,
                  }}
                />
              </TableColumn>
              <TableColumn>
                <Image
                  src={removeIcon}
                  className={styles.removeImage}
                  onMouseDown={() => showSletteDriftsmeldingModal(driftsmelding)}
                  onKeyDown={() => showSletteDriftsmeldingModal(driftsmelding)}
                  tabIndex={0}
                />
              </TableColumn>
            </TableRow>
          ))}
        </Table>
      )}
      {showSlettModal && (
        <SletteDriftsmeldingerModal
          valgtDriftsmelding={valgtDriftsmelding}
          closeSletteModal={closeSletteModal}
          fjernDriftsmelding={slettDriftsmelding}
        />
      )}
    </>
  );
};

export default DriftsmeldingerTabell;
