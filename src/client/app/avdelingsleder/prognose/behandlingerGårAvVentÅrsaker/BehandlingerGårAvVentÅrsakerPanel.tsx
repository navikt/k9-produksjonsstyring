import React, { FunctionComponent, useState } from 'react';
import { useIntl } from 'react-intl';
import GrafContainer from 'avdelingsleder/GrafContainer';
import { ALLE_YTELSETYPER_VALGT, UKE_2 } from 'avdelingsleder/nokkeltall/nokkeltallUtils';
import { getValueFromLocalStorage } from 'utils/localStorageHelper';
import { IBehandlingerSomGarAvVentType } from '../behandlingerGårAvVent/behandlingerSomGårAvVentType';
import BehandlingerGårAvVentÅrsakerDiagram from './BehandlingerGårAvVentÅrsakerDiagram';

const BehandlingerGårAvVentÅrsakerPanel: FunctionComponent<{
	påVentMedVenteårsak: IBehandlingerSomGarAvVentType[];
}> = ({ påVentMedVenteårsak }) => {
	const id = 'behandlingerSomGaarAvVentAarsaker';
	const [valgtYtelseType, setValgtYtelseType] = useState<string>(
		getValueFromLocalStorage(`${id}-ytelsestype`) || ALLE_YTELSETYPER_VALGT,
	);

	const [antallUkerSomSkalVises, setAntallUkerSomSkalVises] = useState<string>(
		getValueFromLocalStorage(`${id}-uker`) || UKE_2,
	);

	const intl = useIntl();

	const behandlingerSomGaarAvVentAarsakerVisning = () => (
		<BehandlingerGårAvVentÅrsakerDiagram
			behandlingerGaarAvVentAarsaker={påVentMedVenteårsak}
			valgtYtelseType={valgtYtelseType}
			antallUkerSomSkalVises={antallUkerSomSkalVises}
		/>
	);
	return (
		<GrafContainer
			id={id}
			valgtYtelseType={valgtYtelseType}
			antallUkerSomSkalVises={antallUkerSomSkalVises}
			setValgtYtelseType={setValgtYtelseType}
			setAntallUkerSomSkalVises={setAntallUkerSomSkalVises}
			tittel={intl.formatMessage({ id: 'BehandlingerGårAvVentÅrsaker.Tittel' })}
			fremITid
		>
			{behandlingerSomGaarAvVentAarsakerVisning()}
		</GrafContainer>
	);
};
export default BehandlingerGårAvVentÅrsakerPanel;
