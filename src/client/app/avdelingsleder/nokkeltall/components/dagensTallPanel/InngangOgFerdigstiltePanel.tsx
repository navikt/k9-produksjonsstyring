import React, { FunctionComponent, useState } from 'react';
import { injectIntl, WrappedComponentProps, FormattedMessage } from 'react-intl';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import Panel from 'nav-frontend-paneler';
import { ISO_DATE_FORMAT } from 'utils/formats';
import { K9LosApiKeys } from 'api/k9LosApi';
import NavFrontendSpinner from 'nav-frontend-spinner';
import {
  ALLE_YTELSETYPER_VALGT,
  sjekkOmOppgaveSkalLeggesTil,
  ytelseTyper,
} from 'avdelingsleder/nokkeltall/nokkeltallUtils';
import { ToggleKnapp } from 'nav-frontend-toggle';
import NyeOgFerdigstilteMedStonadstype from 'avdelingsleder/nokkeltall/nyeOgFerdigstilteMedStonadstypeTsType';
import useRestApi from 'api/rest-api-hooks/src/local-data/useRestApi';
import RestApiState from 'api/rest-api-hooks/src/RestApiState';
import dayjs from 'dayjs';
import { getValueFromLocalStorage } from 'utils/localStorageHelper';
import { lagreTilLocalStorageCallback } from 'utils/localStorageHelper';
import Teller from './Teller';
import styles from './inngangOgFerdigstiltePanel.less';
import { Select } from '@navikt/ds-react';

export const slaSammenLikeBehandlingstyper = oppgaver => {
  const sammenslatte = [];

  oppgaver.forEach(o => {
    const index = sammenslatte.findIndex(s => s.behandlingType.kode === o.behandlingType.kode);
    if (index === -1) {
      sammenslatte.push({
        behandlingType: o.behandlingType,
        nye: o.nye,
        ferdigstilte: o.ferdigstilte,
      });
    } else {
      sammenslatte[index] = {
        behandlingType: sammenslatte[index].behandlingType,
        nye: sammenslatte[index].nye + o.nye,
        ferdigstilte: sammenslatte[index].ferdigstilte + o.ferdigstilte,
      };
    }
  });

  return sammenslatte;
};

export const InngangOgFerdigstiltePanel: FunctionComponent<WrappedComponentProps> = () => {
  const id = 'inngangOgFerdigstiltePanel';
  const [erIdagValgt, setErIdagValgt] = useState(true);
  const [valgtYtelseType, setValgtYtelseType] = useState<string>(
    getValueFromLocalStorage(`${id}-ytelsestype`) || ALLE_YTELSETYPER_VALGT,
  );

  const { data: nyeOgFerdigstilteOppgaverMedStonadstype = [], state } = useRestApi<NyeOgFerdigstilteMedStonadstype[]>(
    K9LosApiKeys.HENT_OPPSUMMERING,
  );

  const velgYtelsesTypeHandler = value => {
    lagreTilLocalStorageCallback(`${id}-ytelsestype`, value, setValgtYtelseType);
  };

  const requestFinished = state === RestApiState.SUCCESS;

  const nyeOgFerdigstilteOppgaverIdag = nyeOgFerdigstilteOppgaverMedStonadstype.filter(oppgave =>
    dayjs().isSame(dayjs(oppgave.dato, ISO_DATE_FORMAT), 'day'),
  );
  const nyeOgFerdigstilteOppgaver7dager = nyeOgFerdigstilteOppgaverMedStonadstype.filter(oppgave =>
    dayjs().startOf('day').isSameOrAfter(dayjs(oppgave.dato, ISO_DATE_FORMAT)),
  );

  const getNyeTotalt = (oppgaver: NyeOgFerdigstilteMedStonadstype[], ytelseType: string) => {
    let nye = 0;
    oppgaver
      .filter(o => sjekkOmOppgaveSkalLeggesTil(ytelseType, o))
      .forEach(n => {
        nye += n.nye;
      });
    return nye;
  };

  const getFerdigstilteTotalt = (oppgaver: NyeOgFerdigstilteMedStonadstype[], ytelseType: string) => {
    let ferdigstilte = 0;
    oppgaver
      .filter(o => sjekkOmOppgaveSkalLeggesTil(ytelseType, o))
      .forEach(n => {
        ferdigstilte += n.ferdigstilte;
      });
    return ferdigstilte;
  };

  const getOppgaverStonadstype = (oppgaver: NyeOgFerdigstilteMedStonadstype[], ytelseType: string) =>
    slaSammenLikeBehandlingstyper(oppgaver.filter(o => sjekkOmOppgaveSkalLeggesTil(ytelseType, o)));

  return (
    <Panel className={styles.panel}>
      <Element>
        <FormattedMessage id="InngangOgFerdigstiltePanel.Header" />
      </Element>
      <VerticalSpacer eightPx />
      <div className={styles.valgPanel}>
        <Select
          onChange={e => velgYtelsesTypeHandler(e.target.value)}
          label="Valgt ytelse"
          hideLabel
          size="small"
          value={valgtYtelseType}
        >
          {ytelseTyper.map(u => (
            <option key={u.kode} value={u.kode}>
              {u.navn}
            </option>
          ))}
        </Select>
        <div className={styles.toggles}>
          <ToggleKnapp
            pressed
            className={erIdagValgt ? styles.venstreKnappAktiv : styles.venstreKnapp}
            onClick={() => setErIdagValgt(true)}
          >
            I dag
          </ToggleKnapp>
          <ToggleKnapp
            className={erIdagValgt ? styles.hoyreKnapp : styles.hoyreKnappAktiv}
            onClick={() => setErIdagValgt(false)}
          >
            Siste 7 dager
          </ToggleKnapp>
        </div>
      </div>
      {((erIdagValgt && requestFinished && nyeOgFerdigstilteOppgaverIdag.length === 0) ||
        (!erIdagValgt && requestFinished && nyeOgFerdigstilteOppgaver7dager.length === 0)) && (
        <Normaltekst className={styles.ingenTall}>
          <FormattedMessage id="InngangOgFerdigstiltePanel.IngenTall" />
        </Normaltekst>
      )}
      {nyeOgFerdigstilteOppgaverIdag.length === 0 && !requestFinished && (
        <NavFrontendSpinner type="XL" className={styles.spinner} />
      )}
      <div className={styles.container}>
        {((erIdagValgt && nyeOgFerdigstilteOppgaverIdag.length > 0) ||
          (!erIdagValgt && nyeOgFerdigstilteOppgaver7dager.length > 0)) && (
          <Teller
            forklaring="Totalt"
            venstreTall={
              erIdagValgt
                ? getNyeTotalt(nyeOgFerdigstilteOppgaverIdag, valgtYtelseType)
                : getNyeTotalt(nyeOgFerdigstilteOppgaver7dager, valgtYtelseType)
            }
            hoyreTall={
              erIdagValgt
                ? getFerdigstilteTotalt(nyeOgFerdigstilteOppgaverIdag, valgtYtelseType)
                : getFerdigstilteTotalt(nyeOgFerdigstilteOppgaver7dager, valgtYtelseType)
            }
          />
        )}
        {erIdagValgt &&
          nyeOgFerdigstilteOppgaverIdag.length > 0 &&
          valgtYtelseType !== 'PUNSJ' &&
          getOppgaverStonadstype(nyeOgFerdigstilteOppgaverIdag, valgtYtelseType).map(o => (
            <Teller
              key={o.behandlingType.kode}
              forklaring={o.behandlingType.navn}
              hoyreTall={o.ferdigstilte}
              venstreTall={o.nye}
            />
          ))}
        {!erIdagValgt &&
          nyeOgFerdigstilteOppgaver7dager.length > 0 &&
          valgtYtelseType !== 'PUNSJ' &&
          getOppgaverStonadstype(nyeOgFerdigstilteOppgaver7dager, valgtYtelseType).map(o => (
            <Teller
              key={o.behandlingType.kode}
              forklaring={o.behandlingType.navn}
              hoyreTall={o.ferdigstilte}
              venstreTall={o.nye}
            />
          ))}
      </div>
    </Panel>
  );
};

export default injectIntl(InngangOgFerdigstiltePanel);
