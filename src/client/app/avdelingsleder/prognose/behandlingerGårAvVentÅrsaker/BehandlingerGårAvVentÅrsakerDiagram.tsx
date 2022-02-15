import React from 'react';

import { punsjKodeverkNavn } from 'avdelingsleder/nokkeltall/nokkeltallUtils';
import fagsakYtelseType from 'kodeverk/fagsakYtelseType';
import Stolpediagram from 'avdelingsleder/Stolpediagram';
import { IBehandlingerSomGarAvVentType } from '../behandlingerGårAvVent/behandlingerSomGårAvVentType';

interface OwnProps {
  behandlingerGaarAvVentAarsaker: IBehandlingerSomGarAvVentType[];
  valgtYtelseType: string;
  antallUkerSomSkalVises: string;
}

const BehandlingerGårAvVentÅrsakerDiagram = ({
  behandlingerGaarAvVentAarsaker,
  valgtYtelseType,
  antallUkerSomSkalVises,
}: OwnProps) => {
  const PSBBehandlinger: IBehandlingerSomGarAvVentType[] = behandlingerGaarAvVentAarsaker.filter(
    behandling =>
      behandling.fagsakYtelseType.kode === fagsakYtelseType.PLEIEPENGER_SYKT_BARN &&
      behandling.behandlingType.kodeverk !== punsjKodeverkNavn,
  );

  const OMPBehandlinger: IBehandlingerSomGarAvVentType[] = behandlingerGaarAvVentAarsaker.filter(
    behandling =>
      behandling.fagsakYtelseType.kode === fagsakYtelseType.OMSORGSPENGER &&
      behandling.behandlingType.kodeverk !== punsjKodeverkNavn,
  );

  const OMDBehandlinger: IBehandlingerSomGarAvVentType[] = behandlingerGaarAvVentAarsaker.filter(
    behandling =>
      (behandling.fagsakYtelseType.kode === fagsakYtelseType.OMSORGSDAGER ||
        behandling.fagsakYtelseType.kode === fagsakYtelseType.OMSORGSDAGER_KRONISKSYK ||
        behandling.fagsakYtelseType.kode === fagsakYtelseType.OMSORGSDAGER_ALENEOMOMSORGEN ||
        behandling.fagsakYtelseType.kode === fagsakYtelseType.OMSORGSDAGER_MIDLERTIDIGALENE) &&
      behandling.behandlingType.kodeverk !== punsjKodeverkNavn,
  );

  const PunsjBehandlinger: IBehandlingerSomGarAvVentType[] = behandlingerGaarAvVentAarsaker.filter(
    behandling => behandling.behandlingType.kodeverk === punsjKodeverkNavn,
  );

  const AlleBehandlingerUtomPunsj: IBehandlingerSomGarAvVentType[] = behandlingerGaarAvVentAarsaker.filter(
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

  const behandlinger = hentBehandlingerKnyttetTilYtelseType().map(behandling => ({
    ...behandling,
    dato: behandling.frist,
  }));
  const venteårsaker = [...new Set(behandlinger.map(behandling => behandling.venteårsak))];
  const series = venteårsaker.map(venteårsak => ({
    name: venteårsak,
    type: 'bar',
    data: behandlinger.filter(behandling => behandling.venteårsak === venteårsak),
  }));
  const totalt = { name: 'Totalt', type: 'bar', data: behandlinger };

  const alleSeries = [totalt, ...series];
  const labels = ['Totalt', ...venteårsaker];

  return <Stolpediagram series={alleSeries} uker={antallUkerSomSkalVises} labels={labels} fremITid />;
};

export default BehandlingerGårAvVentÅrsakerDiagram;
