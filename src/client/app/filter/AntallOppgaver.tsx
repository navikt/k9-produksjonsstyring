import React, { useContext, useState } from 'react';
import { ArrowsCirclepathIcon } from '@navikt/aksel-icons';
import { Skeleton, Button, Label } from '@navikt/ds-react';
import apiPaths from 'api/apiPaths';
import { useMutation } from 'react-query';
import { OppgaveQuery, Oppgaverad } from './filterTsTypes';
import { antallTreffOppgaver } from './utils';
import { FilterContext } from './FilterContext';

interface OwnProps {
	validateOppgaveQuery: (validateFunc: (isValidating: boolean) => void) => Promise<boolean>;
	setQueryError: (error: string) => void;
}

export const AntallOppgaver = ({ validateOppgaveQuery, setQueryError }: OwnProps) => {
	const { oppgaveQuery } = useContext(FilterContext);
	const [isValidating, setIsValidating] = useState(false);

	const [antallOppgaver, setAntallOppgaver] = useState('');
	const { mutate, isLoading } = useMutation<unknown, unknown, { url: string; body: OppgaveQuery }>({
		onSuccess: (data) => {
			if (data) {
				setAntallOppgaver(antallTreffOppgaver(data as Oppgaverad[]));
			}
		},
	});

	const loading = isLoading || isValidating;

	const hentOppgaver = async () => {
		const oppgaveQueryIsValid = await validateOppgaveQuery(setIsValidating);
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
				Antall oppgaver: {loading ? <Skeleton className="inline-block w-12" /> : antallOppgaver}
			</Label>
			<Button
				variant="tertiary"
				icon={<ArrowsCirclepathIcon aria-hidden />}
				size="small"
				onClick={hentOppgaver}
				loading={loading}
				disabled={loading}
			>
				Oppdater antall
			</Button>
		</div>
	);
};
