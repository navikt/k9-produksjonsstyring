import React, { FunctionComponent, ReactNode, useContext, useEffect } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useQuery, useQueryClient } from 'react-query';
import { Element } from 'nav-frontend-typografi';
import { OppgavekøV3MedNavn } from 'types/OppgavekøV3Type';
import { Button, ReadMore, Select } from '@navikt/ds-react';
import apiPaths from 'api/apiPaths';
import { K9LosApiKeys } from 'api/k9LosApi';
import { useAntallOppgaverIKoV3 } from 'api/queries/saksbehandlerQueries';
import useRestApiRunner from 'api/rest-api-hooks/src/local-data/useRestApiRunner';
import BehandlingskoerContext from 'saksbehandler/BehandlingskoerContext';
import { OppgavekøV1 } from 'saksbehandler/behandlingskoer/oppgavekoTsType';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import { FlexColumn, FlexContainer, FlexRow } from 'sharedComponents/flexGrid';
import {
	getValueFromLocalStorage,
	removeValueFromLocalStorage,
	setValueInLocalStorage,
} from 'utils/localStorageHelper';
import { Saksbehandler } from '../saksbehandlerTsType';
import { erKoV3, getKoId } from '../utils';
import OldOppsummeringAvKø from './OldOppsummeringAvKø';
import OppsummeringAvKø from './OppusmmeringAvKø';
import styles from './oppgavekoVelgerForm.css';

interface OwnProps {
	plukkNyOppgave: () => void;
	erRestApiKallLoading: boolean;
}

const createTooltip = (saksbehandlere: Saksbehandler[]): ReactNode | undefined => {
	if (!saksbehandlere || saksbehandlere.length === 0) {
		return undefined;
	}

	return (
		<div>
			<Element className={styles.tooltipHeader}>
				<FormattedMessage id="OppgavekoVelgerForm.SaksbehandlerToolip" />
			</Element>
			{saksbehandlere
				.sort((n1, n2) => n1.epost.localeCompare(n2.epost))
				.map((s) => (
					<li key={s.epost}>{s.navn ? s.navn : s.epost}</li>
				))}
		</div>
	);
};

const getValgtOppgaveko = (oppgavekoer: Array<OppgavekøV1 | OppgavekøV3MedNavn>, oppgavekoId: string) =>
	oppgavekoer.find((s) => oppgavekoId === s.id);

const getDefaultOppgaveko = (oppgavekoer: Array<OppgavekøV1 | OppgavekøV3MedNavn>) => {
	const lagretOppgavekoId = getValueFromLocalStorage('id');
	if (lagretOppgavekoId) {
		if (oppgavekoer.some((s) => s.id === lagretOppgavekoId)) {
			return lagretOppgavekoId;
		}
		removeValueFromLocalStorage('id');
	}

	const sortertOppgavekoer = oppgavekoer.sort((oppgaveko1, oppgaveko2) =>
		oppgaveko1.navn.localeCompare(oppgaveko2.navn),
	);
	return sortertOppgavekoer.length > 0 ? sortertOppgavekoer[0].id : undefined;
};

/**
 * OppgavekoVelgerForm
 *
 */
export const OppgavekoVelgerForm: FunctionComponent<OwnProps> = ({ plukkNyOppgave, erRestApiKallLoading }) => {
	const { oppgavekoer, valgtOppgavekoId, setValgtOppgavekoId } = useContext(BehandlingskoerContext);
	const queryClient = useQueryClient();
	const intl = useIntl();
	const { startRequest: fetchAntallOppgaver, data: antallOppgaver } = useRestApiRunner<number>(
		K9LosApiKeys.BEHANDLINGSKO_OPPGAVE_ANTALL,
	);
	const oppgavekoerSortertAlfabetisk = oppgavekoer.sort((a, b) => a.navn.localeCompare(b.navn));
	const valgtKoId = getDefaultOppgaveko(oppgavekoerSortertAlfabetisk);
	const { data: antallOppgaverV3 } = useAntallOppgaverIKoV3(getKoId(valgtKoId), {
		enabled: erKoV3(valgtKoId),
	});

	const { data: saksbehandlere, startRequest: hentSaksbehandlere } = useRestApiRunner<Saksbehandler[]>(
		K9LosApiKeys.OPPGAVEKO_SAKSBEHANDLERE,
	);
	const { data: saksbehandlereV3 } = useQuery<Saksbehandler[]>(apiPaths.hentSaksbehandlereIKoV3(getKoId(valgtKoId)), {
		enabled: erKoV3(valgtKoId),
	});

	useEffect(() => {
		if (oppgavekoerSortertAlfabetisk.length > 0) {
			const defaultOppgavekoId = getDefaultOppgaveko(oppgavekoerSortertAlfabetisk);
			if (defaultOppgavekoId) {
				setValgtOppgavekoId(defaultOppgavekoId);
				if (!erKoV3(defaultOppgavekoId)) {
					hentSaksbehandlere({ id: getKoId(defaultOppgavekoId) });
					fetchAntallOppgaver({ id: getKoId(defaultOppgavekoId) });
					return;
				}
				queryClient.invalidateQueries(apiPaths.hentSaksbehandlereIKoV3(getKoId(defaultOppgavekoId)));
			}
		}
	}, []);

	const handleSelectKo = (event) => {
		const koId = event.target.value;
		setValgtOppgavekoId(koId);
		setValueInLocalStorage('id', koId);
		if (!erKoV3(koId)) {
			hentSaksbehandlere({ id: getKoId(koId) });
			fetchAntallOppgaver({ id: getKoId(koId) });
		}
	};

	return (
		<div className={styles.oppgavevelgerform_container}>
			<FlexContainer>
				<FlexRow>
					<FlexColumn className={styles.navnInput}>
						<Select
							label={intl.formatMessage({ id: 'OppgavekoVelgerForm.Oppgaveko' })}
							value={valgtOppgavekoId}
							onChange={handleSelectKo}
						>
							{oppgavekoerSortertAlfabetisk.map((oppgaveko) => (
								<option key={oppgaveko.id} value={`${oppgaveko.id}`}>
									{oppgaveko.navn}
								</option>
							))}
						</Select>
						<VerticalSpacer eightPx />
						<FormattedMessage
							id="OppgavekoVelgerForm.AntallOppgaver"
							values={{ antall: (erKoV3(valgtKoId) ? antallOppgaverV3 : antallOppgaver) || 0 }}
						/>
						<ReadMore size="small" header="Andre saksbehandlere i køen">
							{createTooltip(erKoV3(valgtKoId) ? saksbehandlereV3 : saksbehandlere)}
						</ReadMore>
						<VerticalSpacer sixteenPx />
					</FlexColumn>
					{valgtOppgavekoId && <OppsummeringAvKø oppgavekø={getValgtOppgaveko(oppgavekoer, valgtOppgavekoId)} />}
					{valgtOppgavekoId && <OldOppsummeringAvKø oppgaveko={getValgtOppgaveko(oppgavekoer, valgtOppgavekoId)} />}
				</FlexRow>
			</FlexContainer>
			<Button
				id="frode sin knapp"
				className="mt-4 max-w-sm"
				loading={erRestApiKallLoading}
				disabled={erRestApiKallLoading}
				onClick={() => plukkNyOppgave()}
			>
				{intl.formatMessage({ id: 'OppgavekoVelgerForm.PlukkNyOppgave' })}
			</Button>
		</div>
	);
};

export default OppgavekoVelgerForm;
