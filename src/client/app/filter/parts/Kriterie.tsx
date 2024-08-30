import React, { useContext, useEffect, useMemo, useState } from 'react';
import { TrashIcon } from '@navikt/aksel-icons';
import { Button, Label } from '@navikt/ds-react';
import AppContext from 'app/AppContext';
import { FilterContext } from 'filter/FilterContext';
import { aksjonspunktKoder } from 'filter/konstanter';
import { removeFilter } from 'filter/queryUtils';
import { FeltverdiOppgavefilter, Oppgavefelt, OppgavefilterKode } from '../filterTsTypes';
import { Aksjonspunktvisning } from './Aksjonspunktvisning';
import { generateId } from './FeltverdiOppgavefilterPanel/idGenerator';
import KriterieOperator from './KriterieOperator';
import KriterieVerdi from './KriterieVerdi';

interface Props {
	oppgavefilter: FeltverdiOppgavefilter;
	paakrevdeKoder: OppgavefilterKode[];
}

const erAksjonspunktFelt = (feltdefinisjon) => aksjonspunktKoder.includes(feltdefinisjon.kode);

const Kriterie: React.FC<Props> = ({ oppgavefilter, paakrevdeKoder = [] }) => {
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

	const kriterieErPåkrevd = paakrevdeKoder.some((v) => v === feltdefinisjon?.kode);
	return (
		<div id={`feltpanel-${testID}`} className="rounded bg-surface-selected p-4">
			<div className="flex gap-4">
				<Label size="small" className="min-w-[10rem] w-[10rem]">
					{feltdefinisjon?.visningsnavn}:
				</Label>
				{oppgavefilter.kode && (
					<div className="flex grow gap-4">
						<KriterieOperator oppgavefilter={oppgavefilter} />
						<div className="grow">
							<KriterieVerdi feltdefinisjon={feltdefinisjon} oppgavefilter={oppgavefilter} />
						</div>
					</div>
				)}
				{!kriterieErPåkrevd && (
					<div>
						<Button
							className="ml-auto"
							icon={<TrashIcon />}
							size="small"
							variant="tertiary"
							onClick={() => updateQuery([removeFilter(oppgavefilter.id)])}
						/>
					</div>
				)}
			</div>
			{feltdefinisjon && erAksjonspunktFelt(feltdefinisjon) && <Aksjonspunktvisning oppgavefilter={oppgavefilter} />}
		</div>
	);
};

export default Kriterie;
