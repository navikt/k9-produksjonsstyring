import OppgaveQueryModel from 'filter/OppgaveQueryModel';
import { OppgaveQuery, OppgavefilterKode } from 'filter/filterTsTypes';
import { OPERATORS } from 'filter/utils';

export const initialKøQuery = () => {
	// TODO: disse må settes med verdier fra backend apiPaths.hentOppgaveFelter for å få riktig område.
	const query = new OppgaveQueryModel();
	const { id } = query.toOppgaveQuery();

	const initialQuery = query
		.addEnkelOrderFelt({ kode: OppgavefilterKode.MottattDato, økende: true })
		.addFilter(id, { kode: OppgavefilterKode.Oppgavestatus, verdi: ['AAPEN'], operator: OPERATORS.IN })
		.addFilter(id, { kode: OppgavefilterKode.Ytelsestype, verdi: undefined })
		.addFilter(id, { kode: OppgavefilterKode.Totrinnskontroll, verdi: undefined })
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
