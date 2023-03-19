import React, { FunctionComponent } from 'react';
import AksjonspunkterPerEnhetPanel from 'avdelingsleder/nokkeltall/components/aksjonspunkterPerEnhet/AksjonspunkterPerEnhetPanel';
import BeholdningHistorikkPanel from 'avdelingsleder/nokkeltall/components/beholdningHistorikk/BeholdningHistorikkPanel';
import InngangOgFerdigstiltePanel from 'avdelingsleder/nokkeltall/components/dagensTallPanel/InngangOgFerdigstiltePanel';
import FerdigstilteHistorikkPanel from 'avdelingsleder/nokkeltall/components/ferdigstilteHistorikk/FerdigstilteHistorikkPanel';
import AlleOppgaver from 'avdelingsleder/nokkeltall/components/fordelingAvBehandlingstype/alleOppgaverTsType';
import NyeHistorikkPanel from 'avdelingsleder/nokkeltall/components/nyeHistorikk/NyeHistorikkPanel';
import HistoriskData from 'avdelingsleder/nokkeltall/historiskDataTsType';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import FordelingAvBehandlingstypePanel from './fordelingAvBehandlingstype/FordelingAvBehandlingstypePanel';

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
    <VerticalSpacer twentyPx />
    <AksjonspunkterPerEnhetPanel />
  </div>
);

export default NokkeltallPanel;
