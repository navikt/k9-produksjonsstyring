import React, { useState } from 'react';
import { Search } from '@navikt/ds-react';

export function SøkForm(props: { loading: boolean; utførSøk: (søkeord: string) => void; nullstillSøk: () => void }) {
	const [søkeord, setSøkeord] = useState('');
	return (
		<form
			role="search"
			onSubmit={(e) => {
				e.preventDefault();
				props.utførSøk(søkeord);
			}}
		>
			<Search
				label="Søk på saksnummer, personnummer eller journalpost-id"
				variant="primary"
				hideLabel={false}
				onChange={setSøkeord}
				htmlSize={40}
				maxLength={11}
				onClear={props.nullstillSøk}
				clearButton
			>
				<Search.Button loading={props.loading}>Søk</Search.Button>
			</Search>
		</form>
	);
}
