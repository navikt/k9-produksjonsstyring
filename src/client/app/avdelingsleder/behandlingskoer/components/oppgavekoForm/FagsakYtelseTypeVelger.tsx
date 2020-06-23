import React, { Fragment, FunctionComponent, useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import { Undertekst } from 'nav-frontend-typografi';

import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import { Kodeverk } from 'kodeverk/kodeverkTsType';
import fagsakYtelseType from 'kodeverk/fagsakYtelseType';
import { RadioGroupField, RadioOption } from 'form/FinalFields';
import kodeverkTyper from 'kodeverk/kodeverkTyper';

const finnFagsakYtelseTypeNavn = (fagsakYtelseTyper, valgtFagsakYtelseType) => {
  const type = fagsakYtelseTyper.find((fyt) => fyt.kode === valgtFagsakYtelseType);
  return type ? type.navn : '';
};

interface OwnProps {
  alleKodeverk: {[key: string]: Kodeverk[]};
  valgtOppgavekoId: string;
  lagreOppgavekoFagsakYtelseType: (oppgavekoId: string, fagsakYtelseType: Kodeverk) => void;
}

/**
 * FagsakYtelseTypeVelger
 */
const FagsakYtelseTypeVelger: FunctionComponent<OwnProps> = ({
  valgtOppgavekoId,
  lagreOppgavekoFagsakYtelseType,
  alleKodeverk,
}) => {
  const fagsakYtelseTyper = useMemo(() => alleKodeverk[kodeverkTyper.FAGSAK_YTELSE_TYPE],
    []);
  return (
    <>
      <Undertekst>
        <FormattedMessage id="FagsakYtelseTypeVelger.Stonadstype" />
      </Undertekst>
      <VerticalSpacer eightPx />
      <RadioGroupField
        name="fagsakYtelseType"
        onChange={(fyt) => lagreOppgavekoFagsakYtelseType(valgtOppgavekoId, fyt)}
      >
        <RadioOption
          value={fagsakYtelseType.OMSORGSPENGER}
          label={finnFagsakYtelseTypeNavn(fagsakYtelseTyper, fagsakYtelseType.OMSORGSPENGER)}
        />
        <RadioOption
          value={fagsakYtelseType.PLEIEPENGER_SYKT_BARN}
          label={finnFagsakYtelseTypeNavn(fagsakYtelseTyper, fagsakYtelseType.PLEIEPENGER_SYKT_BARN)}
        />
        <RadioOption
          value=""
          label={<FormattedMessage id="FagsakYtelseTypeVelger.Alle" />}
        />
      </RadioGroupField>
    </>
  );
};

export default FagsakYtelseTypeVelger;
