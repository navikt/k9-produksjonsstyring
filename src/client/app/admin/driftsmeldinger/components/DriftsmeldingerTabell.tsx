import React, { FunctionComponent, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { TrashIcon } from '@navikt/aksel-icons';
import { BodyShort, Button, Checkbox, Label } from '@navikt/ds-react';
import { K9LosApiKeys } from 'api/k9LosApi';
import useRestApiRunner from 'api/rest-api-hooks/src/local-data/useRestApiRunner';
import Table from 'sharedComponents/Table';
import TableColumn from 'sharedComponents/TableColumn';
import TableRow from 'sharedComponents/TableRow';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import { getDateAndTime } from 'utils/dateUtils';
import { Driftsmelding } from '../driftsmeldingTsType';
import SletteDriftsmeldingerModal from './SletteDriftsmeldingerModal';

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
			<Label>
				<FormattedMessage id="DriftsmeldingerTabell.Driftsmeldinger" />
			</Label>
			{sorterteDriftsmeldinger.length === 0 && (
				<>
					<VerticalSpacer eightPx />
					<BodyShort size="small">
						<FormattedMessage id="DriftsmeldingerTabell.IngenDriftsmeldinger" />
					</BodyShort>
					<VerticalSpacer eightPx />
				</>
			)}
			{sorterteDriftsmeldinger.length > 0 && (
				<Table headerTextCodes={headerTextCodes} noHover>
					{sorterteDriftsmeldinger.map((driftsmelding) => (
						<TableRow key={driftsmelding.id}>
							<TableColumn>{driftsmelding.melding}</TableColumn>
							<TableColumn>
								<div>
									<Checkbox
										className="p-0 mt-[-4px]"
										hideLabel
										size="small"
										checked={driftsmelding.aktiv}
										onChange={(e) =>
											switchDriftsmelding({ id: driftsmelding.id, aktiv: e.target.checked }).then(() =>
												hentAlleDriftsmeldinger(),
											)
										}
										name="aktiv"
									>
										Toggle driftsmelding
									</Checkbox>
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
								<Button
									className="p-0"
									icon={<TrashIcon />}
									variant="tertiary"
									onClick={() => showSletteDriftsmeldingModal(driftsmelding)}
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
