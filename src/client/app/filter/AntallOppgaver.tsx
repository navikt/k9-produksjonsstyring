import React, { useContext, useState } from 'react';
import { ArrowsCirclepathIcon } from '@navikt/aksel-icons';
import { Skeleton, Button, Label } from '@navikt/ds-react';
import apiPaths from 'api/apiPaths';
import { useMutation } from 'react-query';
import { OppgaveQuery, Oppgaverad } from './filterTsTypes';
import { antallTreffOppgaver } from './utils';
import { FilterContext } from './FilterContext';

interface OwnProps {
	validateOppgaveQuery: () => Promise<boolean>;
	setQueryError: (error: string) => void;
}

export const AntallOppgaver = ({ validateOppgaveQuery, setQueryError }: OwnProps) => {
	const { oppgaveQuery } = useContext(FilterContext);

	const [antallOppgaver, setAntallOppgaver] = useState('');
	const { mutate, isLoading } = useMutation<unknown, unknown, { url: string; body: OppgaveQuery }>({
		onSuccess: (data) => {
			if (data) {
				setAntallOppgaver(antallTreffOppgaver(data as Oppgaverad[]));
			}
		},
	});

	const hentOppgaver = async () => {
		const oppgaveQueryIsValid = await validateOppgaveQuery();
		if (oppgaveQueryIsValid) {
			mutate({ url: apiPaths.hentOppgaver, body: oppgaveQuery });
			setQueryError('');
		} else {
			setAntallOppgaver('');
			setQueryError('Kriteriene for køen er ikke gyldige.');
		}
	};
	return (
		<div className="flex flex-col m-auto">
			<Label size="small">
				Antall oppgaver: {isLoading ? <Skeleton className="inline-block w-12" /> : antallOppgaver}
			</Label>
			<Button
				variant="tertiary"
				icon={<ArrowsCirclepathIcon aria-hidden className={`${isLoading ? 'animate-spin' : ' '}`} />}
				size="small"
				onClick={hentOppgaver}
				disabled={isLoading}
			>
				{isLoading ? 'Oppdaterer antall...' : 'Oppdater antall'}
			</Button>
		</div>
	);
};
