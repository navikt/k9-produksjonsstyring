import React, { FunctionComponent, useMemo, useState } from 'react';
import moment from 'moment';
import { FormattedMessage } from 'react-intl';
import { Element } from 'nav-frontend-typografi';

import { ISO_DATE_FORMAT } from 'utils/formats';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import fagsakYtelseType from 'kodeverk/fagsakYtelseType';
import {
  ALLE_YTELSETYPER_VALGT,
  sjekkOmOppgaveSkalLeggesTil,
  slaSammenLikeFagsakstyperOgDatoer,
} from 'avdelingsleder/nokkeltall/nokkeltallUtils';
import styles
  from 'saksbehandler/saksstotte/nokkeltall/components/nyeOgFerdigstilteOppgaverForSisteSyv/nyeOgFerdigstilteOppgaverForSisteSyvGraf.less';
import { Select } from 'nav-frontend-skjema';
import NyeOgFerdigstilteOppgaverForSisteSyvGraf from './NyeOgFerdigstilteOppgaverForSisteSyvGraf';
import NyeOgFerdigstilteOppgaver, { fagytelsetyperForOppgaveFiltrering } from '../nyeOgFerdigstilteOppgaverTsType';
import punsjBehandlingstyper from '../../../../../types/PunsjBehandlingstyper';
import omsorgsdagerYtelsetyper from '../../../../../types/OmsorgsdagerYtelsetyper';

export const getNyeOgFerdigstilteForSisteSyvDager = (nyeOgFerdigstilte: NyeOgFerdigstilteOppgaver[] = []) => {
  const iDag = moment().startOf('day');
  return nyeOgFerdigstilte.filter((oppgave) => iDag.isAfter(moment(oppgave.dato, ISO_DATE_FORMAT)));
};

interface OwnProps {
  width: number;
  height: number;
  nyeOgFerdigstilteOppgaver: NyeOgFerdigstilteOppgaver[];
}

/**
 * NyeOgFerdigstilteOppgaverForSisteSyvPanel.
 */
export const NyeOgFerdigstilteOppgaverForSisteSyvPanel: FunctionComponent<OwnProps> = ({
  width,
  height,
  nyeOgFerdigstilteOppgaver,
}) => {
  const [selectValue, setSelectValue] = useState<string>('');
  const filtrertenyeOgFerdigstilteOppgaverSisteSyv = useMemo(
    () => getNyeOgFerdigstilteForSisteSyvDager(nyeOgFerdigstilteOppgaver), [nyeOgFerdigstilteOppgaver],
  );

  const omsorgspengerFerdigstilteOppgaver = slaSammenLikeFagsakstyperOgDatoer(filtrertenyeOgFerdigstilteOppgaverSisteSyv.filter(
    (oppgave) => sjekkOmOppgaveSkalLeggesTil(fagsakYtelseType.OMSORGSPENGER, oppgave),
  ));

  const omsorgsdagerFerdigstilteOppgaver = slaSammenLikeFagsakstyperOgDatoer(filtrertenyeOgFerdigstilteOppgaverSisteSyv.filter(
    (oppgave) => sjekkOmOppgaveSkalLeggesTil(fagsakYtelseType.OMSORGSDAGER, oppgave),
  ));

  const pleiepengerFerdigstilteOppgaver = slaSammenLikeFagsakstyperOgDatoer(filtrertenyeOgFerdigstilteOppgaverSisteSyv.filter(
    (oppgave) => sjekkOmOppgaveSkalLeggesTil(fagsakYtelseType.PLEIEPENGER_SYKT_BARN, oppgave),
  ));

  const punsjFerdigstilteOppgaver = slaSammenLikeFagsakstyperOgDatoer(filtrertenyeOgFerdigstilteOppgaverSisteSyv.filter(
    (oppgave) => sjekkOmOppgaveSkalLeggesTil(fagsakYtelseType.PUNSJ, oppgave),
  ));

  const samlet = slaSammenLikeFagsakstyperOgDatoer(filtrertenyeOgFerdigstilteOppgaverSisteSyv.filter(
    (oppgave) => sjekkOmOppgaveSkalLeggesTil(ALLE_YTELSETYPER_VALGT, oppgave),
  ));

  const hentOppgaver = () => {
    switch (selectValue) {
      case fagytelsetyperForOppgaveFiltrering.OMSORGSPENGER: return omsorgspengerFerdigstilteOppgaver;
      case fagytelsetyperForOppgaveFiltrering.PLEIEPENGER_SYKT_BARN: return pleiepengerFerdigstilteOppgaver;
      case fagytelsetyperForOppgaveFiltrering.OMSORGSDAGER: return omsorgsdagerFerdigstilteOppgaver;
      case fagytelsetyperForOppgaveFiltrering.PUNSJ: return punsjFerdigstilteOppgaver;
      default: return samlet;
    }
  };

  return (
    <>
      <VerticalSpacer eightPx />
      <div className={styles.nyeOgFerdigstilteOppgaverForIdagPanel_Subtitel}>
        <Element>
          <FormattedMessage id="NyeOgFerdigstilteOppgaverForSisteSyvPanel.SisteSyv" />
        </Element>

        <Select
          value={selectValue}
          aria-label="Velg ytelse"
          onChange={(e) => setSelectValue(e.target.value)}
        >
          <option value="" disabled selected>Velg ytelse</option>
          {Object.values(fagytelsetyperForOppgaveFiltrering).map((rel) => <option key={rel} value={rel}>{rel}</option>)}
        </Select>
      </div>

      <NyeOgFerdigstilteOppgaverForSisteSyvGraf
        width={width}
        height={height}
        nyeOgFerdigstilteOppgaver={hentOppgaver()}
      />
    </>
  );
};

export default NyeOgFerdigstilteOppgaverForSisteSyvPanel;
