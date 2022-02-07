import React, { FunctionComponent } from 'react';
import { FormattedMessage } from 'react-intl';

import { Form } from 'react-final-form';
import { Element } from 'nav-frontend-typografi';
import { SelectField } from 'form/FinalFields';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import fagsakYtelseType from 'kodeverk/fagsakYtelseType';
import kodeverkTyper from 'kodeverk/kodeverkTyper';
import AlleOppgaver from 'avdelingsleder/nokkeltall/components/fordelingAvBehandlingstype/alleOppgaverTsType';
import Panel from 'nav-frontend-paneler';
import {
  ALLE_YTELSETYPER_VALGT,
  sjekkOmOppgaveSkalLeggesTil,
  ytelseTyper,
} from 'avdelingsleder/nokkeltall/nokkeltallUtils';
import useKodeverk from 'api/rest-api-hooks/src/global-data/useKodeverk';
import StoreValuesInLocalStorage from 'form/StoreValuesInLocalStorage';
import FordelingAvBehandlingstypeGraf from 'avdelingsleder/nokkeltall/components/fordelingAvBehandlingstype/FordelingAvBehandlingstypeGraf';
import { Column, Row } from 'nav-frontend-grid';
import { getValueFromLocalStorage } from 'utils/localStorageHelper';
import styles from './fordelingAvBehandlingstypeGraf.less';

interface InitialValues {
  valgtYtelseType: string;
}

interface OwnProps {
  alleOppgaver?: AlleOppgaver[];
}

const formName = 'fordelingAvBehandlingstype';
const formDefaultValues: InitialValues = { valgtYtelseType: ALLE_YTELSETYPER_VALGT };

/**
 * FordelingAvBehandlingstypePanel.
 */
export const FordelingAvBehandlingstypePanel: FunctionComponent<OwnProps> = ({ alleOppgaver }) => {
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
            <FormattedMessage id="FordelingAvBehandlingstypePanel.Fordeling" />
          </Element>
          <VerticalSpacer sixteenPx />
          <Row>
            <Column xs="2">
              <SelectField
                name="valgtYtelseType"
                label=""
                selectValues={ytelseTyper.map(u => (
                  <option key={u.kode} value={u.kode}>
                    {u.navn}
                  </option>
                ))}
                bredde="l"
              />
            </Column>
          </Row>
          <FordelingAvBehandlingstypeGraf
            behandlingTyper={behandlingTyper}
            alleOppgaver={
              alleOppgaver ? alleOppgaver.filter(ofa => sjekkOmOppgaveSkalLeggesTil(values.valgtYtelseType, ofa)) : []
            }
            erPunsjValgt={values.valgtYtelseType === fagsakYtelseType.PUNSJ}
          />
        </Panel>
      )}
    />
  );
};

export default FordelingAvBehandlingstypePanel;
