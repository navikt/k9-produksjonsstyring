import { Kodeverk } from 'kodeverk/kodeverkTsType';

type FerdigstilteOppgaver = Readonly<{
    behandlingType: Kodeverk;
    ferdigstilteIdag: number;
    ferdigstilteSyvDager: number;
}>

export default FerdigstilteOppgaver;
