import React from 'react';

import { Add, Delete } from '@navikt/ds-icons';
import { Button, Select } from '@navikt/ds-react';

import { SelectFelt, FilterContainer } from '../filterTsTypes';
import { feltverdiKey } from '../utils';

import styles from './OppgaveSelectFelter.css';

interface OwnProps {
  felter: Oppgavefelt[];
  oppgaveQuery: OppgaveQuery;
  onLeggTil: (fc: FilterContainer) => void;
  onOppdater: (sf: SelectFelt, verdi: string) => void;
  onFjern: (sf: SelectFelt) => void;
}

const renderFjernSelectFeltKnapp = (felt, onFjern) => (
  <Button icon={<Delete aria-hidden />} size="medium" variant="tertiary" onClick={() => onFjern(felt)} />
);

const renderAddEnkelSelectFeltKnapp = (filterContainer, onLeggTil) => (
  <Button
    className={styles.selectLeggTil}
    icon={<Add aria-hidden />}
    size="xsmall"
    variant="tertiary"
    onClick={() => onLeggTil(filterContainer)}
  >
    Legg til felt
  </Button>
);

const renderSelectFelt = (felter, felt, onOppdater, onFjern) => (
  <div className={styles.selectEnkelFelt} key={felt.id}>
    <Select
      className={styles.noGap}
      defaultValue={feltverdiKey(felt)}
      onBlur={event => onOppdater(felt, event.target.value)}
    >
      <option value="">Velg felt</option>
      {felter.map(feltdefinisjon => (
        <option key={feltverdiKey(feltdefinisjon)} value={feltverdiKey(feltdefinisjon)}>
          {feltdefinisjon.visningsnavn}
        </option>
      ))}
    </Select>
    {renderFjernSelectFeltKnapp(felt, onFjern)}
  </div>
);

const OppgaveSelectFelter = ({ felter, oppgaveQuery, onLeggTil, onOppdater, onFjern }): OwnProps => (
  <div>
    {oppgaveQuery.select && oppgaveQuery.select.map(felt => renderSelectFelt(felter, felt, onOppdater, onFjern))}
    {renderAddEnkelSelectFeltKnapp(oppgaveQuery, onLeggTil)}
  </div>
);

export default OppgaveSelectFelter;
