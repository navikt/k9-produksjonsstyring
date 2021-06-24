import React, { FunctionComponent } from 'react';
import { FormattedMessage } from 'react-intl';
import { Normaltekst } from 'nav-frontend-typografi';

import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import fagsakYtelseType from 'kodeverk/fagsakYtelseType';
import { RadioGroupField, RadioOption } from 'form/FinalFields';
import kodeverkTyper from 'kodeverk/kodeverkTyper';

import useKodeverk from 'api/rest-api-hooks/src/global-data/useKodeverk';
import useRestApiRunner from 'api/rest-api-hooks/src/local-data/useRestApiRunner';
import { K9LosApiKeys } from 'api/k9LosApi';
import styles from './utvalgskriterierForOppgavekoForm.less';

const finnFagsakYtelseTypeNavn = (fagsakYtelseTyper, valgtFagsakYtelseType) => {
  const type = fagsakYtelseTyper.find((fyt) => fyt.kode === valgtFagsakYtelseType);
  return type ? type.navn : '';
};

interface OwnProps {
  valgtOppgavekoId: string;
  hentOppgaveko:(id: string) => void;
}

/**
 * FagsakYtelseTypeVelger
 */
const FagsakYtelseTypeVelger: FunctionComponent<OwnProps> = ({
  valgtOppgavekoId,
  hentOppgaveko,
}) => {
  const { startRequest: lagreOppgavekoFagsakYtelseType } = useRestApiRunner(K9LosApiKeys.LAGRE_OPPGAVEKO_FAGSAK_YTELSE_TYPE);
  const alleFagsakYtelseTyper = useKodeverk(kodeverkTyper.FAGSAK_YTELSE_TYPE);
  return (
    <div className={styles.stonadsVelger}>
      <Normaltekst className={styles.label}>
        <FormattedMessage id="FagsakYtelseTypeVelger.Stonadstype" />
      </Normaltekst>
      <VerticalSpacer eightPx />
      <RadioGroupField
        direction="vertical"
        name="fagsakYtelseType"
        onChange={(fyt) => lagreOppgavekoFagsakYtelseType(fyt !== '' ? { id: valgtOppgavekoId, fagsakYtelseType: fyt } : { id: valgtOppgavekoId }).then(() => {
          hentOppgaveko(valgtOppgavekoId);
        })}
      >
        <RadioOption
          value={fagsakYtelseType.OMSORGSPENGER}
          label={finnFagsakYtelseTypeNavn(alleFagsakYtelseTyper, fagsakYtelseType.OMSORGSPENGER)}
        />
        <RadioOption
          value={fagsakYtelseType.OMSORGSDAGER}
          label={finnFagsakYtelseTypeNavn(alleFagsakYtelseTyper, fagsakYtelseType.OMSORGSDAGER)}
        />
        <RadioOption
          value={fagsakYtelseType.PLEIEPENGER_SYKT_BARN}
          label={finnFagsakYtelseTypeNavn(alleFagsakYtelseTyper, fagsakYtelseType.PLEIEPENGER_SYKT_BARN)}
        />
        <RadioOption
          value=""
          label={<FormattedMessage id="FagsakYtelseTypeVelger.Alle" />}
        />
      </RadioGroupField>
    </div>
  );
};

export default FagsakYtelseTypeVelger;
