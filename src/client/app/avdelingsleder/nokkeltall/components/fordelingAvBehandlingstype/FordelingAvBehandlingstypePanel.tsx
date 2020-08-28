
import React, { FunctionComponent } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';

import { Form } from 'react-final-form';
import { Element } from 'nav-frontend-typografi';

import StoreValuesInReduxState from 'form/reduxBinding/StoreValuesInReduxState';
import { getValuesFromReduxState } from 'form/reduxBinding/formDuck';
import { RadioGroupField, RadioOption } from 'form/FinalFields';
import { Kodeverk } from 'kodeverk/kodeverkTsType';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import fagsakYtelseType from 'kodeverk/fagsakYtelseType';
import kodeverkTyper from 'kodeverk/kodeverkTyper';
import { getKodeverk } from 'kodeverk/duck';
import AlleOppgaver from 'avdelingsleder/nokkeltall/components/fordelingAvBehandlingstype/alleOppgaverTsType';
import Panel from 'nav-frontend-paneler';
import FordelingAvBehandlingstypeGraf from './FordelingAvBehandlingstypeGraf';
import { getAlleOppgaver } from '../../duck';
import styles from './fordelingAvBehandlingstypeGraf.less';

const finnFagsakYtelseTypeNavn = (fagsakYtelseTyper, valgtFagsakYtelseType) => {
  const type = fagsakYtelseTyper.find((fyt) => fyt.kode === valgtFagsakYtelseType);
  return type ? type.navn : '';
};

export const ALLE_YTELSETYPER_VALGT = 'ALLE';

interface InitialValues {
  valgtYtelseType: string;
}

interface OwnProps {
  width: number;
  height: number;
  fagsakYtelseTyper: Kodeverk[];
  behandlingTyper: Kodeverk[];
  alleOppgaver?: AlleOppgaver[];
  initialValues: InitialValues;
}

const formName = 'fordelingAvBehandlingstype';

/**
 * FordelingAvBehandlingstypePanel.
 */
export const FordelingAvBehandlingstypePanel: FunctionComponent<OwnProps> = ({
  width,
  height,
  fagsakYtelseTyper,
  behandlingTyper,
  alleOppgaver,
  initialValues,
}) => (
  <Form
    onSubmit={() => undefined}
    initialValues={initialValues}
    render={({ values }) => (
      <Panel className={styles.panel}>
        <StoreValuesInReduxState onUmount stateKey={formName} values={values} />
        <Element>
          <FormattedMessage id="FordelingAvBehandlingstypePanel.Fordeling" />
        </Element>
        <VerticalSpacer sixteenPx />
        <RadioGroupField name="valgtYtelseType">
          <RadioOption
            value={fagsakYtelseType.OMSORGSPENGER}
            label={finnFagsakYtelseTypeNavn(fagsakYtelseTyper, fagsakYtelseType.OMSORGSPENGER)}
          />
          <RadioOption
            value={fagsakYtelseType.PLEIEPENGER_SYKT_BARN}
            label={finnFagsakYtelseTypeNavn(fagsakYtelseTyper, fagsakYtelseType.PLEIEPENGER_SYKT_BARN)}
          />
          <RadioOption
            value={ALLE_YTELSETYPER_VALGT}
            label={<FormattedMessage id="FordelingAvBehandlingstypePanel.Alle" />}
          />
        </RadioGroupField>
        <FordelingAvBehandlingstypeGraf
          width={width}
          height={height}
          behandlingTyper={behandlingTyper}
          alleOppgaver={alleOppgaver ? alleOppgaver
            .filter((ofa) => (values.valgtYtelseType === ALLE_YTELSETYPER_VALGT ? true : values.valgtYtelseType === ofa.fagsakYtelseType.kode)) : []}
        />
      </Panel>
    )}
  />
);

FordelingAvBehandlingstypePanel.defaultProps = {
  alleOppgaver: [],
};

const formDefaultValues = { valgtYtelseType: ALLE_YTELSETYPER_VALGT };

const mapStateToProps = (state) => ({
  alleOppgaver: getAlleOppgaver(state),
  fagsakYtelseTyper: getKodeverk(state)[kodeverkTyper.FAGSAK_YTELSE_TYPE],
  behandlingTyper: getKodeverk(state)[kodeverkTyper.BEHANDLING_TYPE],
  initialValues: getValuesFromReduxState(state)[formName] || formDefaultValues,
});

export default connect(mapStateToProps)(FordelingAvBehandlingstypePanel);
