import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Delete } from '@navikt/ds-icons';
import { Button, Label } from '@navikt/ds-react';
import AppContext from 'app/AppContext';
import { FilterContext } from 'filter/FilterContext';
import { removeFilter } from 'filter/queryUtils';
import { FeltverdiOppgavefilter, Oppgavefelt } from '../filterTsTypes';
import { generateId } from './FeltverdiOppgavefilterPanel/idGenerator';
import KriterieOperator from './KriterieOperator';
import KriterieVerdi from './KriterieVerdi';

interface Props {
	køvisning: boolean;
	oppgavefilter: FeltverdiOppgavefilter;
}

const Kriterie: React.FC<Props> = ({ oppgavefilter, køvisning }) => {
	const testID = useMemo(() => generateId(), []);

	const { updateQuery } = useContext(FilterContext);
	const { felter: kriterierSomKanVelges } = useContext(AppContext);
	const [feltdefinisjon, setFeltdefinisjon] = useState<Oppgavefelt | undefined>();

	useEffect(() => {
		const feltdef = kriterierSomKanVelges.find(
			(fd) => fd.område === oppgavefilter.område && fd.kode === oppgavefilter.kode,
		);
		setFeltdefinisjon(feltdef);
	}, [kriterierSomKanVelges, oppgavefilter.område, oppgavefilter.kode]);

	const kriterieErPåkrevd = feltdefinisjon?.kode === 'oppgavestatus' && køvisning;

	return (
		<div id={`feltpanel-${testID}`} className="flex items-center gap-4 rounded bg-surface-selected py-4 pl-3 pr-1">
			<Label size="small" className="w-[6rem]">
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
			{!kriterieErPåkrevd && (
				<Button
					className="ml-auto"
					icon={<Delete aria-hidden />}
					size="small"
					variant="tertiary"
					onClick={() => updateQuery([removeFilter(oppgavefilter.id)])}
				/>
			)}
		</div>
	);
};

export default Kriterie;
