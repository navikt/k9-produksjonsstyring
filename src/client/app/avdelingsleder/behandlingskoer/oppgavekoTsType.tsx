import { Kodeverk } from 'kodeverk/kodeverkTsType';
import { KoSorteringType } from 'kodeverk/KoSorteringTsType';
import {Saksbehandler} from "avdelingsleder/saksbehandlere/saksbehandlerTsType";

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
  andreKriterier?: Kodeverk[];
  saksbehandlere: string[];
  antallBehandlinger: number;
}>;
