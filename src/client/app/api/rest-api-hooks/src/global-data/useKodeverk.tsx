import { RestApiGlobalStatePathsKeys } from 'api/k9LosApi';

import useGlobalStateRestApiData from './useGlobalStateRestApiData';
import KodeverkMedNavn from "kodeverk/kodeverkMedNavnTsType";

/**
 * Hook som henter et gitt kodeverk fra respons som allerede er hentet fra backend. For å kunne bruke denne
 * må @see useGlobalStateRestApi først brukes for å hente data fra backend
 */
function useKodeverk<T = KodeverkMedNavn>(kodeverkType: string): T[] {
  const alleKodeverk = useGlobalStateRestApiData<{[key: string]: T[]}>(RestApiGlobalStatePathsKeys.KODEVERK);
  return alleKodeverk[kodeverkType];
}

export default useKodeverk;
