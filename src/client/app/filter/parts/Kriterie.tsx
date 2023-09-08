import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Delete } from '@navikt/ds-icons';
import { Button, Label } from '@navikt/ds-react';
import {FilterContext} from 'filter/FilterContext';
import { FeltverdiOppgavefilter, Oppgavefelt } from '../filterTsTypes';
import { generateId } from './FeltverdiOppgavefilterPanel/idGenerator';
import KriterieOperator from './KriterieOperator';
import KriterieVerdi from './KriterieVerdi';

interface Props {
	oppgavefilter: FeltverdiOppgavefilter;
}

const Kriterie: React.FC<Props> = ({ oppgavefilter }) => {
	const testID = useMemo(() => generateId(), []);

	const { kriterierSomKanVelges, fjernFilter } = useContext(FilterContext);
	const [feltdefinisjon, setFeltdefinisjon] = useState<Oppgavefelt | undefined>();

	useEffect(() => {
		const feltdef = kriterierSomKanVelges.find(
			(fd) => fd.område === oppgavefilter.område && fd.kode === oppgavefilter.kode,
		);
		setFeltdefinisjon(feltdef);
	}, [kriterierSomKanVelges, oppgavefilter.område, oppgavefilter.kode]);

	return (
		<div id={`feltpanel-${testID}`} className="flex items-center gap-4 rounded bg-surface-selected py-4 pl-3 pr-1">
			<Label size="small" className="max-w-[7rem]">
				{feltdefinisjon?.visningsnavn}:
			</Label>
			{oppgavefilter.kode && (
				<div className="flex gap-4">
					<div className="self-center">
						<KriterieOperator oppgavefilter={oppgavefilter} />
					</div>
					<div className="self-center">
						<KriterieVerdi feltdefinisjon={feltdefinisjon} oppgavefilter={oppgavefilter} />
					</div>
				</div>
			)}
			<Button
				className="ml-auto"
				icon={<Delete aria-hidden />}
				size="small"
				variant="tertiary"
				onClick={() => fjernFilter(oppgavefilter.id)}
			/>
		</div>
	);
};

export default Kriterie;
