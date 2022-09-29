import { K9LosApiKeys } from 'api/k9LosApi';
import useRestApiRunner from 'api/rest-api-hooks/src/local-data/useRestApiRunner';
import { Saksbehandler } from 'avdelingsleder/bemanning/saksbehandlerTsType';
import React, { FunctionComponent } from 'react';
import { FormattedMessage } from 'react-intl';
import SearchWithDropdown from 'sharedComponents/SearchWithDropdown';
import { Oppgaveko } from '../../oppgavekoTsType';

import styles from './saksbehandlereForOppgavekoForm.less';

interface OwnProps {
  valgtOppgaveko: Oppgaveko;
  alleSaksbehandlere: Saksbehandler[];
  hentOppgaveko: (id: string) => void;
}

/**
 * SaksbehandlereForOppgavekoForm
 */
const SaksbehandlereForOppgavekoForm: FunctionComponent<OwnProps> = ({
  valgtOppgaveko,
  alleSaksbehandlere,
  hentOppgaveko,
}) => {
  const { startRequest: knyttSaksbehandlerTilOppgaveko } = useRestApiRunner(K9LosApiKeys.LAGRE_OPPGAVEKO_SAKSBEHANDLER);

  const formaterteSaksbehandlere = alleSaksbehandlere.map(saksbehandler => ({
    value: saksbehandler.epost,
    label: saksbehandler.navn,
    group: saksbehandler.enhet,
  }));

  const grupper = [...new Set(formaterteSaksbehandlere.map(oppgavekode => oppgavekode.group))].sort();

  const handleSaksbehandlerChange = (saksbehandlere: string[]) =>
    knyttSaksbehandlerTilOppgaveko({}).then(() => {
      hentOppgaveko(valgtOppgaveko.id);
    });

  const valgteSaksbehandlere = valgtOppgaveko?.saksbehandlere?.map(sb => sb.epost) || [];

  return (
    <div className={styles.panel}>
      {alleSaksbehandlere.length === 0 && <FormattedMessage id="SaksbehandlereForOppgavekoForm.IngenSaksbehandlere" />}
      {alleSaksbehandlere.length > 0 && (
        <SearchWithDropdown
          label="Velg saksbehandlere"
          suggestions={formaterteSaksbehandlere}
          groups={grupper}
          addButtonText="Legg til saksbehandlere"
          heading="Velg saksbehandlere"
          updateSelection={handleSaksbehandlerChange}
          selectedValues={valgteSaksbehandlere}
        />
      )}
    </div>
  );
};

export default SaksbehandlereForOppgavekoForm;
