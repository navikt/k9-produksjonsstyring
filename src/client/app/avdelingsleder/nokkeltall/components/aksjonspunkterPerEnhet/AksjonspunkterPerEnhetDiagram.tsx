import React from 'react';

import { punsjKodeverkNavn } from 'avdelingsleder/nokkeltall/nokkeltallUtils';
import fagsakYtelseType from 'kodeverk/fagsakYtelseType';
import Stolpediagram from 'avdelingsleder/Stolpediagram';
import HistoriskData from 'avdelingsleder/nokkeltall/historiskDataTsType';
import { fargerForLegendsForAksjonspunkterPerEnhet } from 'styles/echartStyle';

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
  const PSBBehandlinger: HistoriskData[] = aksjonspunkterPerEnhet.filter(
    behandling =>
      behandling.fagsakYtelseType.kode === fagsakYtelseType.PLEIEPENGER_SYKT_BARN &&
      behandling.behandlingType.kodeverk !== punsjKodeverkNavn,
  );

  const OMPBehandlinger: HistoriskData[] = aksjonspunkterPerEnhet.filter(
    behandling =>
      behandling.fagsakYtelseType.kode === fagsakYtelseType.OMSORGSPENGER &&
      behandling.behandlingType.kodeverk !== punsjKodeverkNavn,
  );

  const OMDBehandlinger: HistoriskData[] = aksjonspunkterPerEnhet.filter(
    behandling =>
      (behandling.fagsakYtelseType.kode === fagsakYtelseType.OMSORGSDAGER ||
        behandling.fagsakYtelseType.kode === fagsakYtelseType.OMSORGSDAGER_KRONISKSYK ||
        behandling.fagsakYtelseType.kode === fagsakYtelseType.OMSORGSDAGER_ALENEOMOMSORGEN ||
        behandling.fagsakYtelseType.kode === fagsakYtelseType.OMSORGSDAGER_MIDLERTIDIGALENE) &&
      behandling.behandlingType.kodeverk !== punsjKodeverkNavn,
  );

  const PunsjBehandlinger: HistoriskData[] = aksjonspunkterPerEnhet.filter(
    behandling => behandling.behandlingType.kodeverk === punsjKodeverkNavn,
  );

  const AlleBehandlingerUtomPunsj: HistoriskData[] = aksjonspunkterPerEnhet.filter(
    behandling => behandling.behandlingType.kodeverk !== punsjKodeverkNavn,
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
