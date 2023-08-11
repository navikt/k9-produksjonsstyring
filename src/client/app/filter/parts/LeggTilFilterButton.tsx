import React from 'react';
import { Add } from '@navikt/ds-icons';
import { Button } from '@navikt/ds-react';
import { FilterContainer } from 'filter/filterTsTypes';
import styles from './LeggTilFilterButton.css';

interface OwnProps {
	filterContainer: FilterContainer;
	onLeggTilFilter: (fc: FilterContainer) => void;
}

const LeggTilFilterButton = ({ filterContainer, onLeggTilFilter }: OwnProps) => (
	<Button
		className={styles.filterLeggTil}
		icon={<Add aria-hidden />}
		variant="secondary"
		size="small"
		onClick={() => onLeggTilFilter(filterContainer)}
	>
		Legg til filter
	</Button>
);

export default LeggTilFilterButton;
