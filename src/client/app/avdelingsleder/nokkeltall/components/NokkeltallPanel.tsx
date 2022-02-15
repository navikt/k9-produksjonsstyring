import React, { FunctionComponent } from 'react';

import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import InngangOgFerdigstiltePanel from 'avdelingsleder/nokkeltall/components/dagensTallPanel/InngangOgFerdigstiltePanel';
import BeholdningHistorikkPanel from 'avdelingsleder/nokkeltall/components/beholdningHistorikk/BeholdningHistorikkPanel';
import FerdigstilteHistorikkPanel from 'avdelingsleder/nokkeltall/components/ferdigstilteHistorikk/FerdigstilteHistorikkPanel';
import NyeHistorikkPanel from 'avdelingsleder/nokkeltall/components/nyeHistorikk/NyeHistorikkPanel';
import HistoriskData from 'avdelingsleder/nokkeltall/historiskDataTsType';
import AlleOppgaver from 'avdelingsleder/nokkeltall/components/fordelingAvBehandlingstype/alleOppgaverTsType';
import FordelingAvBehandlingstypePanel from './fordelingAvBehandlingstype/FordelingAvBehandlingstypePanel';
import AksjonspunkterPerEnhetPanel from './aksjonspunkterPerEnhet/AksjonspunkterPerEnhetPanel';
import featureToggles from '../../../featureToggles';

interface OwnProps {
  alleOppgaver: AlleOppgaver[];
  ferdigstiltePerDato: HistoriskData[];
  beholdningPerDato?: HistoriskData[];
  nyePerDato?: HistoriskData[];
}
const NokkeltallPanel: FunctionComponent<OwnProps> = ({
  alleOppgaver,
  ferdigstiltePerDato,
  beholdningPerDato,
  nyePerDato,
}) => (
  <div>
    <InngangOgFerdigstiltePanel />
    <VerticalSpacer twentyPx />
    <NyeHistorikkPanel nyePerDato={nyePerDato} />
    <VerticalSpacer twentyPx />
    <FerdigstilteHistorikkPanel ferdigstiltePerDato={ferdigstiltePerDato} />
    <VerticalSpacer twentyPx />
    <BeholdningHistorikkPanel beholdningPerDato={beholdningPerDato} />
    <VerticalSpacer twentyPx />
    <FordelingAvBehandlingstypePanel alleOppgaver={alleOppgaver} />
  </div>
);

export default NokkeltallPanel;
