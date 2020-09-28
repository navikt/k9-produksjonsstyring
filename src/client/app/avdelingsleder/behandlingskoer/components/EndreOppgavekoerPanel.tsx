import React, { FunctionComponent } from 'react';
import { WrappedComponentProps, injectIntl } from 'react-intl';
import { Kodeverk } from 'kodeverk/kodeverkTsType';
import KoSorteringType from 'kodeverk/KoSorteringTsType';
import GjeldendeOppgavekoerTabell from './GjeldendeOppgavekoerTabell';
import { Oppgaveko } from '../oppgavekoTsType';

interface OwnProps {
  oppgavekoer: Oppgaveko[];
  setValgtOppgavekoId: (id: string) => void;
  lagNyOppgaveko: () => void;
  fjernOppgaveko: (id: string) => void;
  lagreOppgavekoNavn: (oppgaveko: {id: string; navn: string}) => void;
  lagreOppgavekoBehandlingstype: (id: string, behandlingType: Kodeverk, isChecked: boolean) => void;
  lagreOppgavekoFagsakYtelseType: (id: string, fagsakYtelseType: string) => void;
  lagreOppgavekoAndreKriterier: (id: string, andreKriterierType: Kodeverk, isChecked: boolean, inkluder: boolean) => void;
  lagreOppgavekoSkjermet: (id: string, isChecked: boolean) => void;
  knyttSaksbehandlerTilOppgaveko: (id: string, epost: string, isChecked: boolean) => void;
  lagreOppgavekoSorteringTidsintervallDato: (oppgavekoId: string, fomDato: string, tomDato: string) => void;
  lagreOppgavekoSortering: (oppgavekoId: string, oppgavekoSorteringValg: KoSorteringType) => void;
  valgtOppgavekoId?: string;
  hentOppgavekoer: () => Oppgaveko[];
  hentAntallOppgaverForOppgaveko: (id: string) => Promise<string>;
  hentKo: (id: string) => Promise<string>;
  requestFinished: boolean;
}

/**
 * EndreOppgavekoerPanel
 */
const EndreOppgavekoerPanel: FunctionComponent<OwnProps & WrappedComponentProps> = ({
  oppgavekoer,
  setValgtOppgavekoId,
  valgtOppgavekoId,
  lagNyOppgaveko,
  fjernOppgaveko,
  lagreOppgavekoNavn,
  lagreOppgavekoBehandlingstype,
  lagreOppgavekoFagsakYtelseType,
  lagreOppgavekoAndreKriterier,
  knyttSaksbehandlerTilOppgaveko,
  hentAntallOppgaverForOppgaveko,
  lagreOppgavekoSkjermet,
  lagreOppgavekoSortering,
  lagreOppgavekoSorteringTidsintervallDato,
  hentKo, requestFinished,
}) => {
  const valgtOppgaveko = oppgavekoer.find((s) => s.id === valgtOppgavekoId);
  return (
    <GjeldendeOppgavekoerTabell
      oppgavekoer={oppgavekoer}
      hentKo={hentKo}
      requestFinished={requestFinished}
      setValgtOppgavekoId={setValgtOppgavekoId}
      valgtOppgavekoId={valgtOppgavekoId}
      lagNyOppgaveko={lagNyOppgaveko}
      fjernOppgaveko={fjernOppgaveko}
      lagreOppgavekoNavn={lagreOppgavekoNavn}
      lagreOppgavekoSortering={lagreOppgavekoSortering}
      lagreOppgavekoSorteringTidsintervallDato={lagreOppgavekoSorteringTidsintervallDato}
      lagreOppgavekoBehandlingstype={lagreOppgavekoBehandlingstype}
      lagreOppgavekoFagsakYtelseType={lagreOppgavekoFagsakYtelseType}
      lagreOppgavekoAndreKriterier={lagreOppgavekoAndreKriterier}
      knyttSaksbehandlerTilOppgaveko={knyttSaksbehandlerTilOppgaveko}
      hentAntallOppgaverForOppgaveko={hentAntallOppgaverForOppgaveko}
      lagreOppgavekoSkjermet={lagreOppgavekoSkjermet}
    />
  );
};

export default injectIntl(EndreOppgavekoerPanel);
