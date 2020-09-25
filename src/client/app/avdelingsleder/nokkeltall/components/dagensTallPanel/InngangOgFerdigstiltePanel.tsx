import React, { FunctionComponent } from 'react';
import { injectIntl, WrappedComponentProps, FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Form } from 'react-final-form';
import { Element } from 'nav-frontend-typografi';
import { getKodeverk } from 'kodeverk/duck';
import kodeverkTyper from 'kodeverk/kodeverkTyper';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import Panel from 'nav-frontend-paneler';
import { Kodeverk } from 'kodeverk/kodeverkTsType';
import { getNyeOgFerdigstilteOppgaverNokkeltall } from 'saksbehandler/saksstotte/nokkeltall/duck';
import { createSelector } from 'reselect';
import moment from 'moment';
import { ISO_DATE_FORMAT } from 'utils/formats';
import NyeOgFerdigstilteOppgaver from 'saksbehandler/saksstotte/nokkeltall/components/nyeOgFerdigstilteOppgaverTsType';
import k9LosApi from 'api/k9LosApi';
import NavFrontendSpinner from 'nav-frontend-spinner';
import { SelectField } from 'form/FinalFields';
import { ALLE_YTELSETYPER_VALGT, UKE_4, ytelseTyper } from 'avdelingsleder/nokkeltall/nokkeltallUtils';
import { Column } from 'nav-frontend-grid';
import { getValuesFromReduxState } from 'form/reduxBinding/formDuck';
import { ToggleGruppePure } from 'nav-frontend-toggle';
import Teller from './Teller';
import styles from './ferdigstiltePanel.less';

interface OwnProps {
    width: number;
    height: number;
    nyeOgFerdigstilteOppgaverIdag: NyeOgFerdigstilteOppgaver[];
    behandlingTyper: Kodeverk[];
    requestFinished: boolean;
    initialValues: InitialValues;
}

interface InitialValues {
    ytelseType: string;
    periodeValg: string;
}

const formName = 'inngangOgFerdigstilteForm';

/**
 * InngangOgFerdigstiltePanel.
 */

export const InngangOgFerdigstiltePanel: FunctionComponent<OwnProps & WrappedComponentProps> = ({
  nyeOgFerdigstilteOppgaverIdag,
  requestFinished,
  initialValues,
}) => {
  const getNyeIdagTotalt = () => {
    let nye = 0;
    nyeOgFerdigstilteOppgaverIdag.forEach((n) => { nye += n.antallNye; });
    return nye;
  };

  const getFerdigstilteIdagTotalt = () => {
    let ferdigstilte = 0;
    nyeOgFerdigstilteOppgaverIdag.forEach((n) => { ferdigstilte += n.antallFerdigstilte; });
    return ferdigstilte;
  };

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
            <ToggleGruppePure
              className={styles.toggle}
              kompakt
              toggles={[{ children: 'I dag', pressed: true },
                { children: 'Denne uken' }]}
            />
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
              <Teller forklaring="Totalt" venstreTall={getNyeIdagTotalt()} hoyreTall={getFerdigstilteIdagTotalt()} />)}
            {nyeOgFerdigstilteOppgaverIdag.length > 0 && nyeOgFerdigstilteOppgaverIdag.map((bt) => (
              <Teller
                key={bt.behandlingType.kode}
                forklaring={bt.behandlingType.navn}
                hoyreTall={bt.antallFerdigstilte}
                venstreTall={bt.antallNye}
              />
            ))}
          </div>
        </Panel>
      )}
    />
  );
};

const formDefaultValues = { ytelseType: ALLE_YTELSETYPER_VALGT, periodeValg: ALLE_YTELSETYPER_VALGT };

export const getNyeOgFerdigstilteForIDag = createSelector([getNyeOgFerdigstilteOppgaverNokkeltall], (nyeOgFerdigstilte: { dato: string }[] = []) => {
  const iDag = moment();
  return nyeOgFerdigstilte.filter((oppgave) => iDag.isSame(moment(oppgave.dato, ISO_DATE_FORMAT), 'day'));
});

export const getNyeOgFerdigstilteForSisteSyvDager = createSelector([getNyeOgFerdigstilteOppgaverNokkeltall],
  (nyeOgFerdigstilte: { dato: string }[] = []) => {
    const iDag = moment().startOf('day');
    return nyeOgFerdigstilte.filter((oppgave) => iDag.isAfter(moment(oppgave.dato, ISO_DATE_FORMAT)));
  });

const mapStateToProps = (state) => ({
  behandlingTyper: getKodeverk(state)[kodeverkTyper.BEHANDLING_TYPE],
  nyeOgFerdigstilteOppgaverIdag: getNyeOgFerdigstilteForIDag(state),
  nyeOgFerdigstilteOppgaver7dager: getNyeOgFerdigstilteForSisteSyvDager(state),
  requestFinished: k9LosApi.HENT_NYE_OG_FERDIGSTILTE_OPPGAVER.getRestApiFinished()(state),
  initialValues: getValuesFromReduxState(state)[formName] || formDefaultValues,
});

export default connect(mapStateToProps)(injectIntl(InngangOgFerdigstiltePanel));
