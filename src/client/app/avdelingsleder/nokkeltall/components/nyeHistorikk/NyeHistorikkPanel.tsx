import React, { FunctionComponent, useState } from 'react';
import { useIntl } from 'react-intl';
import { RestApiGlobalStatePathsKeys } from 'api/k9LosApi';
import { useGlobalStateRestApiData } from 'api/rest-api-hooks';
import useKodeverk from 'api/rest-api-hooks/src/global-data/useKodeverk';
import GrafContainer from 'avdelingsleder/GrafContainer';
import HistorikkGraf from 'avdelingsleder/nokkeltall/HistorikkGraf';
import HistorikkGrafForPunsj from 'avdelingsleder/nokkeltall/HistorikkGrafForPunsj';
import { ALLE_YTELSETYPER_VALGT, UKE_2, UKE_4, filtrereNyePerDato } from 'avdelingsleder/nokkeltall/nokkeltallUtils';
import AlleKodeverk from 'kodeverk/alleKodeverkTsType';
import fagsakYtelseType from 'kodeverk/fagsakYtelseType';
import kodeverkTyper from 'kodeverk/kodeverkTyper';
import { getValueFromLocalStorage } from 'utils/localStorageHelper';
import HistoriskData from '../../historiskDataTsType';

interface OwnProps {
    nyePerDato?: HistoriskData[];
}

export const NyeHistorikkPanel: FunctionComponent<OwnProps> = ({ nyePerDato }) => {
    const id = 'nyeBehandlinger';
    const [valgtYtelseType, setValgtYtelseType] = useState<string>(
        getValueFromLocalStorage(`${id}-ytelsestype`) || ALLE_YTELSETYPER_VALGT,
    );
    const [antallUkerSomSkalVises, setAntallUkerSomSkalVises] = useState<string>(
        getValueFromLocalStorage(`${id}-uker`) || UKE_2,
    );
    const intl = useIntl();
    const behandlingTyper = useKodeverk(kodeverkTyper.BEHANDLING_TYPE);
    const alleKodeverk: AlleKodeverk = useGlobalStateRestApiData(RestApiGlobalStatePathsKeys.KODEVERK);

    return (
        <GrafContainer
            valgtYtelseType={valgtYtelseType}
            antallUkerSomSkalVises={antallUkerSomSkalVises}
            setValgtYtelseType={setValgtYtelseType}
            setAntallUkerSomSkalVises={setAntallUkerSomSkalVises}
            tittel={intl.formatMessage({ id: 'NyeHistorikkPanel.Nye' })}
            id={id}
        >
            <>
                {valgtYtelseType === fagsakYtelseType.PUNSJ && (
                    <HistorikkGrafForPunsj
                        isFireUkerValgt={antallUkerSomSkalVises === UKE_4}
                        historiskData={filtrereNyePerDato(
                            valgtYtelseType,
                            antallUkerSomSkalVises,
                            nyePerDato,
                            alleKodeverk,
                        )}
                    />
                )}

                {valgtYtelseType !== fagsakYtelseType.PUNSJ && (
                    <HistorikkGraf
                        isFireUkerValgt={antallUkerSomSkalVises === UKE_4}
                        behandlingTyper={behandlingTyper}
                        historiskData={filtrereNyePerDato(
                            valgtYtelseType,
                            antallUkerSomSkalVises,
                            nyePerDato,
                            alleKodeverk,
                        )}
                    />
                )}
            </>
        </GrafContainer>
    );
};

export default NyeHistorikkPanel;
