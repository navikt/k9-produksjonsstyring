import Oppgave from 'saksbehandler/oppgaveTsType';
import React from 'react';

export const getHeaderCodes = (medReservasjoner? : boolean) => [
  'OppgaverTabell.Soker',
  'OppgaverTabell.Id',
  'OppgaverTabell.Behandlingstype',
  'OppgaverTabell.BehandlingOpprettet',
  'EMPTY_1',
  medReservasjoner ? 'OppgaverTabell.Reservasjon' : 'EMPTY_2',
];

export const hentIDFraSak = (oppgave: Oppgave): string => {
  if (typeof oppgave.behandlingstype.kodeverk !== 'undefined'
    && oppgave.behandlingstype.kodeverk === 'PUNSJ_INNSENDING_TYPE'
    && oppgave.journalpostId) {
    return oppgave.journalpostId;
  }

  if (oppgave.saksnummer) {
    return oppgave.saksnummer;
  }
  return '';
};
