import React, { FunctionComponent, useState } from 'react';

import { injectIntl, WrappedComponentProps } from 'react-intl';
import fagsakYtelseType from 'kodeverk/fagsakYtelseType';
import { ALLE_YTELSETYPER_VALGT, punsjKodeverkNavn, UKE_2 } from 'avdelingsleder/nokkeltall/nokkeltallUtils';
import { IBehandlingerSomGarAvVentType } from './behandlingerSomGårAvVentType';
import BehandlingerGårAvVentGraf from './BehandlingerGårAvVentGraf';
import GrafContainer from 'avdelingsleder/GrafContainer';
import { getValueFromLocalStorage } from 'utils/localStorageHelper';
import { getKodeverkFraKode } from "utils/kodeverkUtils";
import kodeverkTyper from "kodeverk/kodeverkTyper";
import { useGlobalStateRestApiData } from "api/rest-api-hooks";
import { RestApiGlobalStatePathsKeys } from "api/k9LosApi";
import AlleKodeverk from "kodeverk/alleKodeverkTsType";

interface OwnProps {
  behandlingerSomGårAvVent: IBehandlingerSomGarAvVentType[];
}

const BehandlingerGårAvVent: FunctionComponent<OwnProps & WrappedComponentProps> = ({
  intl,
  behandlingerSomGårAvVent,
}) => {
  const id = 'behandlingerSomGaarAvVent';
  const alleKodeverk: AlleKodeverk = useGlobalStateRestApiData(RestApiGlobalStatePathsKeys.KODEVERK);

  const [valgtYtelseType, setValgtYtelseType] = useState<string>(
    getValueFromLocalStorage(`${id}-ytelsestype`) || ALLE_YTELSETYPER_VALGT,
  );

  const [antallUkerSomSkalVises, setAntallUkerSomSkalVises] = useState<string>(
    getValueFromLocalStorage(`${id}-uker`) || UKE_2,
  );

  const PSBBehandlinger: IBehandlingerSomGarAvVentType[] = behandlingerSomGårAvVent.filter(
    behandling =>
      behandling.fagsakYtelseType === fagsakYtelseType.PLEIEPENGER_SYKT_BARN &&
      getKodeverkFraKode(behandling.behandlingType, kodeverkTyper.BEHANDLING_TYPE, alleKodeverk) !== punsjKodeverkNavn,
  );

  const OMPBehandlinger: IBehandlingerSomGarAvVentType[] = behandlingerSomGårAvVent.filter(
    behandling =>
      behandling.fagsakYtelseType === fagsakYtelseType.OMSORGSPENGER &&
      getKodeverkFraKode(behandling.behandlingType, kodeverkTyper.BEHANDLING_TYPE, alleKodeverk) !== punsjKodeverkNavn,
  );

  const OMDBehandlinger: IBehandlingerSomGarAvVentType[] = behandlingerSomGårAvVent.filter(
    behandling =>
      (behandling.fagsakYtelseType === fagsakYtelseType.OMSORGSDAGER ||
        behandling.fagsakYtelseType === fagsakYtelseType.OMSORGSDAGER_KRONISKSYK ||
        behandling.fagsakYtelseType === fagsakYtelseType.OMSORGSDAGER_ALENEOMOMSORGEN ||
        behandling.fagsakYtelseType === fagsakYtelseType.OMSORGSDAGER_MIDLERTIDIGALENE) &&
      getKodeverkFraKode(behandling.behandlingType, kodeverkTyper.BEHANDLING_TYPE, alleKodeverk) !== punsjKodeverkNavn,
  );

  const LivetsSluttfaseBehandlinger: IBehandlingerSomGarAvVentType[] = behandlingerSomGårAvVent.filter(
    behandling => behandling.fagsakYtelseType === fagsakYtelseType.PPN &&
      getKodeverkFraKode(behandling.behandlingType, kodeverkTyper.BEHANDLING_TYPE, alleKodeverk) !== punsjKodeverkNavn
  );

  const PunsjBehandlinger: IBehandlingerSomGarAvVentType[] = behandlingerSomGårAvVent.filter(
    behandling => getKodeverkFraKode(behandling.behandlingType, kodeverkTyper.BEHANDLING_TYPE, alleKodeverk) === punsjKodeverkNavn,
  );

  const AlleBehandlingerUtomPunsj: IBehandlingerSomGarAvVentType[] = behandlingerSomGårAvVent.filter(
    behandling => getKodeverkFraKode(behandling.behandlingType, kodeverkTyper.BEHANDLING_TYPE, alleKodeverk) !== punsjKodeverkNavn,
  );

  const hentBehandlingerKnyttetTilYtelseType = () => {
    switch (valgtYtelseType) {
      case fagsakYtelseType.PLEIEPENGER_SYKT_BARN:
        return PSBBehandlinger;
      case fagsakYtelseType.OMSORGSPENGER:
        return OMPBehandlinger;
      case fagsakYtelseType.OMSORGSDAGER:
        return OMDBehandlinger;
      case fagsakYtelseType.PPN:
        return LivetsSluttfaseBehandlinger;
      case fagsakYtelseType.PUNSJ:
        return PunsjBehandlinger;
      default:
        return AlleBehandlingerUtomPunsj;
    }
  };

  return (
    <GrafContainer
      id={id}
      valgtYtelseType={valgtYtelseType}
      antallUkerSomSkalVises={antallUkerSomSkalVises}
      setValgtYtelseType={setValgtYtelseType}
      setAntallUkerSomSkalVises={setAntallUkerSomSkalVises}
      tittel={intl.formatMessage({ id: 'BehandlingerGårAvVent.Tittel' })}
      hjelpetekst={intl.formatMessage({ id: 'BehandlingerGårAvVent.Hjelptekst' })}
      fremITid
    >
      <BehandlingerGårAvVentGraf
        behandlingerSomGårAvVent={hentBehandlingerKnyttetTilYtelseType().map(behandling => ({
          ...behandling,
          dato: behandling.frist,
        }))}
        antallUkerSomSkalVises={antallUkerSomSkalVises}
      />
    </GrafContainer>
  );
};
export default injectIntl(BehandlingerGårAvVent);
