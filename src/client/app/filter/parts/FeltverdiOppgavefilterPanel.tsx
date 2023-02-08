import React from 'react';

import { Checkbox, Heading, Panel, Select, TextField } from '@navikt/ds-react';

import { FeltverdiOppgavefilter, Oppgavefelt } from '../filterTsTypes';
import { kodeFraKey, områdeFraKey, feltverdiKey } from '../utils';

import FjernFilterButton from './FjernFilterButton';

import styles from '../filterIndex.css';

interface OwnProps {
  felter: Oppgavefelt[];
  oppgavefilter: FeltverdiOppgavefilter;
  onOppdaterFilter: (id: string, data: object) => void;
  onFjernFilter: (oppgavefilter: Oppgavefilter) => void;
}

function renderFilterOperator(oppgavefilter: Oppgavefilter, onOppdaterFilter: (id: string, data: object) => void) {
  const handleChangeOperator = event => {
    onOppdaterFilter(oppgavefilter.id, {
      operator: event.target.value,
    });
  };

  return (
    <Select defaultValue={oppgavefilter.operator} onBlur={handleChangeOperator}>
      <option value="EQUALS">er lik</option>
      <option value="NOT_EQUALS">er IKKE lik</option>
      <option value="IN">inneholder</option>
      <option value="NOT_IN">inneholder IKKE</option>
      <option value="LESS_THAN">mindre enn (&#60;)</option>
      <option value="GREATER_THAN">større enn (&#62;)</option>
      <option value="LESS_THAN_OR_EQUALS">mindre enn eller lik (&#60;=)</option>
      <option value="GREATER_THAN_OR_EQUALS">større enn eller lik (&#62;=)</option>
    </Select>
  );
}

function renderFilterOperatorOgVerdi(
  feltdefinisjon,
  oppgavefilter: Oppgavefilter,
  onOppdaterFilter: (id: string, data: object) => void,
) {
  if (feltdefinisjon.tolkes_som === 'boolean') {
    const handleChangeValue = event => {
      onOppdaterFilter(oppgavefilter.id, {
        verdi: event.target.checked.toString(),
      });
    };

    /* TODO: Endre til ja/nei/ikke-satt */

    return (
      <Checkbox defaultValue={oppgavefilter.verdi} onChange={handleChangeValue}>
        Ja
      </Checkbox>
    );
  }

  const handleChangeValue = event => {
    onOppdaterFilter(oppgavefilter.id, {
      verdi: event.target.value,
    });
  };

  return (
    <>
      {renderFilterOperator(oppgavefilter, onOppdaterFilter)}
      <TextField defaultValue={oppgavefilter.verdi} onBlur={handleChangeValue} />
    </>
  );
}

function finnFeltdefinisjon(felter, område: string, kode: string) {
  return felter.find(fd => fd.område === område && fd.kode === kode);
}

const FeltverdiOppgavefilterPanel = ({ felter, oppgavefilter, onOppdaterFilter, onFjernFilter }): OwnProps => {
  const handleChangeKey = event => {
    const område = områdeFraKey(event.target.value);
    const kode = kodeFraKey(event.target.value);
    const feltdefinisjon = finnFeltdefinisjon(felter, område, kode);

    if (feltdefinisjon && feltdefinisjon.tolkes_som === 'boolean') {
      onOppdaterFilter(oppgavefilter.id, {
        område,
        kode,
        operator: 'EQUALS',
        verdi: 'false',
      });
    } else {
      onOppdaterFilter(oppgavefilter.id, {
        område,
        kode,
        operator: 'EQUALS',
        verdi: '',
      });
    }
  };

  const feltdefinisjon = finnFeltdefinisjon(felter, oppgavefilter.område, oppgavefilter.kode);

  return (
    <Panel className={`${styles.filter} ${styles.filterFelt}`} key={oppgavefilter.id} border>
      <FjernFilterButton oppgavefilter={oppgavefilter} onFjernFilter={onFjernFilter} />
      <Heading level="5" size="xsmall">
        Felt
      </Heading>
      <div>
        <Select defaultValue={feltverdiKey(oppgavefilter)} onChange={handleChangeKey}>
          <option value="">Velg felt</option>
          {felter.map(fd => (
            <option key={feltverdiKey(fd)} value={feltverdiKey(fd)}>
              {fd.visningsnavn}
            </option>
          ))}
        </Select>
        {oppgavefilter.kode && renderFilterOperatorOgVerdi(feltdefinisjon, oppgavefilter, onOppdaterFilter)}
      </div>
    </Panel>
  );
};

export default FeltverdiOppgavefilterPanel;
