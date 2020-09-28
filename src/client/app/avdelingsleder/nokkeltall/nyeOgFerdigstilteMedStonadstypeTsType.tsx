import { Kodeverk } from 'kodeverk/kodeverkTsType';

type NyeOgFerdigstilteMedStonadstype = Readonly<{
    behandlingType: Kodeverk;
    fagsakYtelseType: Kodeverk;
    nye: string[];
    ferdigstilte: string[];
    dato: string;
}>

export default NyeOgFerdigstilteMedStonadstype;
