import React, {
  FunctionComponent,
} from 'react';

import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import InngangOgFerdigstiltePanel from 'avdelingsleder/nokkeltall/components/dagensTallPanel/InngangOgFerdigstiltePanel';
import BeholdningHistorikkPanel
  from 'avdelingsleder/nokkeltall/components/beholdningHistorikk/BeholdningHistorikkPanel';
import FerdigstilteHistorikkPanel from 'avdelingsleder/nokkeltall/components/ferdigstilteHistorikk/FerdigstilteHistorikkPanel';
import NyeHistorikkPanel from 'avdelingsleder/nokkeltall/components/nyeHistorikk/NyeHistorikkPanel';
import { getValueFromLocalStorage } from 'utils/localStorageHelper';
import HistoriskData from 'avdelingsleder/nokkeltall/historiskDataTsType';
import AlleOppgaver from 'avdelingsleder/nokkeltall/components/fordelingAvBehandlingstype/alleOppgaverTsType';
import FordelingAvBehandlingstypePanel from './fordelingAvBehandlingstype/FordelingAvBehandlingstypePanel';

interface OwnProps {
    alleOppgaver: AlleOppgaver[];
    ferdigstiltePerDato: HistoriskData[];
    beholdningPerDato?: HistoriskData[];
    nyePerDato?: HistoriskData[];
}

/**
 * NokkeltallPanel.
 */
const NokkeltallPanel: FunctionComponent<OwnProps> = ({
  alleOppgaver,
  ferdigstiltePerDato,
  beholdningPerDato,
  nyePerDato,
}) => (
  <div>
    <InngangOgFerdigstiltePanel
      getValueFromLocalStorage={getValueFromLocalStorage}
    />
    <VerticalSpacer twentyPx />
    <NyeHistorikkPanel
      nyePerDato={nyePerDato}
      getValueFromLocalStorage={getValueFromLocalStorage}
    />
    <VerticalSpacer twentyPx />
    <FerdigstilteHistorikkPanel
      ferdigstiltePerDato={ferdigstiltePerDato}
      getValueFromLocalStorage={getValueFromLocalStorage}
    />
    <VerticalSpacer twentyPx />
    <BeholdningHistorikkPanel
      beholdningPerDato={beholdningPerDato}
      getValueFromLocalStorage={getValueFromLocalStorage}
    />
    <VerticalSpacer twentyPx />
    <FordelingAvBehandlingstypePanel
      alleOppgaver={alleOppgaver}
      getValueFromLocalStorage={getValueFromLocalStorage}
    />
  </div>
);

export default NokkeltallPanel;
