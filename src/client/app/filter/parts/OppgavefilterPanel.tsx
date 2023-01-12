import React from 'react';

import { Heading, Panel } from "@navikt/ds-react";

import { FilterContainer, Oppgavefilter } from '../filterTsTypes';
import FeltverdiOppgavefilterPanel from './FeltverdiOppgavefilterPanel';
import FjernFilterButton from './FjernFilterButton';
import LeggTilFilterButton from './LeggTilFilterButton';
import LeggTilGruppeButton from './LeggTilGruppeButton';

import styles from '../filterIndex.less';

interface OppgavefilterPanelProps {
    felter: Oppgavefelt[],
    oppgavefilter: Oppgavefilter,
    onLeggTilFilter: (fc: FilterContainer) => void,
    onLeggTilGruppe: (fc: FilterContainer) => void,
    onOppdaterFilter: (id: String, data: object) => void;
    onFjernFilter: (oppgavefilter: Oppgavefilter) => void;
}

const OppgavefilterPanel = ({felter, oppgavefilter, onLeggTilFilter, onLeggTilGruppe, onOppdaterFilter, onFjernFilter}): OppgavefilterPanelProps => {
    if (oppgavefilter.type === "feltverdi") {
        return (<FeltverdiOppgavefilterPanel felter={felter} oppgavefilter={oppgavefilter} onOppdaterFilter={onOppdaterFilter} onFjernFilter={onFjernFilter} />);
    } else if (oppgavefilter.type === "combine") {
        return (<CombineOppgavefilterPanel felter={felter} oppgavefilter={oppgavefilter}
                onLeggTilFilter={onLeggTilFilter} onLeggTilGruppe={onLeggTilGruppe}
                onOppdaterFilter={onOppdaterFilter} onFjernFilter={onFjernFilter} />);
    } else {
        throw new Error("Unhandled type: " + oppgavefilter.type);
    }
}

interface CombineOppgavefilterPanelProps {
    felter: Oppgavefelt[],
    oppgavefilter: Oppgavefilter,
    onLeggTilFilter: (fc: FilterContainer) => void,
    onLeggTilGruppe: (fc: FilterContainer) => void,
    onOppdaterFilter: (id: String, data: object) => void;
    onFjernFilter: (oppgavefilter: Oppgavefilter) => void;
}

const CombineOppgavefilterPanel = ({felter, oppgavefilter, onLeggTilFilter, onLeggTilGruppe, onOppdaterFilter, onFjernFilter}): CombineOppgavefilterPanelProps => {
    return (
        <Panel className={styles.filter + " " + styles.filterGruppe} key={oppgavefilter.id} border>
            <FjernFilterButton oppgavefilter={oppgavefilter} onFjernFilter={onFjernFilter} />
            <Heading level="5" size="xsmall">{(oppgavefilter.combineOperator === "OR") ? "Minimum en av disse må gjelde for oppgaven" : "Alle disse må gjelde for oppgaven"}</Heading>
            { oppgavefilter.filtere.map((item) => (
                <OppgavefilterPanel felter={felter} oppgavefilter={item}
                        onLeggTilFilter={onLeggTilFilter} onLeggTilGruppe={onLeggTilGruppe}
                        onOppdaterFilter={onOppdaterFilter} onFjernFilter={onFjernFilter} />
            ))}
            <LeggTilFilterButton filterContainer={oppgavefilter} onLeggTilFilter={onLeggTilFilter} />
            <LeggTilGruppeButton filterContainer={oppgavefilter} onLeggTilGruppe={onLeggTilGruppe} />
        </Panel>
    );
};

export default OppgavefilterPanel;
