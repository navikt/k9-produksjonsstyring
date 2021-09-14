import React, { FunctionComponent, useMemo } from 'react';
import { Normaltekst } from 'nav-frontend-typografi';
import EnkelTeller from 'avdelingsleder/dagensTall/EnkelTeller';
import { WrappedComponentProps, injectIntl } from 'react-intl';
import ApneBehandlinger from 'avdelingsleder/dagensTall/apneBehandlingerTsType';
import { behandlingstypeOrder } from 'avdelingsleder/nokkeltall/nokkeltallUtils';
import behandlingType from 'kodeverk/behandlingType';
import { v4 as uuid4 } from 'uuid';
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
          <EnkelTeller key={uuid4()} antall={dt.antall} tekst={dt.behandlingType.navn} />
        ))}
      </div>
    </div>

  );
};

export default injectIntl(DagensTallPanel);
