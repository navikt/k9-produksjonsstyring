import React, { FunctionComponent } from 'react';
import { FormattedMessage } from 'react-intl';

import { Form } from 'react-final-form';
import { Element } from 'nav-frontend-typografi';
import { RadioGroupField, RadioOption } from 'form/FinalFields';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import fagsakYtelseType from 'kodeverk/fagsakYtelseType';
import kodeverkTyper from 'kodeverk/kodeverkTyper';
import AlleOppgaver from 'avdelingsleder/nokkeltall/components/fordelingAvBehandlingstype/alleOppgaverTsType';
import Panel from 'nav-frontend-paneler';
import { ALLE_YTELSETYPER_VALGT, sjekkOmOppgaveSkalLeggesTil } from 'avdelingsleder/nokkeltall/nokkeltallUtils';
import useKodeverk from 'api/rest-api-hooks/src/global-data/useKodeverk';
import StoreValuesInLocalStorage from 'form/StoreValuesInLocalStorage';
import FordelingAvBehandlingstypeGraf from './FordelingAvBehandlingstypeGraf';
import styles from './fordelingAvBehandlingstypeGraf.less';

const finnFagsakYtelseTypeNavn = (fagsakYtelseTyper, valgtFagsakYtelseType) => {
  const type = fagsakYtelseTyper.find((fyt) => fyt.kode === valgtFagsakYtelseType);
  return type ? type.navn : '';
};

interface InitialValues {
  valgtYtelseType: string;
}

interface OwnProps {
  width: number;
  height: number;
  alleOppgaver?: AlleOppgaver[];
  getValueFromLocalStorage: (key: string) => string;
}

const formName = 'fordelingAvBehandlingstype';
const formDefaultValues: InitialValues = { valgtYtelseType: ALLE_YTELSETYPER_VALGT };

/**
 * FordelingAvBehandlingstypePanel.
 */
export const FordelingAvBehandlingstypePanel: FunctionComponent<OwnProps> = ({
  width,
  height,
  alleOppgaver,
  getValueFromLocalStorage,
}) => {
  const fagsakYtelseTyper = useKodeverk(kodeverkTyper.FAGSAK_YTELSE_TYPE);
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
          <RadioGroupField name="valgtYtelseType">
            <RadioOption
              value={fagsakYtelseType.OMSORGSPENGER}
              label={finnFagsakYtelseTypeNavn(fagsakYtelseTyper, fagsakYtelseType.OMSORGSPENGER)}
            />
            <RadioOption
              value={fagsakYtelseType.OMSORGSDAGER}
              label="Omsorgsdager"
            />
            <RadioOption
              value={fagsakYtelseType.PLEIEPENGER_SYKT_BARN}
              label={finnFagsakYtelseTypeNavn(fagsakYtelseTyper, fagsakYtelseType.PLEIEPENGER_SYKT_BARN)}
            />
            <RadioOption
              value={fagsakYtelseType.PUNSJ}
              label="Punsj"
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
              .filter((ofa) => (sjekkOmOppgaveSkalLeggesTil(values.valgtYtelseType, ofa))) : []}
            erPunsjValgt={values.valgtYtelseType === fagsakYtelseType.PUNSJ}
          />
        </Panel>
      )}
    />
  );
};

export default FordelingAvBehandlingstypePanel;
