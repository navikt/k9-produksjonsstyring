import OppgaveQueryModel from 'filter/OppgaveQueryModel';
import { OppgaveQuery, Oppgavefelt, OppgavefilterKode } from 'filter/filterTsTypes';
import { OPERATORS } from 'filter/utils';

// OBS OBS Backend skal være ansvarlig for å lage initialQuery. Så når backend har det på plass kan denne koden fjernes.
export const initialKøQuery = (felter: Oppgavefelt[]) => {
	const query = new OppgaveQueryModel();
	const { id } = query.toOppgaveQuery();

	const initialQueryFilterKoder = [
		OppgavefilterKode.MottattDato,
		OppgavefilterKode.Oppgavestatus,
		OppgavefilterKode.Ytelsestype,
		OppgavefilterKode.Totrinnskontroll,
	];

	// filtrerer på de feltene vi trenger i initialQuery. Mapper om til kode og område
	const feltDefinisjoner = felter
		.filter((felt) => initialQueryFilterKoder.includes(felt.kode))
		.reduce(
			(definisjoner, { kode, område }) => ({
				...definisjoner,
				[kode]: { kode, område },
			}),
			{},
		);

	const initialQuery = query
		.addEnkelOrderFelt({ ...feltDefinisjoner[OppgavefilterKode.MottattDato], økende: true })
		.addFilter(id, { ...feltDefinisjoner[OppgavefilterKode.Oppgavestatus], verdi: ['AAPEN'], operator: OPERATORS.IN })
		// .addFilter(id, { ...feltDefinisjoner[OppgavefilterKode.Ytelsestype], verdi: undefined })
		// .addFilter(id, { ...feltDefinisjoner[OppgavefilterKode.Totrinnskontroll], verdi: undefined })
		.toOppgaveQuery();
	return initialQuery;
};

export const oppgaveQueryErTomt = (query: OppgaveQuery) => {
	if (query.filtere.length === 0) {
		if (query.order.length === 0) {
			if (query.select.length === 0) {
				return true;
			}
		}
	}

	return false;
};
