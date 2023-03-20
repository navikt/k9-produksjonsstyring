import React, { FunctionComponent, useState } from 'react';
import { WrappedComponentProps, injectIntl, useIntl } from 'react-intl';
import { RestApiGlobalStatePathsKeys } from 'api/k9LosApi';
import { useGlobalStateRestApiData } from 'api/rest-api-hooks';
import useKodeverk from 'api/rest-api-hooks/src/global-data/useKodeverk';
import GrafContainer from 'avdelingsleder/GrafContainer';
import HistorikkGrafForPunsj from 'avdelingsleder/nokkeltall/HistorikkGrafForPunsj';
import { ALLE_YTELSETYPER_VALGT, UKE_2, UKE_4, filtrereNyePerDato } from 'avdelingsleder/nokkeltall/nokkeltallUtils';
import AlleKodeverk from 'kodeverk/alleKodeverkTsType';
import fagsakYtelseType from 'kodeverk/fagsakYtelseType';
import kodeverkTyper from 'kodeverk/kodeverkTyper';
import { getValueFromLocalStorage } from 'utils/localStorageHelper';
import HistorikkGraf from '../../HistorikkGraf';
import HistoriskData from '../../historiskDataTsType';

interface OwnProps {
	beholdningPerDato?: HistoriskData[];
}

const id = 'beholdningForm';

/**
 * BeholdningHistorikkPanel.
 */
export const BeholdningHistorikkPanel: FunctionComponent<OwnProps & WrappedComponentProps> = ({
	beholdningPerDato,
}) => {
	const intl = useIntl();
	const behandlingTyper = useKodeverk(kodeverkTyper.BEHANDLING_TYPE);
	const [valgtYtelseType, setValgtYtelseType] = useState<string>(
		getValueFromLocalStorage(`${id}-ytelsestype`) || ALLE_YTELSETYPER_VALGT,
	);

	const [antallUkerSomSkalVises, setAntallUkerSomSkalVises] = useState<string>(
		getValueFromLocalStorage(`${id}-uker`) || UKE_2,
	);

	const alleKodeverk: AlleKodeverk = useGlobalStateRestApiData(RestApiGlobalStatePathsKeys.KODEVERK);

	return (
		<GrafContainer
			valgtYtelseType={valgtYtelseType}
			antallUkerSomSkalVises={antallUkerSomSkalVises}
			setValgtYtelseType={setValgtYtelseType}
			setAntallUkerSomSkalVises={setAntallUkerSomSkalVises}
			tittel={intl.formatMessage({ id: 'BeholdningHistorikkPanel.Beholdning' })}
			id={id}
		>
			<>
				{valgtYtelseType === fagsakYtelseType.PUNSJ && (
					<HistorikkGrafForPunsj
						isFireUkerValgt={antallUkerSomSkalVises === UKE_4}
						historiskData={filtrereNyePerDato(valgtYtelseType, antallUkerSomSkalVises, beholdningPerDato, alleKodeverk)}
					/>
				)}

				{valgtYtelseType !== fagsakYtelseType.PUNSJ && (
					<HistorikkGraf
						isFireUkerValgt={antallUkerSomSkalVises === UKE_4}
						behandlingTyper={behandlingTyper}
						historiskData={filtrereNyePerDato(valgtYtelseType, antallUkerSomSkalVises, beholdningPerDato, alleKodeverk)}
					/>
				)}
			</>
		</GrafContainer>
	);
};

export default injectIntl(BeholdningHistorikkPanel);
