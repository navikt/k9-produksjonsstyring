import React, { FunctionComponent, useMemo } from 'react';
import { Normaltekst } from 'nav-frontend-typografi';
import EnkelTeller from 'avdelingsleder/dagensTall/EnkelTeller';
import { WrappedComponentProps, injectIntl } from 'react-intl';
import ApneBehandlinger from 'avdelingsleder/dagensTall/apneBehandlingerTsType';
import { behandlingstypeOrder } from 'avdelingsleder/nokkeltall/nokkeltallUtils';
import behandlingType from 'kodeverk/behandlingType';
import styles from './dagensTallPanel.less';

interface OwnProps {
    totaltIdag: number;
    dagensTall: ApneBehandlinger[];
}

const DagensTallPanel: FunctionComponent<OwnProps & WrappedComponentProps> = ({ totaltIdag, dagensTall }) => {
  const sortedDagensTall = (tall: ApneBehandlinger[]) => useMemo(() => tall
    .sort((dt1, dt2) => behandlingstypeOrder.indexOf(dt1.behandlingType.kode) - behandlingstypeOrder.indexOf(dt2.behandlingType.kode)), [dagensTall]);

  const behandlingstyperSist = [];
  const behandlingstyperForst = [];
  const behandlingsKoderSomSkalVisesForst = [behandlingType.ANKE, behandlingType.FORSTEGANGSSOKNAD, behandlingType.INNSYN,
    behandlingType.KLAGE, behandlingType.REVURDERING, behandlingType.TILBAKEBETALING];

  const punsjBehandlingstyper = [behandlingType.SKRIV_TIL_OSS_SPØRMSÅL,
    behandlingType.DIGITAL_ETTERSENDELSE,
    behandlingType.INNLOGGET_CHAT,
    behandlingType.PAPIRINNTEKTSOPPLYSNINGER,
    behandlingType.PAPIRSØKNAD,
    behandlingType.PAPIRETTERSENDELSE,
    behandlingType.KOPI,
    behandlingType.SKRIV_TIL_OSS_SVAR,
  ];

  const punsjBehandlinger = [];
  sortedDagensTall(dagensTall).forEach((dt) => {
    if (behandlingsKoderSomSkalVisesForst.includes(dt.behandlingType.kode)) behandlingstyperForst.push(dt);
    else if (punsjBehandlingstyper.includes(dt.behandlingType.kode)) punsjBehandlinger.push(dt);
    else behandlingstyperSist.push(dt);
  });

  const punsjTall = {
    antall: 0,
    behandlingType:{
      navn: 'Punsj'
    }
  };

  punsjBehandlinger.forEach((behandlingstype) => { punsjTall.antall += behandlingstype.antall; });

  const dagensTallIRettRekkefoljd = [...behandlingstyperForst, ...behandlingstyperSist, punsjTall];

  return (
    <div className={styles.dagensTallContainer}>
      <Normaltekst className={styles.header}>Status</Normaltekst>
      <div className={styles.container}>
        <EnkelTeller antall={totaltIdag} tekst="Åpne behandlinger" />

        {dagensTall && dagensTallIRettRekkefoljd.map((dt) => (
          <EnkelTeller antall={dt.antall} tekst={dt.behandlingType.navn} />
        ))}
      </div>
    </div>

  );
};

export default injectIntl(DagensTallPanel);
