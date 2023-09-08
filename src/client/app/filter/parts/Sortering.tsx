import React from 'react';
import { useMutation } from 'react-query';
import { Refresh } from '@navikt/ds-icons';
import { Button, Select } from '@navikt/ds-react';
import apiPaths from 'api/apiPaths';
import { OppgaveQuery, Oppgavefelt } from 'filter/filterTsTypes';
import { defaultMutation } from 'utils/reactQueryConfig';
import OppgaveOrderFelter from './OppgaveOrderFelter';

interface Props {
	køvisning: boolean;
	oppgaveQuery: OppgaveQuery;
	felter: Oppgavefelt[];
	slett: (id: string) => void;
	leggTil: () => void;
	oppdater: (id: string, verdi: string) => void;
}

const Sortering = ({ køvisning, oppgaveQuery, felter, slett, leggTil, oppdater }: Props) => {
	const { mutate, data, isLoading } = useMutation<unknown, unknown, { url: string; body: OppgaveQuery }>({});
	console.log(data);

	if (!køvisning) {
		return (
			<OppgaveOrderFelter
				oppgaveQuery={oppgaveQuery}
				felter={felter}
				slett={slett}
				leggTil={leggTil}
				oppdater={oppdater}
			/>
		);
	}
	return (
		<div className="bg-surface-subtle rounded flex p-5 mt-8">
			<div className="w-5/12">
				<Select label="Sortering:" size="small">
					<option>Velg sortering</option>
				</Select>
			</div>
			<div className="flex flex-col m-auto">
				<span>Antall oppgaver: 0</span>
				<Button
					variant="tertiary"
					icon={<Refresh aria-hidden />}
					size="small"
					onClick={() => mutate({ url: apiPaths.hentOppgaver, body: oppgaveQuery })}
				>
					Oppdater antall
				</Button>
			</div>
		</div>
	);
};

export default Sortering;
