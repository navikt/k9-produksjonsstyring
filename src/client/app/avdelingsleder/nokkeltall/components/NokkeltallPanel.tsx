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
import behandlingerSomGårAvVent from '../../../../mocks/behandlingerSomGårAvVent';
import alleOppgaverMock from '../../../../mocks/alleOppgaverMock';

interface OwnProps {
    alleOppgaver: AlleOppgaver[];
    ferdigstiltePerDato: HistoriskData[];
    behandlingerSomGårAvVentt: IBehandlingerSomGarAvVentType[];
    beholdningPerDato?: HistoriskData[];
}

/**
 * NokkeltallPanel.
 */
const NokkeltallPanel: FunctionComponent<OwnProps> = ({
  alleOppgaver,
  ferdigstiltePerDato,
  behandlingerSomGårAvVentt,
  beholdningPerDato,
}) => (
  <div>
    <InngangOgFerdigstiltePanel
      getValueFromLocalStorage={getValueFromLocalStorage}
    />
    <VerticalSpacer twentyPx />
    <NyeHistorikkPanel
      nyePerDato={ferdigstilteHistorikk}
      getValueFromLocalStorage={getValueFromLocalStorage}
    />
    <VerticalSpacer twentyPx />
    <FerdigstilteHistorikkPanel
      ferdigstiltePerDato={ferdigstilteHistorikk}
      getValueFromLocalStorage={getValueFromLocalStorage}
    />
    <VerticalSpacer twentyPx />
    <BeholdningHistorikkPanel
      beholdningPerDato={ferdigstilteHistorikk}
      getValueFromLocalStorage={getValueFromLocalStorage}
    />
    <VerticalSpacer twentyPx />
    <FordelingAvBehandlingstypePanel
      alleOppgaver={alleOppgaverMock}
      getValueFromLocalStorage={getValueFromLocalStorage}
    />
    <VerticalSpacer twentyPx />
    <BehandlingerGårAvVent
      behandlingerSomGårAvVent={behandlingerSomGårAvVent}
    />
  </div>
);

export default NokkeltallPanel;
