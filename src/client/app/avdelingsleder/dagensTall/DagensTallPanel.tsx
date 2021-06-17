import React, { FunctionComponent, useMemo } from 'react';
import { Normaltekst } from 'nav-frontend-typografi';
import EnkelTeller from 'avdelingsleder/dagensTall/EnkelTeller';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import { WrappedComponentProps, injectIntl } from 'react-intl';
import ApneBehandlinger from 'avdelingsleder/dagensTall/apneBehandlingerTsType';
import { behandlingstypeOrder } from 'avdelingsleder/nokkeltall/nokkeltallUtils';
import behandlingType from 'kodeverk/behandlingType';
import styles from './dagensTallPanel.less';

interface OwnProps {
    totaltIdag: number;
    dagensTall: ApneBehandlinger[];
}

const dagensTall = [
  {
    behandlingType: {
      kode: 'KOPI',
      navn: 'Kopi',
      kodeverk: 'PUNSJ_INNSENDING_TYPE',
    },
    antall: 1,
  },
  {
    behandlingType: {
      kode: 'BT-007',
      navn: 'Tilbakekreving',
      kodeverk: 'ae0203',
    },
    antall: 5,
  },
  {
    behandlingType: {
      kode: 'BT-004',
      navn: 'Revurdering',
      kodeverk: 'ae0028',
    },
    antall: 265,
  },
  {
    behandlingType: {
      kode: 'SAMTALEREFERAT',
      navn: 'Samtalereferat',
      kodeverk: 'PUNSJ_INNSENDING_TYPE',
    },
    antall: 2,
  },
  {
    behandlingType: {
      kode: 'DIGITAL_ETTERSENDELSE',
      navn: 'Digital ettersendelse',
      kodeverk: 'PUNSJ_INNSENDING_TYPE',
    },
    antall: 6,
  },
  {
    behandlingType: {
      kode: 'PAPIRSØKNAD',
      navn: 'Papirsøknad',
      kodeverk: 'PUNSJ_INNSENDING_TYPE',
    },
    antall: 47,
  },
  {
    behandlingType: {
      kode: 'SKRIV_TIL_OSS_SVAR',
      navn: 'Skriv til oss svar',
      kodeverk: 'PUNSJ_INNSENDING_TYPE',
    },
    antall: 2,
  },
  {
    behandlingType: {
      kode: 'BT-002',
      navn: 'Førstegangsbehandling',
      kodeverk: 'ae0034',
    },
    antall: 1360,
  },
  {
    behandlingType: {
      kode: 'SKRIV_TIL_OSS_SPØRMSÅL',
      navn: 'Skriv til oss spørmsål',
      kodeverk: 'PUNSJ_INNSENDING_TYPE',
    },
    antall: 3,
  },
];

const DagensTallPanel: FunctionComponent<OwnProps & WrappedComponentProps> = ({ totaltIdag }) => {
  const sortedDagensTall = (tall: ApneBehandlinger[]) => useMemo(() => tall
    .sort((dt1, dt2) => behandlingstypeOrder.indexOf(dt1.behandlingType.kode) - behandlingstypeOrder.indexOf(dt2.behandlingType.kode)), [dagensTall]);

  const behandlingstyperSist = [];
  const behandlingstyperForst = [];
  const behandlingsKoderSomSkalVisesForst = [behandlingType.ANKE, behandlingType.FORSTEGANGSSOKNAD, behandlingType.INNSYN,
    behandlingType.KLAGE, behandlingType.REVURDERING, behandlingType.TILBAKEBETALING];

  sortedDagensTall(dagensTall).forEach((dt) => {
    if (behandlingsKoderSomSkalVisesForst.includes(dt.behandlingType.kode)) behandlingstyperForst.push(dt);
    else behandlingstyperSist.push(dt);
  });

  const dagensTallIRettRekkefoljd = behandlingstyperForst.concat(behandlingstyperSist);

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
