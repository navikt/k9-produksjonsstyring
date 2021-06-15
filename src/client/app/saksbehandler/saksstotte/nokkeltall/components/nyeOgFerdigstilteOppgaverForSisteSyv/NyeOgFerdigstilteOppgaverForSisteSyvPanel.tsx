import React, { FunctionComponent, useMemo, useState } from 'react';
import moment from 'moment';
import { FormattedMessage } from 'react-intl';
import { Element } from 'nav-frontend-typografi';

import { ISO_DATE_FORMAT } from 'utils/formats';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import fagsakYtelseType from 'kodeverk/fagsakYtelseType';
import { slaSammenLikeFagsakstyperOgDatoer } from 'avdelingsleder/nokkeltall/nokkeltallUtils';
import fagytelsetyperForOppgaveFiltrering
  from 'saksbehandler/saksstotte/nokkeltall/components/nyeOgFerdigstilteOppgaverForSisteSyv/nyeOgFerdigstileOppgaverType';
import styles
  from 'saksbehandler/saksstotte/nokkeltall/components/nyeOgFerdigstilteOppgaverForSisteSyv/nyeOgFerdigstilteOppgaverForSisteSyvGraf.less';
import { Select } from 'nav-frontend-skjema';
import NyeOgFerdigstilteOppgaverForSisteSyvGraf from './NyeOgFerdigstilteOppgaverForSisteSyvGraf';
import NyeOgFerdigstilteOppgaver from '../nyeOgFerdigstilteOppgaverTsType';

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

  const omsorgspengerFerdigstilteOppgaver = filtrertenyeOgFerdigstilteOppgaverSisteSyv.filter(
    (oppgave) => oppgave.fagsakYtelseType.kode === fagsakYtelseType.OMSORGSPENGER,
  );
  const pleiepengerFerdigstilteOppgaver = filtrertenyeOgFerdigstilteOppgaverSisteSyv.filter(
    (oppgave) => oppgave.fagsakYtelseType.kode === fagsakYtelseType.PLEIEPENGER_SYKT_BARN,
  );

  const samlet = slaSammenLikeFagsakstyperOgDatoer(filtrertenyeOgFerdigstilteOppgaverSisteSyv);

  const hentOppgaver = () => {
    switch (selectValue) {
      case fagytelsetyperForOppgaveFiltrering.OMSORGSPENGER: return omsorgspengerFerdigstilteOppgaver;
      case fagytelsetyperForOppgaveFiltrering.PLEIEPENGER_SYKT_BARN: return pleiepengerFerdigstilteOppgaver;
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
          aria-label="Velg ytelsetype"
          onChange={(e) => setSelectValue(e.target.value)}
        >
          <option value="" disabled selected>Velg ytelsetype </option>
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
