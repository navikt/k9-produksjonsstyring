import React from 'react';
import { Table } from '@navikt/ds-react';
import { visningsnavnForFelt } from '../utils';

interface OwnProps {
    felter: Oppgavefelt[];
    oppgaveQuery: OppgaveQuery;
    oppgaver: Oppgaverad[];
}

const OppgaveQueryResultat = ({ felter, oppgaveQuery, oppgaver }): OwnProps => (
    <Table>
        <Table.Header>
            <Table.Row>
                {oppgaveQuery.select &&
                    oppgaveQuery.select.map(
                        (felt) =>
                            felt.kode && (
                                <Table.HeaderCell scope="col" key={felt.id}>
                                    {visningsnavnForFelt(felter, felt.område, felt.kode)}
                                </Table.HeaderCell>
                            ),
                    )}
            </Table.Row>
        </Table.Header>
        <Table.Body>
            {oppgaver.map((oppgave) => (
                <Table.Row key={oppgave.id}>
                    {oppgave.felter.map((felt) => (
                        <Table.DataCell key={oppgave.id}>
                            {Array.isArray(felt.verdi) ? felt.verdi.join(', ') : felt.verdi}
                        </Table.DataCell>
                    ))}
                </Table.Row>
            ))}
        </Table.Body>
    </Table>
);

export default OppgaveQueryResultat;
