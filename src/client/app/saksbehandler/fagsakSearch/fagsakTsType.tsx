import Kodeverk from 'kodeverk/kodeverkTsType';
import Person from './personTsType';

type Fagsak = Readonly<{
    saksnummer: string;
    sakstype: Kodeverk;
    person: Person;
    behandlingStatus?: Kodeverk;
    opprettet: string;
    fagsystem: Kodeverk;
    aktiv: boolean;
}>;

export default Fagsak;
