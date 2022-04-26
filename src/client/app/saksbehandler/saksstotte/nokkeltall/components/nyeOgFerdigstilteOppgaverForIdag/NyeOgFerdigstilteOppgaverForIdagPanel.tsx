import React, { FunctionComponent, useMemo, useState } from 'react';
import moment from 'moment';
import { FormattedMessage } from 'react-intl';
import { Undertittel, Element } from 'nav-frontend-typografi';

import kodeverkTyper from 'kodeverk/kodeverkTyper';
import { ISO_DATE_FORMAT } from 'utils/formats';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import useKodeverk from 'api/rest-api-hooks/src/global-data/useKodeverk';
import fagsakYtelseType from 'kodeverk/fagsakYtelseType';
import {
  ALLE_YTELSETYPER_VALGT,
  sjekkOmOppgaveSkalLeggesTil, slaSammenAllePunsjBehandlingstyperForNyeOgFerdigstilleOppgaver,
  slaSammenLikeBehandlingstyperForNyeOgFerdigstilleOppgaver,
} from 'avdelingsleder/nokkeltall/nokkeltallUtils';
import { Select } from 'nav-frontend-skjema';
import NyeOgFerdigstilteOppgaverForIdagGraf
  from 'saksbehandler/saksstotte/nokkeltall/components/nyeOgFerdigstilteOppgaverForIdag/NyeOgFerdigstilteOppgaverForIdagGraf';
import AlleKodeverk from "kodeverk/alleKodeverkTsType";
import { useGlobalStateRestApiData } from "api/rest-api-hooks";
import { RestApiGlobalStatePathsKeys } from "api/k9LosApi";
import styles from '../nyeOgFerdigstilteOppgaverFelles.less';
import NyeOgFerdigstilteOppgaver, { fagytelsetyperForOppgaveFiltrering } from '../nyeOgFerdigstilteOppgaverTsType';

export const getNyeOgFerdigstilteForIDag = (nyeOgFerdigstilte: NyeOgFerdigstilteOppgaver[] = []) => {
  const iDag = moment();
  return nyeOgFerdigstilte.filter((oppgave) => iDag.isSame(moment(oppgave.dato, ISO_DATE_FORMAT), 'day'));
};

interface OwnProps {
    nyeOgFerdigstilteOppgaver: NyeOgFerdigstilteOppgaver[];
}

/**
 * NyeOgFerdigstilteOppgaverForIdagPanel.
 */
export const NyeOgFerdigstilteOppgaverForIdagPanel: FunctionComponent<OwnProps> = ({
  nyeOgFerdigstilteOppgaver,
}) => {
  let skalPunsjVises = false;

  const [selectValue, setSelectValue] = useState<string>('');
  const behandlingTyper = useKodeverk(kodeverkTyper.BEHANDLING_TYPE);
  const alleKodeverk: AlleKodeverk = useGlobalStateRestApiData(RestApiGlobalStatePathsKeys.KODEVERK);

  const nyeOgFerdigstilteOppgaverForIdag = useMemo(() => getNyeOgFerdigstilteForIDag(nyeOgFerdigstilteOppgaver), [nyeOgFerdigstilteOppgaver]);
  const omsorgspengerFerdigstilteOppgaver = slaSammenLikeBehandlingstyperForNyeOgFerdigstilleOppgaver(nyeOgFerdigstilteOppgaverForIdag.filter(
    (oppgave) => sjekkOmOppgaveSkalLeggesTil(fagsakYtelseType.OMSORGSPENGER, oppgave),
  ));

  const omsorgsdagerFerdigstilteOppgaver = slaSammenLikeBehandlingstyperForNyeOgFerdigstilleOppgaver(nyeOgFerdigstilteOppgaverForIdag.filter(
    (oppgave) => sjekkOmOppgaveSkalLeggesTil(fagsakYtelseType.OMSORGSDAGER, oppgave),
  ));

  const pleiepengerFerdigstilteOppgaver = slaSammenLikeBehandlingstyperForNyeOgFerdigstilleOppgaver(nyeOgFerdigstilteOppgaverForIdag.filter(
    (oppgave) => sjekkOmOppgaveSkalLeggesTil(fagsakYtelseType.PLEIEPENGER_SYKT_BARN, oppgave),
  ));

  const livetSluttfaseFerdigstilteOppgaver = slaSammenLikeBehandlingstyperForNyeOgFerdigstilleOppgaver(nyeOgFerdigstilteOppgaverForIdag.filter(
    (oppgave) => sjekkOmOppgaveSkalLeggesTil(fagsakYtelseType.PPN, oppgave),
  ));

  const punsjFerdigstilteOppgaver = slaSammenAllePunsjBehandlingstyperForNyeOgFerdigstilleOppgaver(nyeOgFerdigstilteOppgaverForIdag.filter(
    (oppgave) => sjekkOmOppgaveSkalLeggesTil(fagsakYtelseType.PUNSJ, oppgave)),
    alleKodeverk);

  const samlet = slaSammenLikeBehandlingstyperForNyeOgFerdigstilleOppgaver(nyeOgFerdigstilteOppgaverForIdag.filter(
    (oppgave) => sjekkOmOppgaveSkalLeggesTil(ALLE_YTELSETYPER_VALGT, oppgave),
  ));

  const hentOppgave = () => {
    skalPunsjVises = false;
    switch (selectValue) {
      case fagytelsetyperForOppgaveFiltrering.OMSORGSPENGER: return omsorgspengerFerdigstilteOppgaver;
      case fagytelsetyperForOppgaveFiltrering.PLEIEPENGER_SYKT_BARN: return pleiepengerFerdigstilteOppgaver;
      case fagytelsetyperForOppgaveFiltrering.OMSORGSDAGER: return omsorgsdagerFerdigstilteOppgaver;
      case fagytelsetyperForOppgaveFiltrering.PPN: return livetSluttfaseFerdigstilteOppgaver;
      case fagytelsetyperForOppgaveFiltrering.PUNSJ: { skalPunsjVises = true; return punsjFerdigstilteOppgaver; }
      default: return samlet;
    }
  };

  return (
    <>
      <Undertittel>
        <FormattedMessage id="NyeOgFerdigstilteOppgaverForIdagPanel.NyeOgFerdigstilte" />
      </Undertittel>
      <VerticalSpacer eightPx />
      <div className={styles.nyeOgFerdigstilteOppgaverForIdagPanel_Subtitel}>
        <Element>
          <FormattedMessage id="NyeOgFerdigstilteOppgaverForIdagPanel.IDag" />
        </Element>

        <Select
          value={selectValue}
          aria-label="Velg ytelse"
          onChange={(e) => setSelectValue(e.target.value)}
        >
          <option value="" disabled defaultValue={ALLE_YTELSETYPER_VALGT}>Velg ytelse</option>
          {Object.values(fagytelsetyperForOppgaveFiltrering).map((rel) => <option key={rel} value={rel}>{rel}</option>)}
        </Select>
      </div>

      <NyeOgFerdigstilteOppgaverForIdagGraf
        nyeOgFerdigstilteOppgaver={hentOppgave()}
        behandlingTyper={behandlingTyper}
        skalPunsjbehandlingerVises={skalPunsjVises}
      />
    </>
  );
};

export default NyeOgFerdigstilteOppgaverForIdagPanel;
