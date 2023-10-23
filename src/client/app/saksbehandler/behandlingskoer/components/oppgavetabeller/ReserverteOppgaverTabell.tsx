/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { FunctionComponent, useCallback, useEffect, useRef, useState } from 'react';
import { FormattedMessage, WrappedComponentProps, injectIntl } from 'react-intl';
import { useQueryClient } from 'react-query';
import NavFrontendChevron from 'nav-frontend-chevron';
import { Normaltekst } from 'nav-frontend-typografi';
import { ErrorMessage, Loader, Table } from '@navikt/ds-react';
import apiPaths from 'api/apiPaths';
import { K9LosApiKeys, RestApiGlobalStatePathsKeys } from 'api/k9LosApi';
import { useSaksbehandlerReservasjoner } from 'api/queries/saksbehandlerQueries';
import { useGlobalStateRestApiData } from 'api/rest-api-hooks';
import useRestApiRunner from 'api/rest-api-hooks/src/local-data/useRestApiRunner';
import Reservasjon from 'avdelingsleder/reservasjoner/reservasjonTsType';
import AlleKodeverk from 'kodeverk/alleKodeverkTsType';
import merknadType from 'kodeverk/merknadType';
import OppgaveV3 from 'saksbehandler/OppgaveV3';
import ReservasjonV3Dto from 'saksbehandler/behandlingskoer/ReservasjonV3Dto';
import { getHeaderCodes } from 'saksbehandler/behandlingskoer/components/oppgavetabeller/oppgavetabellerfelles';
import Oppgave from 'saksbehandler/oppgaveTsType';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import kopanelStyles from '../oppgavekoPanel.css';
import OppgaveTabellMenyAntallOppgaver from './OppgaveTabellMenyAntallOppgaver';
import ReservertOppgaveRadV1 from './ReservertOppgaveRadV1';
import ReservertOppgaveRadV3 from './ReservertOppgaveRadV3';
import styles from './oppgaverTabell.css';

interface OwnProps {
	apneOppgave: (oppgave: Oppgave) => void;
	gjelderHastesaker?: boolean;
}

const reduceTilOppgaver = (data: ReservasjonV3Dto[]): Array<Oppgave | OppgaveV3> =>
	data.reduce((acc, item) => {
		if (item.reserverteV3Oppgaver && item.reserverteV3Oppgaver.length > 0) {
			const { reserverteV3Oppgaver, ...rest } = item;
			const items = reserverteV3Oppgaver.map((oppgave) => ({ reservertV3Oppgave: oppgave, ...rest }));
			acc.push(...items);
		}
		if (item.reservertOppgaveV1Dto) {
			const { reservertOppgaveV1Dto, ...rest } = item;
			acc.push({ reservertOppgaveV1Dto, ...rest });
		}
		return acc;
	}, []);

const ReserverteOppgaverTabell: FunctionComponent<OwnProps & WrappedComponentProps> = ({
	apneOppgave,
	gjelderHastesaker,
}) => {
	const [valgtOppgaveId, setValgtOppgaveId] = useState<string>();
	const [visReservasjoner, setVisReservasjoner] = useState(true);
	const {
		data: reservasjoner,
		isLoading,
		isSuccess,
		isError,
	} = useSaksbehandlerReservasjoner({
		select: (reserverteOppgaverData: ReservasjonV3Dto[]): ReservasjonV3Dto[] => {
			if (gjelderHastesaker) {
				return reserverteOppgaverData.filter(
					(oppgave) => !!oppgave.merknad?.merknadKoder?.includes(merknadType.HASTESAK),
				);
			}
			return reserverteOppgaverData.filter(
				(oppgave) => !oppgave?.merknad?.merknadKoder?.includes(merknadType.HASTESAK),
			);
		},
	});
	const queryClient = useQueryClient();

	const alleKodeverk: AlleKodeverk = useGlobalStateRestApiData(RestApiGlobalStatePathsKeys.KODEVERK);

	const { startRequest: leggTilBehandletOppgave } = useRestApiRunner(K9LosApiKeys.LEGG_TIL_BEHANDLET_OPPGAVE);
	const { startRequest: forlengOppgavereservasjon } = useRestApiRunner<Reservasjon[]>(
		K9LosApiKeys.FORLENG_OPPGAVERESERVASJON,
	);

	const initialRender = useRef({});

	useEffect(() => {
		if (initialRender.current) {
			initialRender.current = false;
		}
	});

	const forlengOppgaveReservasjonFn = (oppgaveId: string) => {
		forlengOppgavereservasjon({ oppgaveId }).then(() => {
			queryClient.invalidateQueries([apiPaths.saksbehandlerReservasjoner]);
		});
	};
	const ref = useRef({});

	const goToFagsak = (oppgave: Oppgave) => {
		leggTilBehandletOppgave(oppgave);
		apneOppgave(oppgave);
	};

	const valgtReservasjon = reservasjoner?.find((o) => {
		if (o.reservertOppgaveV1Dto) {
			return o.reservertOppgaveV1Dto.eksternId === valgtOppgaveId;
		}
		if (o.reserverteV3Oppgaver) {
			return o.reserverteV3Oppgaver.some((v) => v.oppgaveEksternId === valgtOppgaveId);
		}
		return false;
	});
	return (
		<div>
			<button
				type="button"
				className={kopanelStyles.behandlingskoerKnapp}
				onClick={() => setVisReservasjoner(!visReservasjoner)}
			>
				<NavFrontendChevron type={visReservasjoner ? 'ned' : 'høyre'} className={kopanelStyles.chevron} />
				<FormattedMessage
					id={gjelderHastesaker ? 'OppgaverTabell.ReserverteHastesaker' : 'OppgaverTabell.ReserverteOppgaver'}
				/>
				{isSuccess && (
					<OppgaveTabellMenyAntallOppgaver
						antallOppgaver={reservasjoner?.length}
						tekstId={
							gjelderHastesaker
								? 'OppgaverTabell.ReserverteHastesakerAntall'
								: 'OppgaverTabell.ReserverteOppgaverAntall'
						}
						hastesak={gjelderHastesaker}
					/>
				)}
			</button>
			{isLoading && visReservasjoner && <Loader size="large" className={styles.spinner} />}
			{isError && visReservasjoner && <ErrorMessage>Noe gikk galt ved lasting av reservasjoner</ErrorMessage>}
			{reservasjoner?.length === 0 && isSuccess && visReservasjoner && (
				<>
					<VerticalSpacer eightPx />
					<Normaltekst>
						{!gjelderHastesaker ? (
							<FormattedMessage id="OppgaverTabell.IngenReserverteOppgaver" />
						) : (
							<FormattedMessage id="OppgaverTabell.IngenReserverteHastesaker" />
						)}
					</Normaltekst>
				</>
			)}
			{reservasjoner?.length > 0 && isSuccess && visReservasjoner && (
				<Table>
					<Table.Header>
						<Table.Row>
							{getHeaderCodes(true, gjelderHastesaker)
								.filter(Boolean)
								.map((header) => (
									<Table.HeaderCell key={header}>
										{!header.includes('EMPTY') ? <FormattedMessage id={header} /> : ''}
									</Table.HeaderCell>
								))}
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{reservasjoner.map((reservasjon) =>
							reservasjon.reservertOppgaveV1Dto ? (
								<ReservertOppgaveRadV1
									key={reservasjon.reservertOppgaveV1Dto.eksternId}
									oppgave={reservasjon.reservertOppgaveV1Dto}
									alleKodeverk={alleKodeverk}
									goToFagsak={goToFagsak}
									forlengOppgaveReservasjonFn={forlengOppgaveReservasjonFn}
									valgtOppgaveId={valgtOppgaveId}
									setValgtOppgaveId={setValgtOppgaveId}
									valgtOppgave={valgtReservasjon}
									gjelderHastesaker={gjelderHastesaker}
									ref={ref}
								/>
							) : (
								reservasjon.reserverteV3Oppgaver.map((v) => (
									<ReservertOppgaveRadV3
										key={v.oppgaveEksternId}
										oppgave={v}
										reservasjon={reservasjon}
										alleKodeverk={alleKodeverk}
										goToFagsak={goToFagsak}
										forlengOppgaveReservasjonFn={forlengOppgaveReservasjonFn}
										valgtOppgaveId={valgtOppgaveId}
										setValgtOppgaveId={setValgtOppgaveId}
										valgtOppgave={valgtReservasjon}
										gjelderHastesaker={gjelderHastesaker}
										ref={ref}
									/>
								))
							),
						)}
					</Table.Body>
				</Table>
			)}
		</div>
	);
};

export default ReserverteOppgaverTabell;
