import React from 'react';

import { Add, Delete } from "@navikt/ds-icons";
import { Button, Select } from "@navikt/ds-react";

import { SelectFelt, FilterContainer } from '../filterTsTypes';
import { feltverdiKey } from '../utils'

import styles from './OppgaveSelectFelter.less';

interface OwnProps {
   felter: Oppgavefelt[],
   oppgaveQuery: OppgaveQuery,
   onLeggTil: (fc: FilterContainer) => void,
   onOppdater: (sf: SelectFelt, verdi: String) => void,
   onFjern: (sf: SelectFelt) => void;
}

const renderFjernSelectFeltKnapp = (felt, onFjern) => {
    return <Button icon={<Delete aria-hidden />} size="medium" variant="tertiary" onClick={() => onFjern(felt)}></Button>
}

const renderAddEnkelSelectFeltKnapp = (filterContainer, onLeggTil) => {
    return <Button className={styles.selectLeggTil} icon={<Add aria-hidden />} size="xsmall" variant="tertiary" onClick={() => onLeggTil(filterContainer)}>Legg til felt</Button>
}

const renderSelectFelt = (felter, felt, onOppdater, onFjern) => {
    return (<div className={styles.selectEnkelFelt} key={felt.id}>
        <Select defaultValue={feltverdiKey(felt)} onBlur={(event) => onOppdater(felt, event.target.value)}>
            <option value="">Velg felt</option>
            {
            felter.map((feltdefinisjon) => {
                return <option value={feltverdiKey(feltdefinisjon)}>{feltdefinisjon.visningsnavn}</option>
            })
            }
        </Select>
        { renderFjernSelectFeltKnapp(felt, onFjern) }
        </div>);
};

const OppgaveSelectFelter = ({ felter, oppgaveQuery, onLeggTil, onOppdater, onFjern}): OwnProps => {
  return (
    <div>
      {oppgaveQuery.select && oppgaveQuery.select.map(felt => renderSelectFelt(felter, felt, onOppdater, onFjern))}
      { renderAddEnkelSelectFeltKnapp(oppgaveQuery, onLeggTil) }
    </div>
  );
};

export default OppgaveSelectFelter;


