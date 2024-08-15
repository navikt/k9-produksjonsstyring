/* eslint-disable camelcase */

/* eslint-disable react/jsx-pascal-case */
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { BodyLong, Button, Checkbox, Label, UNSAFE_Combobox } from '@navikt/ds-react';
import AppContext from 'app/AppContext';
import { FilterContext } from 'filter/FilterContext';
import { FeltverdiOppgavefilter, OppgaveQuery, Oppgavefelt, OppgavefilterKode } from 'filter/filterTsTypes';
import { removeFilter, updateFilter } from 'filter/queryUtils';
import { feltverdiKey, kodeFraKey } from 'filter/utils';

interface Props {
	oppgavefilter: FeltverdiOppgavefilter;
	addGruppeOperation: (model: OppgaveQuery) => OppgaveQuery;
	køvisning: boolean;
	paakrevdeKoder: OppgavefilterKode[];
}

const VelgKriterie = ({ oppgavefilter, addGruppeOperation, køvisning, paakrevdeKoder = [] }: Props) => {
	const { updateQuery } = useContext(FilterContext);
	const { felter } = useContext(AppContext);
	const [valgtKriterie, setValgtKriterie] = useState<Oppgavefelt | string>();
	const [fritekst, setFritekst] = useState('');
	const [visAvanserteValg, setVisAvanserteValg] = useState('nei');

	const kriterierSomKanVelges = paakrevdeKoder.length
		? felter.filter((kriterie) => paakrevdeKoder.some((v) => v !== kriterie.kode))
		: felter;
	const toggleAvanserteValg = () => {
		setVisAvanserteValg((prevState) => (prevState === 'nei' ? 'ja' : 'nei'));
	};
	const handleSelect = (value: string) => {
		if (value === '__gruppe') {
			setValgtKriterie(value);
			return;
		}
		const kode = kodeFraKey(value);
		const kriterie = kriterierSomKanVelges.find((k) => k.kode === kode);
		setValgtKriterie(kriterie);
	};

	const leggTil = (kriterie: Oppgavefelt | string) => {
		if (!kriterie) {
			return;
		}

		if (typeof kriterie === 'string') {
			if (kriterie === '__gruppe') {
				const operations = [removeFilter(oppgavefilter.id), addGruppeOperation];
				updateQuery(operations);
				return;
			}
			return;
		}

		const { område, kode } = kriterie;

		const updateData = { område, kode, verdi: undefined };
		updateQuery([updateFilter(oppgavefilter.id, updateData)]);
	};

	useEffect(() => {
		setValgtKriterie('');
	}, [visAvanserteValg]);

	const options = useMemo(() => {
		const optionsMappet = kriterierSomKanVelges
			.filter((v) => {
				if (køvisning) {
					if (visAvanserteValg === 'ja') {
						return true;
					}
					return v.kokriterie;
				}

				return true;
			})
			.map((v) => ({ label: v.visningsnavn, value: feltverdiKey(v) }));

		return [{ label: 'Gruppe', value: '__gruppe' }, ...optionsMappet];
	}, [kriterierSomKanVelges, visAvanserteValg, køvisning]);
	return (
		<div className="flex gap-7 border-dashed border-[1px] border-surface-action rounded-sm pt-4 pr-7 pb-5 pl-4">
			<div className="basis-5/12">
				<UNSAFE_Combobox
					label="Velg kriterie:"
					size="small"
					value={fritekst}
					onChange={setFritekst}
					onToggleSelected={handleSelect}
					options={options}
				/>
				{køvisning && (
					<Checkbox value="ja" size="small" onClick={toggleAvanserteValg}>
						Avanserte valg
					</Checkbox>
				)}
				<div className="flex gap-4 mt-4">
					<Button variant="primary" size="small" onClick={() => leggTil(valgtKriterie)}>
						Legg til
					</Button>
					<Button variant="secondary" size="small" onClick={() => updateQuery([removeFilter(oppgavefilter.id)])}>
						Avbryt
					</Button>
				</div>
			</div>
			<div className="mt-[-0.125rem]">
				<Label size="small">Beskrivelse:</Label>
				<BodyLong className="mt-1" size="small">
					Her vil det komme en beskrivelse for hva dette kriteriet er
				</BodyLong>
			</div>
		</div>
	);
};

export default VelgKriterie;
