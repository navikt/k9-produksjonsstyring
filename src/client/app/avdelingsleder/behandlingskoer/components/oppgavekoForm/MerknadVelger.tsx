import React, { Fragment, FunctionComponent } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import kodeverkTyper from 'kodeverk/kodeverkTyper';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import { CheckboxField } from 'form/FinalFields';

import useRestApiRunner from 'api/rest-api-hooks/src/local-data/useRestApiRunner';
import useKodeverk from 'api/rest-api-hooks/src/global-data/useKodeverk';
import { K9LosApiKeys } from 'api/k9LosApi';
import { Label } from '@navikt/ds-react';
import KriterierType from '../../../../types/KriterierType';
import { Kriterie } from 'avdelingsleder/behandlingskoer/oppgavekoTsType';

interface OwnProps {
  valgtOppgavekoId: string;
  values: any;
  hentOppgaveko: (id: string) => void;
}

const MerknadVelger: FunctionComponent<OwnProps> = ({ valgtOppgavekoId, values, hentOppgaveko }) => {
  const merknadTyper: string[] = useKodeverk(kodeverkTyper.MERKNAD_TYPE);
  const { startRequest: lagreOppgavekoMerknader } = useRestApiRunner(K9LosApiKeys.LAGRE_OPPGAVEKO_KRITERIER);
  const intl = useIntl();

  const merknadValues = values['kriterier'].filter(
    (kriterier: Kriterie) => kriterier.kriterierType.kode === KriterierType.MerknadType,
  );
  const aktiveMerknader = merknadValues[0]?.koder || [];
  return (
    <>
      <Label size="small" style={{ color: '#262626' }}>
        <FormattedMessage id="UtvalgskriterierForOppgavekoForm.Merknader" />
      </Label>
      {merknadTyper.map(merknad => (
        <Fragment key={merknad}>
          <VerticalSpacer fourPx />
          <CheckboxField
            key={merknad}
            name={merknad}
            label={intl.formatMessage({ id: `Merknad.${merknad}` })}
            checked={aktiveMerknader.includes(merknad)}
            onChange={isChecked =>
              lagreOppgavekoMerknader({
                id: valgtOppgavekoId,
                kriterierType: KriterierType.MerknadType,
                koder: isChecked
                  ? [...aktiveMerknader, merknad]
                  : aktiveMerknader.filter(aktivMerknad => aktivMerknad !== merknad),
              }).then(() => {
                hentOppgaveko(valgtOppgavekoId);
              })
            }
          />
        </Fragment>
      ))}
      <VerticalSpacer twentyPx />
    </>
  );
};

export default MerknadVelger;
