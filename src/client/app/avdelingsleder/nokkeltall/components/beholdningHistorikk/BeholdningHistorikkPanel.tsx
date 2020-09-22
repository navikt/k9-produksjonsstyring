import React, { FunctionComponent } from 'react';
import { connect } from 'react-redux';
import { injectIntl, WrappedComponentProps, FormattedMessage } from 'react-intl';

import { Form } from 'react-final-form';
import { Element } from 'nav-frontend-typografi';
import { Row, Column } from 'nav-frontend-grid';

import StoreValuesInReduxState from 'form/reduxBinding/StoreValuesInReduxState';
import { getValuesFromReduxState } from 'form/reduxBinding/formDuck';
import { SelectField } from 'form/FinalFields';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import { Kodeverk } from 'kodeverk/kodeverkTsType';
import kodeverkTyper from 'kodeverk/kodeverkTyper';
import { getKodeverk } from 'kodeverk/duck';
import Panel from 'nav-frontend-paneler';
import styles from 'avdelingsleder/nokkeltall/historikkGraf.less';
import {
  ALLE_YTELSETYPER_VALGT,
  erDatoInnenforPeriode, slaSammenLikeBehandlingstyperOgDatoer,
  UKE_4,
  uker,
  ytelseTyper,
} from 'avdelingsleder/nokkeltall/nokkeltallUtils';
import { getOppgaverPerDato } from '../../duck';

import HistorikkGraf from '../../HistorikkGraf';
import HistoriskData from '../../historiskDataTsType';

interface InitialValues {
  ytelseType: string;
  ukevalg: string;
}

interface OwnProps {
  width: number;
  height: number;
  fagsakYtelseTyper: Kodeverk[];
  beholdningPerDato?: HistoriskData[];
  initialValues: InitialValues;
  behandlingTyper: Kodeverk[];
}

const formName = 'beholdningForm';

/**
 * BeholdningHistorikkPanel.
 */
export const BeholdningHistorikkPanel: FunctionComponent<OwnProps & WrappedComponentProps> = ({
  intl,
  width,
  height,
  beholdningPerDato,
  initialValues,
  behandlingTyper,
}) => (
  <Form
    onSubmit={() => undefined}
    initialValues={initialValues}
    render={({ values }) => (
      <Panel className={styles.panel}>
        <StoreValuesInReduxState onUmount stateKey={formName} values={values} />
        <Element>
          <FormattedMessage id="BeholdningHistorikkPanel.Beholdning" />
        </Element>
        <VerticalSpacer eightPx />
        <Row>
          <Column xs="2">
            <SelectField
              name="ukevalg"
              label=""
              selectValues={uker.map((u) => <option key={u.kode} value={u.kode}>{intl.formatMessage({ id: u.tekstKode })}</option>)}
              bredde="l"
            />
          </Column>
          <Column xs="2">
            <SelectField
              name="ytelseType"
              label=""
              selectValues={ytelseTyper.map((u) => <option key={u.kode} value={u.kode}>{u.navn}</option>)}
              bredde="l"
            />
          </Column>
        </Row>
        <VerticalSpacer sixteenPx />
        <HistorikkGraf
          width={width}
          height={height}
          isFireUkerValgt={values.ukevalg === UKE_4}
          behandlingTyper={behandlingTyper}
          historiskData={beholdningPerDato ? slaSammenLikeBehandlingstyperOgDatoer(beholdningPerDato
            .filter((ofa) => (values.ytelseType === ALLE_YTELSETYPER_VALGT ? true : values.ytelseType === ofa.fagsakYtelseType.kode))
            .filter((ofa) => erDatoInnenforPeriode(ofa, values.ukevalg))) : []}
        />
      </Panel>
    )}
  />
);

BeholdningHistorikkPanel.defaultProps = {
  beholdningPerDato: [],
};

const formDefaultValues = { ytelseType: ALLE_YTELSETYPER_VALGT, ukevalg: UKE_4 };

const mapStateToProps = (state) => ({
  fagsakYtelseTyper: getKodeverk(state)[kodeverkTyper.FAGSAK_YTELSE_TYPE],
  behandlingTyper: getKodeverk(state)[kodeverkTyper.BEHANDLING_TYPE],
  beholdningPerDato: getOppgaverPerDato(state),
  initialValues: getValuesFromReduxState(state)[formName] || formDefaultValues,
});

export default connect(mapStateToProps)(injectIntl(BeholdningHistorikkPanel));
