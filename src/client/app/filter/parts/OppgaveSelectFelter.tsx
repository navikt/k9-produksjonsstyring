import React from 'react';

import { Add, Delete } from "@navikt/ds-icons";
import { Button, Select } from "@navikt/ds-react";

import { SelectFelt, FilterContainer } from './filterTsTypes.ts';
import { feltverdiKey, visningsnavnForFelt } from '../utils.ts'

import styles from './OppgaveSelectFelter.less';

interface OwnProps {
   felter: Oppgavefelt[],
   oppgaveQuery: OppgaveQuery,
   onLeggTil: (fc: FilterContainer) => void,
   onOppdater: (sf: SelectFelt) => void,
   onFjern: (sf: SelectFelt) => void;
}

const renderSelectFelt = (felter, felt, onOppdater, onFjern) => {
    return (<div className={styles.selectEnkelFelt} key={felt.id}>
        <Select defaultValue={feltverdiKey(felt)} onBlur={() => onOppdater(felt)}>
            <option value="">Velg felt</option>
            {
            felter.map(function(feltdefinisjon, i) {
                return <option value={feltverdiKey(feltdefinisjon)}>{feltdefinisjon.visningsnavn}</option>
            })
            }
        </Select>
        { renderFjernSelectFeltKnapp(felt, onFjern) }
        </div>);
};

const renderFjernSelectFeltKnapp = (felt, onFjern) => {
    return <Button icon={<Delete aria-hidden />} size="medium" variant="tertiary" onClick={() => onFjern(felt)}></Button>
}

const renderAddEnkelSelectFeltKnapp = (filterContainer, onLeggTil) => {
    return <Button className={styles.selectLeggTil} icon={<Add aria-hidden />} size="xsmall" variant="tertiary" onClick={() => onLeggTil(filterContainer)}>Legg til felt</Button>
}

const OppgaveSelectFelter = ({ felter, oppgaveQuery, onLeggTil, onOppdater, onFjern}): OwnProps => {
  return (
    <div>
      {oppgaveQuery.select && oppgaveQuery.select.map(felt => renderSelectFelt(felter, felt, onOppdater, onFjern))}
      { renderAddEnkelSelectFeltKnapp(oppgaveQuery, onLeggTil) }
    </div>
  );
};

export default OppgaveSelectFelter;


