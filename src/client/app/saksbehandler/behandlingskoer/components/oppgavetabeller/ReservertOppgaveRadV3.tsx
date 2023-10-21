/* eslint-disable no-param-reassign */

/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { RefAttributes } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import classNames from 'classnames';
import menuIconBlackUrl from 'images/ic-menu-18px_black.svg';
import menuIconBlueUrl from 'images/ic-menu-18px_blue.svg';
import { WarningColored } from '@navikt/ds-icons';
import { Table } from '@navikt/ds-react';
import OppgaveV3 from 'saksbehandler/OppgaveV3';
import ReservasjonV3Dto from 'saksbehandler/behandlingskoer/ReservasjonV3Dto';
import Oppgave from 'saksbehandler/oppgaveTsType';
import Image from 'sharedComponents/Image';
import { getDateAndTime } from 'utils/dateUtils';
import ReservasjonMeny from '../menu/ReservasjonMeny';
import styles from './oppgaverTabell.css';

// Update the path as necessary

interface ReserverteOppgaverTableRowProps {
	oppgave: OppgaveV3;
	reservasjon: ReservasjonV3Dto;
	goToFagsak: (oppgave: Oppgave) => void;
	forlengOppgaveReservasjonFn: (oppgaveId: string) => Promise<any>;
	valgtOppgaveId: string;
	setValgtOppgaveId: React.Dispatch<React.SetStateAction<string>>;
	valgtOppgave: OppgaveV3;
	gjelderHastesaker: boolean;
}

type Ref = { [key: string]: HTMLDivElement };
type Props = ReserverteOppgaverTableRowProps & RefAttributes<Ref>;

const ReservertOppgaveRadV3: React.ForwardRefExoticComponent<Props> = React.forwardRef(
	(
		{
			oppgave,
			reservasjon,
			goToFagsak,
			forlengOppgaveReservasjonFn,
			valgtOppgaveId,
			setValgtOppgaveId,
			valgtOppgave,
			gjelderHastesaker,
		}: ReserverteOppgaverTableRowProps,
		ref: React.RefObject<{ [key: string]: HTMLDivElement }>,
	) => {
		const toggleMenu = (oppgaveValgt: OppgaveV3) => {
			if (oppgaveValgt) {
				setValgtOppgaveId(oppgaveValgt.oppgaveEksternId);
			} else {
				setValgtOppgaveId(undefined);
			}
		};
		const intl = useIntl();

		const tilOppgave = () => {
			// goToFagsak(oppgave);
		};
		return (
			<Table.Row
				key={oppgave.oppgaveEksternId}
				className={classNames(styles.isUnderBehandling, { [styles.hastesak]: gjelderHastesaker })}
				onKeyDown={tilOppgave}
			>
				{gjelderHastesaker && (
					<Table.DataCell onClick={tilOppgave} className={`${styles.hastesakTd} hover:cursor-pointer`}>
						<WarningColored className={styles.hastesakIkon} />
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
					-
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
				<Table.DataCell>{/* <KommentarMedMerknad oppgave={oppgave} /> */}</Table.DataCell>
				<Table.DataCell className={styles.menuElement}>
					<div
						ref={(el) => {
							ref.current = { ...ref.current, [oppgave.oppgaveEksternId]: el };
						}}
						onKeyDown={(event) => event.stopPropagation()}
					>
						{valgtOppgaveId === oppgave.oppgaveEksternId && (
							<ReservasjonMeny
								imageNode={ref.current[valgtOppgaveId]}
								toggleMenu={toggleMenu}
								oppgave={oppgave}
								reservasjon={reservasjon}
								forlengOppgaveReservasjon={forlengOppgaveReservasjonFn}
							/>
						)}
						<Image
							className={styles.image}
							src={menuIconBlackUrl}
							srcHover={menuIconBlueUrl}
							alt={intl.formatMessage({ id: 'OppgaverTabell.OppgaveHandlinger' })}
							onMouseDown={() => toggleMenu(oppgave)}
							onKeyDown={() => toggleMenu(oppgave)}
						/>
					</div>
				</Table.DataCell>
			</Table.Row>
		);
	},
);

export default ReservertOppgaveRadV3;
