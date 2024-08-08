import React, { FunctionComponent } from 'react';
import moment from 'moment/moment';
import { getHeaderCodes } from 'saksbehandler/behandlingskoer/components/oppgavetabeller/oppgavetabellerfelles';
import Table from 'sharedComponents/Table';
import TableColumn from 'sharedComponents/TableColumn';
import TableRow from 'sharedComponents/TableRow';
import OppgaveV3 from 'types/OppgaveV3';
import { DDMMYYYY_DATE_FORMAT } from 'utils/formats';
import * as styles from './oppgaverTabell.css';

interface OwnProps {
	oppgaver: OppgaveV3[];
}

/**
 * OppgaverTabell
 */
export const OppgaverTabellV3: FunctionComponent<OwnProps> = ({ oppgaver = [] }: OwnProps) => {
	if (!oppgaver.length) {
		return null;
	}

	return (
		<div>
			<Table headerTextCodes={getHeaderCodes().filter(Boolean)}>
				{oppgaver?.map((oppgave) => (
					<TableRow key={oppgave.oppgaveNøkkel.oppgaveEksternId} model={oppgave} className={styles.oppgavetabell_row}>
						<TableColumn>
							{oppgave.søkersNavn ? `${oppgave.søkersNavn} ${oppgave.søkersPersonnr}` : '<navn>'}
						</TableColumn>
						<TableColumn>{oppgave.journalpostId || oppgave.saksnummer}</TableColumn>
						<TableColumn>{oppgave.behandlingstype.navn}</TableColumn>
						<TableColumn>
							{oppgave.opprettetTidspunkt && moment(oppgave.opprettetTidspunkt).format(DDMMYYYY_DATE_FORMAT)}
						</TableColumn>
					</TableRow>
				))}
			</Table>
		</div>
	);
};

export default OppgaverTabellV3;
