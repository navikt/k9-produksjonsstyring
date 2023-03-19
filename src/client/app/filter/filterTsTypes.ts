/* export type Oppgave = Readonly<{
  id: number;
}>; */

export type Oppgavefilter = {
    type: string;
};

export type FeltverdiOppgavefilter = Oppgavefilter & {
    område: string;
    kode: string;
    operator: string;
    verdi: object;
};

export type CombineOppgavefilter = Oppgavefilter &
    FilterContainer & {
        combineOperator: string;
    };

export type FilterContainer = {
    filtere: Oppgavefilter[];
};

export type OppgaveQuery = FilterContainer & {
    select: SelectFelt[];
    order: OrderFelt[];
    limit: number;
};

export type OrderFelt = {
    type: string;
};

export type EnkelOrderFelt = OrderFelt & {
    område: string;
    kode: string;
    økende: boolean;
};

export type SelectFelt = {
    type: string;
};

export type EnkelSelectFelt = SelectFelt & {
    område: string;
    kode: string;
};

export type Oppgavefeltverdi = {
    område: string;
    kode: string;
    verdi: object;
};

export type Oppgaverad = {
    felter: Oppgavefeltverdi[];
};

export type Oppgavefelt = {
    område: string;
    kode: string;
    visningsnavn: string;
    tolkes_som: string;
};
