import React, { useMemo, FunctionComponent } from 'react';
import { FormattedMessage, injectIntl, WrappedComponentProps } from 'react-intl';

import Kodeverk from 'kodeverk/kodeverkTsType';
import behandlingType from 'kodeverk/behandlingType';

import ReactECharts from 'sharedComponents/echart/ReactEcharts';
import { punsjKodeverkNavn } from 'avdelingsleder/nokkeltall/nokkeltallUtils';
import { Normaltekst } from 'nav-frontend-typografi';
import { fagytelseTyperSomSkalVises } from 'avdelingsleder/nokkeltall/HistorikkGrafForPunsj';
import kodeverkTyper from 'kodeverk/kodeverkTyper';
import { useKodeverk } from 'api/rest-api-hooks';
import NyeOgFerdigstilteOppgaver from '../nyeOgFerdigstilteOppgaverTsType';

import {
  eChartFargerForLegendsForMineNyeFerdigstilte,
  eChartGridDef,
  eChartLegendStyle,
  eChartMaxBarWith,
  eChartTooltipTextStyle, eChartYXAxisFontSizeSaksbehandlerNokkeltall,
} from '../../../../../../styles/echartStyle';

const behandlingstypeOrder = [
  behandlingType.TILBAKEBETALING,
  behandlingType.INNSYN,
  // behandlingType.ANKE,
  // behandlingType.KLAGE,
  behandlingType.REVURDERING,
  behandlingType.FORSTEGANGSSOKNAD];

interface OwnProps {
  behandlingTyper: Kodeverk[];
  nyeOgFerdigstilteOppgaver: NyeOgFerdigstilteOppgaver[];
  skalPunsjbehandlingerVises: boolean;
}

/**
 * NyeOgFerdigstilteOppgaverForIdagGraf
 */
const NyeOgFerdigstilteOppgaverForIdagGraf: FunctionComponent<OwnProps & WrappedComponentProps> = ({
  intl,
  nyeOgFerdigstilteOppgaver,
  behandlingTyper,
  skalPunsjbehandlingerVises,
}) => {
  const fagytelseTyper = useKodeverk(kodeverkTyper.FAGSAK_YTELSE_TYPE);

  const behandlingTypeNavnForYAkse = useMemo(() => {
    if (skalPunsjbehandlingerVises) {
      return fagytelseTyperSomSkalVises.map((t) => {
        const type = fagytelseTyper.find((ytelse) => ytelse.kode === t);
        return type ? type.navn : '';
      });
    }
    return behandlingstypeOrder.map((bType) => {
      if (bType === behandlingType.FORSTEGANGSSOKNAD) {
        return intl.formatMessage({ id: 'NyeOgFerdigstilteOppgaverForIdagGraf.Førstegangsbehandling' });
      }
      const type = behandlingTyper.find((bt) => bt.kode === bType);
      return type ? type.navn : '';
    });
  }, [behandlingTyper, skalPunsjbehandlingerVises]);

  const ferdigLabel = intl.formatMessage({ id: 'NyeOgFerdigstilteOppgaverForIdagGraf.Ferdigstilte' });
  const nyLabel = intl.formatMessage({ id: 'NyeOgFerdigstilteOppgaverForIdagGraf.Nye' });

  const filtrereUtRelevanteOppgaver = (valgtProperty: string): number[] => {
    if (skalPunsjbehandlingerVises) {
      return fagytelseTyperSomSkalVises.map((type) => {
        const oppgave = nyeOgFerdigstilteOppgaver.find((o) => o.fagsakYtelseType.kode === type && o.behandlingType.kodeverk === punsjKodeverkNavn);

        if (oppgave) {
          return oppgave[valgtProperty];
        }
        return 0;
      });
    }

    return behandlingstypeOrder.map((type) => {
      const oppgave = nyeOgFerdigstilteOppgaver.find((o) => o.behandlingType.kode === type && o.behandlingType.kodeverk !== punsjKodeverkNavn);
      if (oppgave) {
        return oppgave[valgtProperty];
      }
      return 0;
    });
  };

  const dataFerdigstilte = useMemo(() => filtrereUtRelevanteOppgaver('antallFerdigstilte'), [nyeOgFerdigstilteOppgaver]);
  const dataNye = useMemo(() => filtrereUtRelevanteOppgaver('antallNye'), [nyeOgFerdigstilteOppgaver]);

  if (nyeOgFerdigstilteOppgaver.length === 0) {
    return (
      <div>
        <Normaltekst>
          <FormattedMessage id="InngangOgFerdigstiltePanel.IngenTall" />
        </Normaltekst>
      </div>
    );
  }

  return (
    <ReactECharts
      height={230}
      option={{
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
          },
          textStyle: eChartTooltipTextStyle,
        },
        legend: {
          ...eChartLegendStyle,
          data: [nyLabel, ferdigLabel],
        },
        grid: eChartGridDef,
        xAxis: {
          type: 'value',
          minInterval: 1,
          axisLabel: {
            fontSize: eChartYXAxisFontSizeSaksbehandlerNokkeltall,
          },
          boundaryGap: [0, 0.01],
        },
        yAxis: {
          type: 'category',
          axisLabel: {
            fontSize: eChartYXAxisFontSizeSaksbehandlerNokkeltall,
            margin: 15,
          },
          data: behandlingTypeNavnForYAkse,
        },
        series: [
          {
            name: nyLabel,
            type: 'bar',
            data: dataNye,
            barMaxWidth: eChartMaxBarWith,
            color: eChartFargerForLegendsForMineNyeFerdigstilte[0],
          },
          {
            name: ferdigLabel,
            type: 'bar',
            data: dataFerdigstilte,
            barMaxWidth: eChartMaxBarWith,
            color: eChartFargerForLegendsForMineNyeFerdigstilte[1],
          },
        ],
      }}
    />
  );
};

export default injectIntl(NyeOgFerdigstilteOppgaverForIdagGraf);
