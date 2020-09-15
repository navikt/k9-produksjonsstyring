import { Kodeverk } from 'kodeverk/kodeverkTsType';
import KoSorteringType from 'kodeverk/KoSorteringTsType';
import { Saksbehandler } from 'avdelingsleder/bemanning/saksbehandlerTsType';

// TODO (TOR) default export feilar for yarn:coverage
// eslint-disable-next-line import/prefer-default-export
export type Oppgaveko = Readonly<{
  id: string;
  navn?: string;
  behandlingTyper?: Kodeverk[];
  fagsakYtelseTyper?: Kodeverk[];
  sistEndret: string;
  sortering?: {
    sorteringType: KoSorteringType;
    fomDato?: string;
    tomDato?: string;
  };
  skjermet: boolean;
  andreKriterier?: AnnetKriterie[];
  saksbehandlere: Saksbehandler[];
  antallBehandlinger: number;
}>;

type AnnetKriterie = Readonly<{
  andreKriterierType: Kodeverk;
  inkluder: boolean;
}>
