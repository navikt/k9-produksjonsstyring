import Oppgave from 'saksbehandler/oppgaveTsType';
import Person from 'saksbehandler/fagsakSearch/personTsType';

export type SokeResultat = Readonly<{
    ikkeTilgang: boolean;
    oppgaver: Oppgave[];
    person: Person;
}>;
