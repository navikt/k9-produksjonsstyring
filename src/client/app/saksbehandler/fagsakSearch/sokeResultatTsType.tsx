import { Fagsak } from 'saksbehandler/fagsakSearch/fagsakTsType';

export type SokeResultat = Readonly<{
    ikkeTilgang: boolean;
    fagsaker: Fagsak[]
}>;
