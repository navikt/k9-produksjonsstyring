import React, { FunctionComponent, useMemo } from 'react';
import { Normaltekst } from 'nav-frontend-typografi';
import EnkelTeller from 'avdelingsleder/dagensTall/EnkelTeller';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import ApneBehandlinger from 'avdelingsleder/dagensTall/apneBehandlingerTsType';
import { behandlingstypeOrder, punsjKodeverkNavn } from 'avdelingsleder/nokkeltall/nokkeltallUtils';
import behandlingType from 'kodeverk/behandlingType';
import AlleKodeverk from "kodeverk/alleKodeverkTsType";
import { useGlobalStateRestApiData } from "api/rest-api-hooks";
import { RestApiGlobalStatePathsKeys } from "api/k9LosApi";
import { getKodeverkFraKode, getKodeverknavnFraKode } from "utils/kodeverkUtils";
import kodeverkTyper from "kodeverk/kodeverkTyper";
import styles from './dagensTallPanel.less';

interface OwnProps {
    totaltIdag: number;
    dagensTall: ApneBehandlinger[];
}

const DagensTallPanel: FunctionComponent<OwnProps & WrappedComponentProps> = ({ totaltIdag, dagensTall }) => {
  const sortedDagensTall = (tall: ApneBehandlinger[]) => useMemo(() => tall
    .sort((dt1, dt2) => behandlingstypeOrder.indexOf(dt1.behandlingType) - behandlingstypeOrder.indexOf(dt2.behandlingType)), [dagensTall]);

  const behandlingstyperSist = [];
  const behandlingstyperForst = [];
  const behandlingsKoderSomSkalVisesForst = [behandlingType.ANKE, behandlingType.FORSTEGANGSSOKNAD, behandlingType.INNSYN,
    behandlingType.KLAGE, behandlingType.REVURDERING, behandlingType.TILBAKEBETALING];

  const alleKodeverk: AlleKodeverk = useGlobalStateRestApiData(RestApiGlobalStatePathsKeys.KODEVERK);

  const punsjBehandlinger = [];
  sortedDagensTall(dagensTall).forEach((dt) => {
    if (behandlingsKoderSomSkalVisesForst.includes(dt.behandlingType)) behandlingstyperForst.push(dt);
    else if (dt.behandlingType
      && getKodeverkFraKode(dt.behandlingType, kodeverkTyper.BEHANDLING_TYPE, alleKodeverk) === punsjKodeverkNavn) punsjBehandlinger.push(dt);
    else behandlingstyperSist.push(dt);
  });

  const punsjTall = {
    antall: 0,
    behandlingType: 'Punsj',
  };

  punsjBehandlinger.forEach((behandlingstype) => { punsjTall.antall += behandlingstype.antall; });

  const dagensTallIRettRekkefoljd = [...behandlingstyperForst, ...behandlingstyperSist, punsjTall];

  return (
    <div className={styles.dagensTallContainer}>
      <Normaltekst className={styles.header}>Status</Normaltekst>
      <div className={styles.container}>
        <EnkelTeller antall={totaltIdag} tekst="Åpne behandlinger" />

        {dagensTall && dagensTallIRettRekkefoljd.map((dt) => (
          <EnkelTeller
            key={dt.behandlingType === 'Punsj' ? 'Punsj' : getKodeverknavnFraKode(dt.behandlingType, kodeverkTyper.BEHANDLING_TYPE, alleKodeverk)}
            antall={dt.antall}
            tekst={dt.behandlingType === 'Punsj' ? 'Punsj' : getKodeverknavnFraKode(dt.behandlingType, kodeverkTyper.BEHANDLING_TYPE, alleKodeverk)} />
        ))}
      </div>
    </div>

  );
};

export default injectIntl(DagensTallPanel);
