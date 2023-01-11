import React from 'react';

import { Add } from "@navikt/ds-icons";
import { Button } from "@navikt/ds-react";

import styles from './LeggTilGruppeButton.less';

interface OwnProps {
   filterContainer: FilterContainer,
   onLeggTilGruppe: (fc: FilterContainer) => void,
}


const LeggTilGruppeButton = ({filterContainer, onLeggTilFilter}): OwnProps => {
    return <Button className={styles.filterLeggTil} icon={<Add aria-hidden />} size="xsmall" variant="tertiary" onClick={() => onLeggTilGruppe(filterContainer)}>Legg til gruppe</Button>
}

export default LeggTilGruppeButton;
