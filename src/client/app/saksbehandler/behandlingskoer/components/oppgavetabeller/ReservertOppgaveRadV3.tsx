/* eslint-disable no-param-reassign */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { RefAttributes } from 'react';
import { FormattedMessage } from 'react-intl';
import classNames from 'classnames';
import { ExclamationmarkTriangleFillIcon, MenuHamburgerIcon } from '@navikt/aksel-icons';
import { Button, Table } from '@navikt/ds-react';
import { getK9sakHref } from 'app/paths';
import { K9LosApiKeys, RestApiGlobalStatePathsKeys } from 'api/k9LosApi';
import { useGlobalStateRestApiData, useRestApiRunner } from 'api/rest-api-hooks';
import ReservasjonV3 from 'saksbehandler/behandlingskoer/ReservasjonV3Dto';
import KommentarMedMerknad from 'saksbehandler/components/KommentarMedMerknad';
import DateLabel from 'sharedComponents/DateLabel';
import { OppgaveNøkkel } from 'types/OppgaveNøkkel';
import OppgaveV3 from 'types/OppgaveV3';
import { getDateAndTime } from 'utils/dateUtils';
import ReservasjonMeny from '../menu/ReservasjonMeny';
import * as styles from './oppgaverTabell.css';

// Update the path as necessary

interface OwnProps {
	oppgave: OppgaveV3;
	reservasjon: ReservasjonV3;
	forlengOppgaveReservasjonFn: (oppgaveNøkkel: OppgaveNøkkel) => void;
	valgtOppgaveId: string;
	setValgtOppgaveId: React.Dispatch<React.SetStateAction<string>>;
	gjelderHastesaker: boolean;
}

type Ref = { [key: string]: HTMLElement | null };
type Props = OwnProps & RefAttributes<Ref>;

const ReservertOppgaveRadV3: React.ForwardRefExoticComponent<Props> = React.forwardRef(
	(
		{
			oppgave,
			reservasjon,
			forlengOppgaveReservasjonFn,
			valgtOppgaveId,
			setValgtOppgaveId,
			gjelderHastesaker,
		}: OwnProps,
		ref: React.RefObject<{ [key: string]: HTMLElement | null }>,
	) => {
		const { startRequest: leggTilBehandletOppgave } = useRestApiRunner(K9LosApiKeys.LEGG_TIL_BEHANDLET_OPPGAVE);
		const k9sakUrl = useGlobalStateRestApiData<{ verdi?: string }>(RestApiGlobalStatePathsKeys.K9SAK_URL);

		const toggleMenu = (oppgaveValgt?: OppgaveV3) => {
			if (oppgaveValgt && (!valgtOppgaveId || valgtOppgaveId !== oppgaveValgt.oppgaveNøkkel.oppgaveEksternId)) {
				setValgtOppgaveId(oppgaveValgt.oppgaveNøkkel.oppgaveEksternId);
			} else {
				setValgtOppgaveId(undefined);
			}
		};

		const tilOppgave = () => {
			leggTilBehandletOppgave(oppgave.oppgaveNøkkel);

			let fallbackUrl = '';

			if (oppgave?.saksnummer) {
				fallbackUrl = getK9sakHref(k9sakUrl.verdi, oppgave?.saksnummer, oppgave?.oppgaveNøkkel?.oppgaveEksternId);
			}
			window.location.assign(oppgave.oppgavebehandlingsUrl || fallbackUrl);
		};
		return (
			<Table.Row
				key={oppgave.oppgaveNøkkel.oppgaveEksternId}
				className={classNames(styles.isUnderBehandling, { [styles.hastesak]: gjelderHastesaker })}
				onKeyDown={tilOppgave}
			>
				{gjelderHastesaker && (
					<Table.DataCell onClick={tilOppgave} className={`${styles.hastesakTd} hover:cursor-pointer`}>
						<ExclamationmarkTriangleFillIcon height="1.5rem" width="1.5rem" className={styles.hastesakIkon} />
					</Table.DataCell>
				)}
				<Table.DataCell
					onClick={tilOppgave}
					className={`${gjelderHastesaker ? '' : styles.soekerPadding} hover:cursor-pointer`}
				>
					{oppgave.søkersNavn ? `${oppgave.søkersNavn} ${oppgave.søkersPersonnr}` : '<navn>'}
				</Table.DataCell>
				<Table.DataCell onClick={tilOppgave} className="hover:cursor-pointer">
					{oppgave.saksnummer || oppgave.journalpostId}
				</Table.DataCell>
				<Table.DataCell onClick={tilOppgave} className="hover:cursor-pointer">
					{oppgave.behandlingstype.navn}
				</Table.DataCell>
				<Table.DataCell onClick={tilOppgave} className="hover:cursor-pointer">
					{(oppgave.opprettetTidspunkt && <DateLabel dateString={oppgave.opprettetTidspunkt} />) || '-'}
				</Table.DataCell>
				<Table.DataCell onClick={tilOppgave} className={`${styles.reservertTil} hover:cursor-pointer`}>
					<FormattedMessage
						id="OppgaveHandlingerMenu.ReservertTil"
						values={{
							...getDateAndTime(reservasjon.reservertTil),
							// eslint-disable-next-line react/no-unstable-nested-components
							b: (...chunks) => <b>{chunks}</b>,
						}}
					/>
				</Table.DataCell>
				<Table.DataCell>
					<KommentarMedMerknad reservasjon={reservasjon} />
				</Table.DataCell>
				<Table.DataCell className={styles.menuElement}>
					<div
						ref={(el) => {
							ref.current = { ...ref.current, [oppgave.oppgaveNøkkel.oppgaveEksternId]: el };
						}}
						onKeyDown={(event) => event.stopPropagation()}
					>
						{valgtOppgaveId === oppgave.oppgaveNøkkel.oppgaveEksternId && (
							<ReservasjonMeny
								imageNode={ref.current[valgtOppgaveId]}
								toggleMenu={toggleMenu}
								oppgave={oppgave}
								reservasjon={reservasjon}
								forlengOppgaveReservasjon={forlengOppgaveReservasjonFn}
							/>
						)}
						<Button
							icon={<MenuHamburgerIcon />}
							className="p-0 mr-4"
							variant="tertiary"
							aria-label="Handlinger på oppgave"
							onClick={() => toggleMenu(oppgave)}
						/>
					</div>
				</Table.DataCell>
			</Table.Row>
		);
	},
);

export default ReservertOppgaveRadV3;
