import React from 'react';

import { punsjKodeverkNavn } from 'avdelingsleder/nokkeltall/nokkeltallUtils';
import fagsakYtelseType from 'kodeverk/fagsakYtelseType';
import Stolpediagram from 'avdelingsleder/Stolpediagram';
import HistoriskData from 'avdelingsleder/nokkeltall/historiskDataTsType';
import { fargerForLegendsForAksjonspunkterPerEnhet } from 'styles/echartStyle';
import { getKodeverkFraKode } from "utils/kodeverkUtils";
import kodeverkTyper from "kodeverk/kodeverkTyper";
import AlleKodeverk from "kodeverk/alleKodeverkTsType";
import { useGlobalStateRestApiData } from "api/rest-api-hooks";
import { RestApiGlobalStatePathsKeys } from "api/k9LosApi";

interface OwnProps {
  aksjonspunkterPerEnhet: HistoriskData[];
  valgtYtelseType: string;
  antallUkerSomSkalVises: string;
}

const AksjonspunkterPerEnhetDiagram = ({
  aksjonspunkterPerEnhet,
  valgtYtelseType,
  antallUkerSomSkalVises,
}: OwnProps) => {
  const alleKodeverk: AlleKodeverk = useGlobalStateRestApiData(RestApiGlobalStatePathsKeys.KODEVERK);

  const PSBBehandlinger: HistoriskData[] = aksjonspunkterPerEnhet.filter(
    behandling =>
      behandling.fagsakYtelseType === fagsakYtelseType.PLEIEPENGER_SYKT_BARN &&
      getKodeverkFraKode(behandling.behandlingType, kodeverkTyper.BEHANDLING_TYPE, alleKodeverk) !== punsjKodeverkNavn,
  );

  const OMPBehandlinger: HistoriskData[] = aksjonspunkterPerEnhet.filter(
    behandling =>
      behandling.fagsakYtelseType === fagsakYtelseType.OMSORGSPENGER &&
      getKodeverkFraKode(behandling.behandlingType, kodeverkTyper.BEHANDLING_TYPE, alleKodeverk) !== punsjKodeverkNavn,
  );

  const OMDBehandlinger: HistoriskData[] = aksjonspunkterPerEnhet.filter(
    behandling =>
      (behandling.fagsakYtelseType === fagsakYtelseType.OMSORGSDAGER ||
        behandling.fagsakYtelseType === fagsakYtelseType.OMSORGSDAGER_KRONISKSYK ||
        behandling.fagsakYtelseType === fagsakYtelseType.OMSORGSDAGER_ALENEOMOMSORGEN ||
        behandling.fagsakYtelseType === fagsakYtelseType.OMSORGSDAGER_MIDLERTIDIGALENE) &&
      getKodeverkFraKode(behandling.behandlingType, kodeverkTyper.BEHANDLING_TYPE, alleKodeverk) !== punsjKodeverkNavn,
  );

  const PunsjBehandlinger: HistoriskData[] = aksjonspunkterPerEnhet.filter(
    behandling => getKodeverkFraKode(behandling.behandlingType, kodeverkTyper.BEHANDLING_TYPE, alleKodeverk) === punsjKodeverkNavn,
  );

  const AlleBehandlingerUtomPunsj: HistoriskData[] = aksjonspunkterPerEnhet.filter(
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
      case fagsakYtelseType.PUNSJ:
        return PunsjBehandlinger;
      default:
        return AlleBehandlingerUtomPunsj;
    }
  };

  const behandlinger = hentBehandlingerKnyttetTilYtelseType();
  const unikeEnheter = [...new Set(behandlinger.map(behandling => behandling.enhet))];
  const series = unikeEnheter.map(enhet => ({
    name: enhet,
    type: 'bar',
    data: behandlinger.filter(behandling => behandling.enhet === enhet),
  }));

  return <Stolpediagram series={series} uker={antallUkerSomSkalVises} labels={unikeEnheter} legendColors={fargerForLegendsForAksjonspunkterPerEnhet} />;
};

export default AksjonspunkterPerEnhetDiagram;
