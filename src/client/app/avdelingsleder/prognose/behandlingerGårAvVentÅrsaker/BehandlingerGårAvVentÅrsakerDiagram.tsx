import React from 'react';
import { fargeForTotalt, fargerForLegendsForBehandlingerPåVentÅrsaker } from 'styles/echartStyle';
import { RestApiGlobalStatePathsKeys } from 'api/k9LosApi';
import { useGlobalStateRestApiData } from 'api/rest-api-hooks';
import Stolpediagram from 'avdelingsleder/Stolpediagram';
import { punsjKodeverkNavn } from 'avdelingsleder/nokkeltall/nokkeltallUtils';
import AlleKodeverk from 'kodeverk/alleKodeverkTsType';
import fagsakYtelseType from 'kodeverk/fagsakYtelseType';
import kodeverkTyper from 'kodeverk/kodeverkTyper';
import { getKodeverkFraKode, getKodeverknavnFraKode } from 'utils/kodeverkUtils';
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
    const alleKodeverk: AlleKodeverk = useGlobalStateRestApiData(RestApiGlobalStatePathsKeys.KODEVERK);

    const PSBBehandlinger: IBehandlingerSomGarAvVentType[] = behandlingerGaarAvVentAarsaker.filter(
        (behandling) =>
            behandling.fagsakYtelseType === fagsakYtelseType.PLEIEPENGER_SYKT_BARN &&
            getKodeverkFraKode(behandling.behandlingType, kodeverkTyper.BEHANDLING_TYPE, alleKodeverk) !==
                punsjKodeverkNavn,
    );

    const OMPBehandlinger: IBehandlingerSomGarAvVentType[] = behandlingerGaarAvVentAarsaker.filter(
        (behandling) =>
            behandling.fagsakYtelseType === fagsakYtelseType.OMSORGSPENGER &&
            getKodeverkFraKode(behandling.behandlingType, kodeverkTyper.BEHANDLING_TYPE, alleKodeverk) !==
                punsjKodeverkNavn,
    );

    const LivetsSluttfaseBehandlinger: IBehandlingerSomGarAvVentType[] = behandlingerGaarAvVentAarsaker.filter(
        (behandling) =>
            behandling.fagsakYtelseType === fagsakYtelseType.PPN &&
            getKodeverkFraKode(behandling.behandlingType, kodeverkTyper.BEHANDLING_TYPE, alleKodeverk) !==
                punsjKodeverkNavn,
    );

    const OMDBehandlinger: IBehandlingerSomGarAvVentType[] = behandlingerGaarAvVentAarsaker.filter(
        (behandling) =>
            (behandling.fagsakYtelseType === fagsakYtelseType.OMSORGSDAGER ||
                behandling.fagsakYtelseType === fagsakYtelseType.OMSORGSDAGER_KRONISKSYK ||
                behandling.fagsakYtelseType === fagsakYtelseType.OMSORGSDAGER_ALENEOMOMSORGEN ||
                behandling.fagsakYtelseType === fagsakYtelseType.OMSORGSDAGER_MIDLERTIDIGALENE) &&
            getKodeverkFraKode(behandling.behandlingType, kodeverkTyper.BEHANDLING_TYPE, alleKodeverk) !==
                punsjKodeverkNavn,
    );

    const PunsjBehandlinger: IBehandlingerSomGarAvVentType[] = behandlingerGaarAvVentAarsaker.filter(
        (behandling) =>
            getKodeverkFraKode(behandling.behandlingType, kodeverkTyper.BEHANDLING_TYPE, alleKodeverk) ===
            punsjKodeverkNavn,
    );

    const AlleBehandlingerUtomPunsj: IBehandlingerSomGarAvVentType[] = behandlingerGaarAvVentAarsaker.filter(
        (behandling) =>
            getKodeverkFraKode(behandling.behandlingType, kodeverkTyper.BEHANDLING_TYPE, alleKodeverk) !==
            punsjKodeverkNavn,
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

    const behandlinger = hentBehandlingerKnyttetTilYtelseType().map((behandling) => ({
        ...behandling,
        dato: behandling.frist,
    }));
    const venteårsaker = [
        ...new Set(
            behandlinger.map((behandling) =>
                getKodeverknavnFraKode(behandling.venteårsak, kodeverkTyper.VENTEÅRSAK, alleKodeverk),
            ),
        ),
    ];
    const series = venteårsaker.map((venteårsak) => ({
        name: venteårsak,
        type: 'bar',
        data: behandlinger.filter(
            (behandling) =>
                getKodeverknavnFraKode(behandling.venteårsak, kodeverkTyper.VENTEÅRSAK, alleKodeverk) === venteårsak,
        ),
        itemStyle: fargerForLegendsForBehandlingerPåVentÅrsaker[venteårsak]
            ? { color: fargerForLegendsForBehandlingerPåVentÅrsaker[venteårsak] }
            : undefined,
    }));
    const totalt = { name: 'Totalt', type: 'bar', data: behandlinger, itemStyle: { color: fargeForTotalt } };

    const alleSeries = [totalt, ...series];
    const labels = ['Totalt', ...venteårsaker];

    return <Stolpediagram series={alleSeries} uker={antallUkerSomSkalVises} labels={labels} fremITid />;
};

export default BehandlingerGårAvVentÅrsakerDiagram;
