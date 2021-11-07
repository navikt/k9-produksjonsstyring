import React, { FunctionComponent } from 'react';
import { WrappedComponentProps, FormattedMessage, injectIntl } from 'react-intl';
import { Element } from 'nav-frontend-typografi';
import { Row, Column } from 'nav-frontend-grid';
import { Form } from 'react-final-form';
import { SelectField } from 'form/FinalFields';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import Panel from 'nav-frontend-paneler';
import styles from 'avdelingsleder/nokkeltall/historikkGraf.less';
import {
  ALLE_YTELSETYPER_VALGT,
  filtrereNyePerDato,
  UKE_4,
  uker,
  ytelseTyper,
} from 'avdelingsleder/nokkeltall/nokkeltallUtils';
import useKodeverk from 'api/rest-api-hooks/src/global-data/useKodeverk';
import kodeverkTyper from 'kodeverk/kodeverkTyper';
import StoreValuesInLocalStorage from 'form/StoreValuesInLocalStorage';
import fagsakYtelseType from 'kodeverk/fagsakYtelseType';
import HistorikkGrafEcharts from 'avdelingsleder/nokkeltall/HistorikkGrafEcharts';
import HistorikkGraf from '../../HistorikkGraf';
import HistoriskData from '../../historiskDataTsType';

interface InitialValues {
    ytelseType: string;
    ukevalg: string;
}

interface OwnProps {
    width: number;
    height: number;
    nyePerDato?: HistoriskData[];
    getValueFromLocalStorage: (key: string) => string;
}

const formName = 'nyeForm';
const formDefaultValues: InitialValues = { ytelseType: ALLE_YTELSETYPER_VALGT, ukevalg: UKE_4 };

/**
 * NyeHistorikkPanel.
 */

export const NyeHistorikkPanel: FunctionComponent<OwnProps & WrappedComponentProps> = ({
  intl,
  width,
  height,
  nyePerDato,
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
            <FormattedMessage id="NyeHistorikkPanel.Nye" />
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
          <HistorikkGrafEcharts
            isFireUkerValgt={values.ukevalg === UKE_4}
            behandlingTyper={behandlingTyper}
            historiskData={filtrereNyePerDato(values.ytelseType, values.ukevalg, nyePerDato)}
            erPunsjValgt={values.ytelseType === fagsakYtelseType.PUNSJ}
          />
        </Panel>
      )}
    />
  );
};

export default injectIntl(NyeHistorikkPanel);
