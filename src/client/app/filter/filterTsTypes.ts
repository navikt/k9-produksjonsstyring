/*export type Oppgave = Readonly<{
  id: number;
}>;*/

export type Oppgavefilter = {
  type: String;
};

export type FeltverdiOppgavefilter = Oppgavefilter & {
  område: String;
  kode: String;
  operator: String;
  verdi: object;
};

export type CombineOppgavefilter = Oppgavefilter &
  FilterContainer & {
    combineOperator: String;
  };

export type FilterContainer = {
  filtere: Oppgavefilter[];
};

export type OppgaveQuery = FilterContainer & {
  select: SelectFelt[];
};

export type SelectFelt = {
  type: String;
};

export type EnkelSelectFelt = SelectFelt & {
  område: String;
  kode: String;
};

export type Oppgavefeltverdi = {
  område: String;
  kode: String;
  verdi: object;
};

export type Oppgaverad = {
  felter: Oppgavefeltverdi[];
};

export type Oppgavefelt = {
  område: String;
  kode: String;
  visningsnavn: String;
};
