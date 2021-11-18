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
import BehandlingerGårAvVent from 'avdelingsleder/nokkeltall/components/behandlingerGårAvVent/BehandlingerGårAvVent';
import IBehandlingerSomGarAvVentType
  from 'avdelingsleder/nokkeltall/components/behandlingerGårAvVent/behandlingerSomGårAvVentType';
import FordelingAvBehandlingstypePanel from './fordelingAvBehandlingstype/FordelingAvBehandlingstypePanel';
import ferdigstilteHistorikk from '../../../../mocks/ferdigstilteHistorikk';

interface OwnProps {
    alleOppgaver: AlleOppgaver[];
    ferdigstiltePerDatoo: HistoriskData[];
    behandlingerSomGårAvVent: IBehandlingerSomGarAvVentType[];
    beholdningPerDato?: HistoriskData[];
    nyePerDato?: HistoriskData[];
}

/**
 * NokkeltallPanel.
 */
const NokkeltallPanel: FunctionComponent<OwnProps> = ({
  alleOppgaver,
  ferdigstiltePerDatoo,
  behandlingerSomGårAvVent,
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
      ferdigstiltePerDato={ferdigstilteHistorikk}
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
    <VerticalSpacer twentyPx />
    <BehandlingerGårAvVent
      behandlingerSomGårAvVent={behandlingerSomGårAvVent}
    />
  </div>
);

export default NokkeltallPanel;
