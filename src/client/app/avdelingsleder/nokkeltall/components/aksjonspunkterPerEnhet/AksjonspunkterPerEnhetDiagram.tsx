import React from 'react';

import { punsjKodeverkNavn } from 'avdelingsleder/nokkeltall/nokkeltallUtils';
import fagsakYtelseType from 'kodeverk/fagsakYtelseType';
import Stolpediagram from 'avdelingsleder/Stolpediagram';
import AksjonspunkterPerEnhetType from 'avdelingsleder/nokkeltall/AksjonspunkterPerEnhetType';
import { fargerForLegendsForAksjonspunkterPerEnhet } from 'styles/echartStyle';

interface OwnProps {
  aksjonspunkterPerEnhet: AksjonspunkterPerEnhetType[];
  valgtYtelseType: string;
  antallUkerSomSkalVises: string;
}

const AksjonspunkterPerEnhetDiagram = ({
  aksjonspunkterPerEnhet,
  valgtYtelseType,
  antallUkerSomSkalVises,
}: OwnProps) => {
  const PSBBehandlinger: AksjonspunkterPerEnhetType[] = aksjonspunkterPerEnhet.filter(
    behandling =>
      behandling.fagsakYtelseType === fagsakYtelseType.PLEIEPENGER_SYKT_BARN &&
      behandling?.behandlingType !== punsjKodeverkNavn,
  );

  const OMPBehandlinger: AksjonspunkterPerEnhetType[] = aksjonspunkterPerEnhet.filter(
    behandling =>
      behandling.fagsakYtelseType === fagsakYtelseType.OMSORGSPENGER &&
      behandling?.behandlingType !== punsjKodeverkNavn,
  );

  const OMDBehandlinger: AksjonspunkterPerEnhetType[] = aksjonspunkterPerEnhet.filter(
    behandling =>
      (behandling.fagsakYtelseType === fagsakYtelseType.OMSORGSDAGER ||
        behandling.fagsakYtelseType === fagsakYtelseType.OMSORGSDAGER_KRONISKSYK ||
        behandling.fagsakYtelseType === fagsakYtelseType.OMSORGSDAGER_ALENEOMOMSORGEN ||
        behandling.fagsakYtelseType === fagsakYtelseType.OMSORGSDAGER_MIDLERTIDIGALENE) &&
      behandling?.behandlingType !== punsjKodeverkNavn,
  );

  const PunsjBehandlinger: AksjonspunkterPerEnhetType[] = aksjonspunkterPerEnhet.filter(
    behandling => behandling?.behandlingType === punsjKodeverkNavn,
  );

  const AlleBehandlingerUtomPunsj: AksjonspunkterPerEnhetType[] = aksjonspunkterPerEnhet.filter(
    behandling => behandling?.behandlingType !== punsjKodeverkNavn,
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
  const unikeEnheter = [...new Set(behandlinger.map(behandling => behandling.behandlendeEnhet))];
  const series = unikeEnheter.map(enhet => ({
    name: enhet,
    type: 'bar',
    data: behandlinger.filter(behandling => behandling.behandlendeEnhet === enhet),
  }));

  return (
    <Stolpediagram
      series={series}
      uker={antallUkerSomSkalVises}
      labels={unikeEnheter}
      legendColors={fargerForLegendsForAksjonspunkterPerEnhet}
    />
  );
};

export default AksjonspunkterPerEnhetDiagram;
