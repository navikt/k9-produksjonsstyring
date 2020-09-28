import React, { FunctionComponent, useState } from 'react';
import { injectIntl, WrappedComponentProps, FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Form } from 'react-final-form';
import { Element } from 'nav-frontend-typografi';
import { getKodeverk } from 'kodeverk/duck';
import kodeverkTyper from 'kodeverk/kodeverkTyper';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import Panel from 'nav-frontend-paneler';
import { Kodeverk } from 'kodeverk/kodeverkTsType';
import { createSelector } from 'reselect';
import moment from 'moment';
import { ISO_DATE_FORMAT } from 'utils/formats';
import k9LosApi from 'api/k9LosApi';
import NavFrontendSpinner from 'nav-frontend-spinner';
import { SelectField } from 'form/FinalFields';
import {
  ALLE_YTELSETYPER_VALGT,
  ytelseTyper,
} from 'avdelingsleder/nokkeltall/nokkeltallUtils';
import { getValuesFromReduxState } from 'form/reduxBinding/formDuck';
import { ToggleKnapp } from 'nav-frontend-toggle';
import { getNyeOgFerdigstilteOppgaverMedStonadstype } from 'avdelingsleder/nokkeltall/duck';
import NyeOgFerdigstilteMedStonadstype from 'avdelingsleder/nokkeltall/nyeOgFerdigstilteMedStonadstypeTsType';
import Teller from './Teller';
import styles from './inngangOgFerdigstiltePanel.less';

interface OwnProps {
    width: number;
    height: number;
    nyeOgFerdigstilteOppgaverIdag: NyeOgFerdigstilteMedStonadstype[];
    nyeOgFerdigstilteOppgaver7dager: NyeOgFerdigstilteMedStonadstype[];
    behandlingTyper: Kodeverk[];
    requestFinished: boolean;
    initialValues: InitialValues;
}

interface InitialValues {
    ytelseType: string;
    periodeValg: string;
}

export const slaSammenLikeBehandlingstyper = (oppgaver) => {
  const sammenslatte = [];

  oppgaver.forEach((o) => {
    const index = sammenslatte.findIndex((s) => s.behandlingType.kode === o.behandlingType.kode);
    if (index === -1) {
      sammenslatte.push({
        behandlingType: o.behandlingType,
        nye: o.nye.length,
        ferdigstilte: o.ferdigstilte.length,
      });
    } else {
      sammenslatte[index] = {
        behandlingType: sammenslatte[index].behandlingType,
        nye: sammenslatte[index].nye + o.nye.length,
        ferdigstilte: sammenslatte[index].ferdigstilte + o.ferdigstilte.length,
      };
    }
  });

  return sammenslatte;
};

const formName = 'inngangOgFerdigstilteForm';

/**
 * InngangOgFerdigstiltePanel.
 */

export const InngangOgFerdigstiltePanel: FunctionComponent<OwnProps & WrappedComponentProps> = ({
  nyeOgFerdigstilteOppgaverIdag,
  nyeOgFerdigstilteOppgaver7dager,
  requestFinished,
  initialValues,
}) => {
  const [erIdagValgt, setErIdagValgt] = useState(true);

  const getNyeTotalt = (oppgaver: NyeOgFerdigstilteMedStonadstype[], ytelseType: string) => {
    let nye = 0;
    oppgaver
      .filter((o) => (ytelseType === ALLE_YTELSETYPER_VALGT ? true : ytelseType === o.fagsakYtelseType.kode)).forEach((n) => { nye += n.nye.length; });
    return nye;
  };

  const getFerdigstilteTotalt = (oppgaver: NyeOgFerdigstilteMedStonadstype[], ytelseType: string) => {
    let ferdigstilte = 0;
    oppgaver
      .filter((o) => (
        ytelseType === ALLE_YTELSETYPER_VALGT ? true : ytelseType === o.fagsakYtelseType.kode)).forEach((n) => { ferdigstilte += n.ferdigstilte.length; });
    return ferdigstilte;
  };

  const getOppgaverStonadstype = (oppgaver: NyeOgFerdigstilteMedStonadstype[], ytelseType: string) => slaSammenLikeBehandlingstyper(oppgaver.filter(
    (o) => (ytelseType === ALLE_YTELSETYPER_VALGT ? true : ytelseType === o.fagsakYtelseType.kode),
  ));

  return (
    <Form
      onSubmit={() => undefined}
      initialValues={initialValues}
      render={({ values }) => (
        <Panel className={styles.panel}>
          <Element>
            <FormattedMessage id="InngangOgFerdigstiltePanel.Header" />
          </Element>
          <VerticalSpacer eightPx />
          <div className={styles.valgPanel}>
            <SelectField
              name="ytelseType"
              label=""
              selectValues={ytelseTyper.map((u) => <option key={u.kode} value={u.kode}>{u.navn}</option>)}
              bredde="m"
            />
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
          {requestFinished && nyeOgFerdigstilteOppgaverIdag.length === 0 && (
          <Element>
            <FormattedMessage id="InngangOgFerdigstiltePanel.IngenTall" />
          </Element>
          )}
          {nyeOgFerdigstilteOppgaverIdag.length === 0 && !requestFinished && (
            <NavFrontendSpinner type="XL" className={styles.spinner} />
          )}
          <div className={styles.container}>
            {nyeOgFerdigstilteOppgaverIdag.length > 0 && (
              <Teller
                forklaring="Totalt"
                venstreTall={erIdagValgt
                  ? getNyeTotalt(nyeOgFerdigstilteOppgaverIdag, values.ytelseType)
                  : getNyeTotalt(nyeOgFerdigstilteOppgaver7dager, values.ytelseType)}
                hoyreTall={erIdagValgt
                  ? getFerdigstilteTotalt(nyeOgFerdigstilteOppgaverIdag, values.ytelseType)
                  : getFerdigstilteTotalt(nyeOgFerdigstilteOppgaver7dager, values.ytelseType)}
              />
            )}
            {erIdagValgt && nyeOgFerdigstilteOppgaverIdag.length > 0
            && getOppgaverStonadstype(nyeOgFerdigstilteOppgaverIdag, values.ytelseType).map((o) => (
              <Teller
                key={o.behandlingType.kode}
                forklaring={o.behandlingType.navn}
                hoyreTall={o.ferdigstilte}
                venstreTall={o.nye}
              />
            ))}
            {!erIdagValgt && nyeOgFerdigstilteOppgaver7dager.length > 0
            && getOppgaverStonadstype(nyeOgFerdigstilteOppgaver7dager, values.ytelseType).map((o) => (
              <Teller
                key={o.behandlingType.kode}
                forklaring={o.behandlingType.navn}
                hoyreTall={o.ferdigstilte}
                venstreTall={o.nye}
              />
            ))}
          </div>
        </Panel>
      )}
    />
  );
};

const formDefaultValues = { ytelseType: ALLE_YTELSETYPER_VALGT, periodeValg: ALLE_YTELSETYPER_VALGT };

export const getNyeOgFerdigstilteForIDag = createSelector([getNyeOgFerdigstilteOppgaverMedStonadstype], (nyeOgFerdigstilte: { dato: string }[] = []) => {
  const iDag = moment();
  return nyeOgFerdigstilte.filter((oppgave) => iDag.isSame(moment(oppgave.dato, ISO_DATE_FORMAT), 'day'));
});

export const getNyeOgFerdigstilteForSisteSyvDager = createSelector([getNyeOgFerdigstilteOppgaverMedStonadstype],
  (nyeOgFerdigstilte: { dato: string }[] = []) => {
    const iDag = moment().startOf('day');
    return nyeOgFerdigstilte.filter((oppgave) => iDag.isSameOrAfter(moment(oppgave.dato, ISO_DATE_FORMAT)));
  });

const mapStateToProps = (state) => ({
  behandlingTyper: getKodeverk(state)[kodeverkTyper.BEHANDLING_TYPE],
  nyeOgFerdigstilteOppgaverIdag: getNyeOgFerdigstilteForIDag(state),
  nyeOgFerdigstilteOppgaver7dager: getNyeOgFerdigstilteForSisteSyvDager(state),
  requestFinished: k9LosApi.HENT_OPPSUMMERING.getRestApiFinished()(state),
  initialValues: getValuesFromReduxState(state)[formName] || formDefaultValues,
});

export default connect(mapStateToProps)(injectIntl(InngangOgFerdigstiltePanel));
