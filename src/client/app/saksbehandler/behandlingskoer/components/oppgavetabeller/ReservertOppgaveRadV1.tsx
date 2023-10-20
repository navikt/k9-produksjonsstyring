/* eslint-disable jsx-a11y/no-static-element-interactions */

/* eslint-disable no-param-reassign */
import React, { RefAttributes } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import classNames from 'classnames';
import menuIconBlackUrl from 'images/ic-menu-18px_black.svg';
import menuIconBlueUrl from 'images/ic-menu-18px_blue.svg';
import { WarningColored } from '@navikt/ds-icons';
import { Table } from '@navikt/ds-react';
import AlleKodeverk from 'kodeverk/alleKodeverkTsType';
import kodeverkTyper from 'kodeverk/kodeverkTyper';
import OppgaveV3 from 'saksbehandler/OppgaveV3';
import { hentIDFraSak } from 'saksbehandler/behandlingskoer/components/oppgavetabeller/oppgavetabellerfelles';
import KommentarMedMerknad from 'saksbehandler/components/KommentarMedMerknad';
import Oppgave from 'saksbehandler/oppgaveTsType';
import DateLabel from 'sharedComponents/DateLabel';
import Image from 'sharedComponents/Image';
import { getDateAndTime } from 'utils/dateUtils';
import { getKodeverknavnFraKode } from 'utils/kodeverkUtils';
import OppgaveHandlingerMenu from '../menu/OppgaveHandlingerMenu';
import styles from './oppgaverTabell.css';

// Update the path as necessary

interface Props {
	oppgave: Oppgave;
	alleKodeverk: AlleKodeverk;
	goToFagsak: (oppgave: Oppgave) => void;
	forlengOppgaveReservasjonFn: (oppgaveId: string) => Promise<any>;
	valgtOppgaveId: string;
	setValgtOppgaveId: React.Dispatch<React.SetStateAction<string>>;
	valgtOppgave: Oppgave | OppgaveV3;
	gjelderHastesaker: boolean;
}

type Ref = { [key: string]: HTMLDivElement };
type OwnProps = Props & RefAttributes<Ref>;

const ReservertOppgaveRadV1: React.ForwardRefExoticComponent<OwnProps> = React.forwardRef(
	(
		{
			oppgave,
			alleKodeverk,
			goToFagsak,
			forlengOppgaveReservasjonFn,
			valgtOppgaveId,
			setValgtOppgaveId,
			valgtOppgave,
			gjelderHastesaker,
		}: Props,
		ref: React.RefObject<{ [key: string]: HTMLDivElement }>,
	) => {
		const toggleMenu = (oppgaveValgt: Oppgave) => {
			if (oppgaveValgt) {
				setValgtOppgaveId(oppgaveValgt.eksternId);
			} else {
				setValgtOppgaveId(undefined);
			}
		};
		const intl = useIntl();

		return (
			<Table.Row
				key={oppgave.eksternId}
				className={classNames(styles.isUnderBehandling, { [styles.hastesak]: gjelderHastesaker })}
				onKeyDown={() => goToFagsak(oppgave)}
			>
				{gjelderHastesaker && (
					<Table.DataCell onClick={() => goToFagsak(oppgave)} className={`${styles.hastesakTd} hover:cursor-pointer`}>
						<WarningColored className={styles.hastesakIkon} />
					</Table.DataCell>
				)}
				<Table.DataCell
					onClick={() => goToFagsak(oppgave)}
					className={`${gjelderHastesaker ? '' : styles.soekerPadding} hover:cursor-pointer`}
				>
					{oppgave.navn ? `${oppgave.navn} ${oppgave.personnummer}` : '<navn>'}
				</Table.DataCell>
				<Table.DataCell onClick={() => goToFagsak(oppgave)} className="hover:cursor-pointer">
					{hentIDFraSak(oppgave, alleKodeverk)}
				</Table.DataCell>
				<Table.DataCell onClick={() => goToFagsak(oppgave)} className="hover:cursor-pointer">
					{getKodeverknavnFraKode(oppgave.behandlingstype, kodeverkTyper.BEHANDLING_TYPE, alleKodeverk)}
				</Table.DataCell>
				<Table.DataCell onClick={() => goToFagsak(oppgave)} className="hover:cursor-pointer">
					{oppgave.opprettetTidspunkt && <DateLabel dateString={oppgave.opprettetTidspunkt} />}
				</Table.DataCell>
				<Table.DataCell onClick={() => goToFagsak(oppgave)} className={`${styles.reservertTil} hover:cursor-pointer`}>
					<FormattedMessage
						id="OppgaveHandlingerMenu.ReservertTil"
						values={{
							...getDateAndTime(oppgave.status.reservertTilTidspunkt),
							// eslint-disable-next-line react/no-unstable-nested-components
							b: (...chunks) => <b>{chunks}</b>,
						}}
					/>
				</Table.DataCell>
				<Table.DataCell>
					<KommentarMedMerknad oppgave={oppgave} />
				</Table.DataCell>
				<Table.DataCell className={styles.menuElement}>
					<div
						ref={(el) => {
							if (el && ref && ref.current) {
								ref.current[oppgave.eksternId] = el;
							}
						}}
						onKeyDown={(event) => event.stopPropagation()}
					>
						{valgtOppgaveId === oppgave.eksternId && (
							<OppgaveHandlingerMenu
								imageNode={ref?.current[valgtOppgaveId]}
								toggleMenu={toggleMenu}
								oppgave={valgtOppgave}
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

export default ReservertOppgaveRadV1;
