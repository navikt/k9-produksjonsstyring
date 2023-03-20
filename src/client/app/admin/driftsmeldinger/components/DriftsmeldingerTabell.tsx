import React, { FunctionComponent, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import removeIcon from 'images/remove.svg';
import { Checkbox } from 'nav-frontend-skjema';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import { K9LosApiKeys } from 'api/k9LosApi';
import useRestApiRunner from 'api/rest-api-hooks/src/local-data/useRestApiRunner';
import Image from 'sharedComponents/Image';
import Table from 'sharedComponents/Table';
import TableColumn from 'sharedComponents/TableColumn';
import TableRow from 'sharedComponents/TableRow';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import { getDateAndTime } from 'utils/dateUtils';
import { Driftsmelding } from '../driftsmeldingTsType';
import SletteDriftsmeldingerModal from './SletteDriftsmeldingerModal';
import styles from './driftsmeldingerTabell.css';

const headerTextCodes = ['DriftsmeldingTabell.Tekst', 'DriftsmeldingTabell.Aktiv', 'DriftsmeldingTabell.Dato'];

interface OwnProps {
    driftsmeldinger: Driftsmelding[];
    hentAlleDriftsmeldinger: () => void;
}

const boldChunks = (...chunks) => <b>{chunks}</b>;

/**
 * DriftsmeldingerTabell
 */
const DriftsmeldingerTabell: FunctionComponent<OwnProps> = ({ driftsmeldinger, hentAlleDriftsmeldinger }) => {
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
            <Element>
                <FormattedMessage id="DriftsmeldingerTabell.Driftsmeldinger" />
            </Element>
            {sorterteDriftsmeldinger.length === 0 && (
                <>
                    <VerticalSpacer eightPx />
                    <Normaltekst>
                        <FormattedMessage id="DriftsmeldingerTabell.IngenDriftsmeldinger" />
                    </Normaltekst>
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
                                        onChange={(e) =>
                                            switchDriftsmelding({ id: driftsmelding.id, aktiv: e.target.checked }).then(
                                                () => hentAlleDriftsmeldinger(),
                                            )
                                        }
                                        name="aktiv"
                                    />
                                </div>
                            </TableColumn>
                            <TableColumn>
                                <FormattedMessage
                                    id="DriftsmeldingerTabell.Dato"
                                    values={{
                                        ...getDateAndTime(driftsmelding.dato),
                                        b: boldChunks,
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
