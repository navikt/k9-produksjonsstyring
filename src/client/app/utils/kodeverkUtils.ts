import AlleKodeverk from 'kodeverk/alleKodeverkTsType';
import KodeverkType from 'kodeverk/kodeverkTyper';

export const getKodeverknavnFraKode = (
    kode: string,
    kodeverkType: KodeverkType,
    alleKodeverk: AlleKodeverk,
): string => {
    const kodeverkForType = alleKodeverk[kodeverkType];
    if (!kodeverkForType || kodeverkForType.length === 0) {
        return '';
    }

    const kodeverk = kodeverkForType.find((k) => k.kode === kode);
    return kodeverk ? kodeverk.navn : '';
};

export const getKodeverkFraKode = (kode: string, kodeverkType: KodeverkType, alleKodeverk: AlleKodeverk): string => {
    const kodeverkForType = alleKodeverk[kodeverkType];
    if (!kodeverkForType || kodeverkForType.length === 0) {
        return '';
    }

    const kodeverk = kodeverkForType.find((k) => k.kode === kode);
    return kodeverk ? kodeverk.kodeverk : '';
};

export const getKodeverknavnFn =
    (alleKodeverk: AlleKodeverk) =>
    (kode: string, kodeverkType: KodeverkType): string =>
        getKodeverknavnFraKode(kode, kodeverkType, alleKodeverk);
