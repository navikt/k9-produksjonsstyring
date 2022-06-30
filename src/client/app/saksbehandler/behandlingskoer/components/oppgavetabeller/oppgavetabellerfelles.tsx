import Oppgave from 'saksbehandler/oppgaveTsType';
import React, { useEffect } from 'react';
import { punsjKodeverkNavn } from 'avdelingsleder/nokkeltall/nokkeltallUtils';
import { getKodeverkFraKode } from 'utils/kodeverkUtils';
import kodeverkTyper from 'kodeverk/kodeverkTyper';
import AlleKodeverk from 'kodeverk/alleKodeverkTsType';
import { useGlobalStateRestApiData } from 'api/rest-api-hooks';
import { RestApiGlobalStatePathsKeys } from 'api/k9LosApi';

export const getHeaderCodes = (medReservasjoner?: boolean, erHastesaker?: boolean) => [
  erHastesaker ? 'EMPTY_1' : undefined,
  'OppgaverTabell.Soker',
  'OppgaverTabell.Id',
  'OppgaverTabell.Behandlingstype',
  'OppgaverTabell.BehandlingOpprettet',
  medReservasjoner ? 'OppgaverTabell.Reservasjon' : 'EMPTY_3',
  'EMPTY_2',
];

export const hentIDFraSak = (oppgave: Oppgave, alleKodeverk): string => {
  if (
    typeof oppgave.behandlingstype !== 'undefined' &&
    getKodeverkFraKode(oppgave.behandlingstype, kodeverkTyper.BEHANDLING_TYPE, alleKodeverk) === punsjKodeverkNavn &&
    oppgave.journalpostId
  ) {
    return oppgave.journalpostId;
  }

  if (oppgave.saksnummer) {
    return oppgave.saksnummer;
  }
  return '';
};
