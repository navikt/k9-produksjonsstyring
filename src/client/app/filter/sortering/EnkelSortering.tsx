import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { ArrowsCirclepathIcon } from '@navikt/aksel-icons';
import { Button, Select, Skeleton } from '@navikt/ds-react';
import apiPaths from 'api/apiPaths';
import { FilterContext } from 'filter/FilterContext';
import { OppgaveQuery, Oppgaverad } from 'filter/filterTsTypes';
import { addSortering, resetSortering } from 'filter/queryUtils';
import { antallTreffOppgaver } from 'filter/utils';
import { mapKodeTilSorteringParams, mapSorteringParamsTilKode } from './sorteringUtils';

const EnkelSortering = () => {
	const { oppgaveQuery, updateQuery } = useContext(FilterContext);
	const [antallOppgaver, setAntallOppgaver] = useState('');
	const queryClient = useQueryClient();
	// Assign a unique query key for your mutation
	const hentOppgaverQueryKey = ['hentOppgaver', oppgaveQuery];
	const { mutate, isLoading } = useMutation<unknown, unknown, { url: string; body: OppgaveQuery }>(
		hentOppgaverQueryKey,
		{
			onSuccess: (data) => {
				if (data) {
					setAntallOppgaver(antallTreffOppgaver(data as Oppgaverad[]));
				}
			},
		},
	);

	const hentOppgaver = () => mutate({ url: apiPaths.hentOppgaver, body: oppgaveQuery });

	useEffect(() => {
		hentOppgaver();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(
		() => () => {
			queryClient.cancelQueries(hentOppgaverQueryKey);
		},
		[oppgaveQuery, queryClient],
	);

	const selectValue = useMemo(() => {
		if (!oppgaveQuery.order.length) return undefined;

		if (oppgaveQuery.order.length > 1) {
			throw new Error('Kan ikke håndtere flere sorteringer');
		}

		return mapSorteringParamsTilKode(oppgaveQuery.order[0]);
	}, [oppgaveQuery]);

	const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const payload = mapKodeTilSorteringParams(e.target.value);
		if (payload) {
			updateQuery([resetSortering(), addSortering(payload)]);
		}
	};

	return (
		<div className="bg-surface-subtle rounded flex p-5 mt-8">
			<div className="w-6/12">
				<Select label="Sortering:" size="small" onChange={handleChange} value={selectValue}>
					<option value="mottattDatoEldstTilNyest">Mottatt dato: eldste til nyeste</option>
					<option value="mottattDatoNyestTilEldst">Mottatt dato: nyeste til eldste</option>
				</Select>
			</div>
			<div className="flex flex-col m-auto">
				<span>Antall oppgaver: {isLoading ? <Skeleton className="inline-block w-12" /> : antallOppgaver}</span>
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
		</div>
	);
};

export default EnkelSortering;
