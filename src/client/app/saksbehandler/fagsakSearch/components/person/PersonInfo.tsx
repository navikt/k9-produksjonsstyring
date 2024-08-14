import React, { FunctionComponent } from 'react';
import { FigureInwardIcon, FigureOutwardIcon } from '@navikt/aksel-icons';
import { Detail, Heading } from '@navikt/ds-react';
import Person from '../../personTsType';
import AlderVisning from './Aldervisning';
import * as styles from './personInfo.css';

interface OwnProps {
	person: Person;
}

/**
 * PersonInfo
 *
 * Presentasjonskomponent. Definerer visning av personen relatert til fagsak. (Søker)
 *
 * Eksempel:
 * ```html
 * <PersonInfo person={navn:"Ola" alder:{40} personnummer:"12345678910" erKvinne:false
 * erDod:false diskresjonskode:"6" dodsdato:"1990.03.03"} medPanel />
 * ```
 */
const PersonInfo: FunctionComponent<OwnProps> = ({ person }) => {
	const { navn, personnummer, kjoenn, doedsdato } = person;
	return (
		<div>
			{kjoenn === 'KVINNE' ? <FigureOutwardIcon /> : <FigureInwardIcon />}
			<div className={styles.infoPlaceholder}>
				<div>
					<Heading size="small">
						{navn} {doedsdato && <AlderVisning doedsdato={doedsdato} />}
					</Heading>
					<Detail>{personnummer}</Detail>
				</div>
			</div>
		</div>
	);
};

export default PersonInfo;
