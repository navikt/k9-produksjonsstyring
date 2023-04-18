/* export type Oppgave = Readonly<{
  id: number;
}>; */

export type Oppgavefilter = {
	type: string;
};

export type FeltverdiOppgavefilter = Oppgavefilter & {
	id: string;
	område: string;
	kode: string;
	operator: string;
	verdi: any;
};

export type CombineOppgavefilter = Oppgavefilter &
	FilterContainer & {
		combineOperator: string;
	};

export type FilterContainer = {
	id: string;
	filtere: FeltverdiOppgavefilter[];
};

export type OppgaveQuery = FilterContainer & {
	select: EnkelSelectFelt[];
	order: EnkelOrderFelt[];
	limit: number;
};

export type OrderFelt = {
	type: string;
};

export type EnkelOrderFelt = OrderFelt & {
	id: string;
	område: string;
	kode: string;
	økende: boolean;
};

export type SelectFelt = {
	type: string;
};

export type EnkelSelectFelt = SelectFelt & {
	id: string;
	område: string;
	kode: string;
};

export type Oppgavefeltverdi = {
	område: string;
	kode: string;
	verdi: string;
};

export type Oppgaverad = {
	id?: string;
	felter: Oppgavefeltverdi[];
};

export type Oppgavefelt = {
	område: string;
	kode: string;
	visningsnavn: string;
	tolkes_som: string;
	erListetype: boolean;
};
