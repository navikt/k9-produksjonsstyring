import kodeverkTyper from 'kodeverk/kodeverkTyper';
import React, { FunctionComponent } from 'react';

import { K9LosApiKeys } from 'api/k9LosApi';
import { useRestApiRunner } from 'api/rest-api-hooks';
import useKodeverk from 'api/rest-api-hooks/src/global-data/useKodeverk';
import { Oppgaveko } from 'avdelingsleder/behandlingskoer/oppgavekoTsType';
import SearchWithDropdown from 'sharedComponents/SearchWithDropdown';
import KriterierType from '../../../../types/KriterierType';
import styles from './andreKriterierVelger.less';

interface OwnProps {
  valgtOppgavekoId: string;
  values: Oppgaveko;
  hentOppgaveko: (id: string) => void;
}

/**
 * AndreKriterierVelger
 */
const AndreKriterierVelger: FunctionComponent<OwnProps> = ({ valgtOppgavekoId, values, hentOppgaveko }) => {
  const { startRequest: lagreOppgavekoKoder } = useRestApiRunner(K9LosApiKeys.LAGRE_OPPGAVEKO_KRITERIER);

  const andreKriterierTyper = useKodeverk(kodeverkTyper.OPPGAVE_KODE);
  const formaterteOppgavekoder = andreKriterierTyper
    .map(oppgavekode => ({
      value: oppgavekode.kode,
      label: oppgavekode.navn,
      group: oppgavekode.gruppering,
    }))
    .sort((a, b) => Number(a.value) - Number(b.value));
  const grupper = [...new Set(formaterteOppgavekoder.map(oppgavekode => oppgavekode.group))].sort();
  const valgteKoder =
    values?.kriterier?.find(kriterie => kriterie.kriterierType.kode === KriterierType.OppgvekodeType)?.koder || [];
  const handleOppgavekodeChange = (koder: string[]) =>
    lagreOppgavekoKoder({
      id: valgtOppgavekoId,
      kriterierType: KriterierType.OppgvekodeType,
      koder,
    }).then(() => {
      hentOppgaveko(valgtOppgavekoId);
    });

  return (
    <div className={styles.container}>
      <SearchWithDropdown
        label="Velg aksjonspunkt"
        suggestions={formaterteOppgavekoder}
        groups={grupper}
        addButtonText="Legg til aksjonspunkt"
        heading="Velg aksjonspunkter"
        updateSelection={handleOppgavekodeChange}
        selectedValues={valgteKoder}
      />
    </div>
  );
};

export default AndreKriterierVelger;
