import Kodeverk from 'kodeverk/kodeverkTsType';

interface IPaaVentResponse {
  påVent: IBehandlingerSomGarAvVentType[];
  påVentMedVenteårsak: IBehandlingerSomGarAvVentType[];
}
interface IBehandlingerSomGarAvVentType {
  fagsakYtelseType: Kodeverk;
  behandlingType: Kodeverk;
  dato: string;
  antall: number;
  venteårsak?: {
    kode: string;
    navn: string;
  };
  frist?: string;
}

export { IPaaVentResponse, IBehandlingerSomGarAvVentType };
