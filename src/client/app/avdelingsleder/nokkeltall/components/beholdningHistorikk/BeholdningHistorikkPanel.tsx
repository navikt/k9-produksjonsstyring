import React, { FunctionComponent } from 'react';
import { injectIntl, WrappedComponentProps, FormattedMessage } from 'react-intl';

import { Form } from 'react-final-form';
import { Element } from 'nav-frontend-typografi';
import { Row, Column } from 'nav-frontend-grid';
import { SelectField } from 'form/FinalFields';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import kodeverkTyper from 'kodeverk/kodeverkTyper';
import Panel from 'nav-frontend-paneler';
import styles from 'avdelingsleder/nokkeltall/historikkGraf.less';
import {
  ALLE_YTELSETYPER_VALGT, filtrereNyePerDato,
  UKE_4,
  uker,
  ytelseTyper,
} from 'avdelingsleder/nokkeltall/nokkeltallUtils';
import useKodeverk from 'api/rest-api-hooks/src/global-data/useKodeverk';
import StoreValuesInLocalStorage from 'form/StoreValuesInLocalStorage';
import fagsakYtelseType from 'kodeverk/fagsakYtelseType';
import HistorikkGraf from '../../HistorikkGraf';
import HistoriskData from '../../historiskDataTsType';

interface InitialValues {
  ytelseType: string;
  ukevalg: string;
}

interface OwnProps {
  beholdningPerDato?: HistoriskData[];
  getValueFromLocalStorage: (key: string) => string;
}

const formName = 'beholdningForm';
const formDefaultValues: InitialValues = { ytelseType: ALLE_YTELSETYPER_VALGT, ukevalg: UKE_4 };

/**
 * BeholdningHistorikkPanel.
 */
export const BeholdningHistorikkPanel: FunctionComponent<OwnProps & WrappedComponentProps> = ({
  intl,
  beholdningPerDato,
  getValueFromLocalStorage,
}) => {
  const behandlingTyper = useKodeverk(kodeverkTyper.BEHANDLING_TYPE);
  const stringFromStorage = getValueFromLocalStorage(formName);
  const lagredeVerdier = stringFromStorage ? JSON.parse(stringFromStorage) : undefined;

  return (
    <Form
      onSubmit={() => undefined}
      initialValues={lagredeVerdier || formDefaultValues}
      render={({ values }) => (
        <Panel className={styles.panel}>
          <StoreValuesInLocalStorage stateKey={formName} values={values} />
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
            isFireUkerValgt={values.ukevalg === UKE_4}
            behandlingTyper={behandlingTyper}
            historiskData={filtrereNyePerDato(values.ytelseType, values.ukevalg, beholdningPerDato)}
            erPunsjValgt={values.ytelseType === fagsakYtelseType.PUNSJ}
          />
        </Panel>
      )}
    />
  );
};

export default injectIntl(BeholdningHistorikkPanel);
