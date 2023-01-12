import React from 'react';

import { Heading, Panel, Select, TextField } from "@navikt/ds-react";

import { FeltverdiOppgavefilter, Oppgavefelt } from '../filterTsTypes';
import { kodeFraKey, områdeFraKey, feltverdiKey } from '../utils'

import FjernFilterButton from './FjernFilterButton';

import styles from '../filterIndex.less';

interface OwnProps {
   felter: Oppgavefelt[],
   oppgavefilter: FeltverdiOppgavefilter,
   onOppdaterFilter: (id: String, data: object) => void;
   onFjernFilter: (oppgavefilter: Oppgavefilter) => void;
}

const FeltverdiOppgavefilterPanel = ({felter, oppgavefilter, onOppdaterFilter, onFjernFilter}): OwnProps => {
    const handleChangeKey = (event) => {
        onOppdaterFilter(oppgavefilter.id, {
            "område" : områdeFraKey(event.target.value),
            "kode" : kodeFraKey(event.target.value)
        });
    };

    const handleChangeOperator = (event) => {
        onOppdaterFilter(oppgavefilter.id, {
            "operator" : event.target.value
        });
    };

    const handleChangeValue = (event) => {
        onOppdaterFilter(oppgavefilter.id, {
            "verdi" : event.target.value
        });
    };

    return (
        <Panel className={styles.filter + " " + styles.filterFelt} key={oppgavefilter.id} border>
            <FjernFilterButton oppgavefilter={oppgavefilter} onFjernFilter={onFjernFilter} />
            <Heading level="5" size="xsmall">Felt</Heading>
            <Select defaultValue={feltverdiKey(oppgavefilter)} onBlur={handleChangeKey}>
                <option value="">Velg felt</option>
                {
                    felter.map((feltdefinisjon) => {
                        return <option value={feltverdiKey(feltdefinisjon)}>{feltdefinisjon.visningsnavn}</option>
                    })
                }
            </Select>
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
            <TextField defaultValue={oppgavefilter.verdi} onBlur={handleChangeValue}/>
        </Panel>
    );
};

export default FeltverdiOppgavefilterPanel;
