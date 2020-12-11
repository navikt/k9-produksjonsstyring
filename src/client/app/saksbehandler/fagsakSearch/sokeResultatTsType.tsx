import Oppgave from 'saksbehandler/fagsakSearch/fagsakTsType';
import Person from 'saksbehandler/fagsakSearch/personTsType';

export type SokeResultat = Readonly<{
    ikkeTilgang: boolean;
    oppgaver: Oppgave[];
    person: Person;
}>;
