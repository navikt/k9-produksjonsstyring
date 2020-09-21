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
import styles from 'avdelingsleder/nokkeltall/components/beholdningHistorikk/historikkGraf.less';
import {
  ALLE_YTELSETYPER_VALGT, erDatoInnenforPeriode,
  slaSammenLikeBehandlingstyperOgDatoer, UKE_4, ytelseTyper,
} from 'avdelingsleder/nokkeltall/components/beholdningHistorikk/BeholdningHistorikkPanel';
import { getFerdigstiltePerDato } from '../../duck';

import HistorikkGraf from '../beholdningHistorikk/HistorikkGraf';
import BeholdningPerDato from '../beholdningHistorikk/historiskDataTsType';

const uker = [{
  kode: '4',
  tekstKode: '4 siste uker',
}, {
  kode: '8',
  tekstKode: '8 siste uker',
}];

interface InitialValues {
    ytelseType: string;
    ukevalg: string;
}

interface OwnProps {
    width: number;
    height: number;
    fagsakYtelseTyper: Kodeverk[];
    ferdigstiltePerDato?: BeholdningPerDato[];
    initialValues: InitialValues;
    behandlingTyper: Kodeverk[];
}

const formName = 'tilBehandlingForm';

export const FerdigstilteHistorikkPanel: FunctionComponent<OwnProps & WrappedComponentProps> = ({
  width,
  height,
  ferdigstiltePerDato,
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
          <FormattedMessage id="FerdigstilteHistorikkPanel.Ferdigstilte" />
        </Element>
        <VerticalSpacer eightPx />
        <Row>
          <Column xs="2">
            <SelectField
              name="ukevalg"
              label=""
              selectValues={uker.map((u) => <option key={u.kode} value={u.kode}>{u.tekstKode}</option>)}
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
          historiskData={ferdigstiltePerDato ? slaSammenLikeBehandlingstyperOgDatoer(ferdigstiltePerDato
            .filter((ofa) => (values.ytelseType === ALLE_YTELSETYPER_VALGT ? true : values.ytelseType === ofa.fagsakYtelseType.kode))
            .filter((ofa) => erDatoInnenforPeriode(ofa, values.ukevalg))) : []}
        />
      </Panel>
    )}
  />
);

FerdigstilteHistorikkPanel.defaultProps = {
  ferdigstiltePerDato: [],
};

const formDefaultValues = { ytelseType: ALLE_YTELSETYPER_VALGT, ukevalg: '4' };

const mapStateToProps = (state) => ({
  fagsakYtelseTyper: getKodeverk(state)[kodeverkTyper.FAGSAK_YTELSE_TYPE],
  behandlingTyper: getKodeverk(state)[kodeverkTyper.BEHANDLING_TYPE],
  ferdigstiltePerDato: getFerdigstiltePerDato(state),
  initialValues: getValuesFromReduxState(state)[formName] || formDefaultValues,
});

export default connect(mapStateToProps)(injectIntl(FerdigstilteHistorikkPanel));
