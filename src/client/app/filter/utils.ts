import dayjs from 'dayjs';
import { Oppgavefelt } from './filterTsTypes';

export function feltverdiKey(item) {
	return `${item.område !== null ? item.område : ''}__${item.kode}`;
}

export const visningsnavnForFelt = (felter: Oppgavefelt[], område: string, kode: string) => {
	const result = felter.find((felt) => felt.område === område && felt.kode === kode);
	if (result !== null) {
		return result.visningsnavn;
	}
	return kode;
};

export function områdeFraKey(key) {
	const område = key.split('__')[0];
	return område.length > 0 ? område : null;
}

export function kodeFraKey(key) {
	return key.split('__')[1];
}

export const mapBooleanToStringArray = (values: (string | null)[]): string[] =>
	values.map((value) => {
		if (value === 'true') {
			return 'ja';
		}
		if (value === 'false') {
			return 'nei';
		}
		return 'ikkeSatt';
	});

export const mapStringToBooleanArray = (values: string[]): (string | null)[] =>
	values.map((value) => {
		if (value === 'ja') {
			return 'true';
		}
		if (value === 'nei') {
			return 'false';
		}
		return null;
	});

export const calculateDays = (verdi: any[]): number | undefined => {
	if (!verdi || verdi.length === 0) return undefined;
	const totalDays = verdi.reduce((acc, curr) => {
		if (typeof curr === 'string' && dayjs(curr).isValid()) {
			const days = dayjs.duration(dayjs(curr).diff(dayjs().startOf('day'))).asDays();
			return Number.isNaN(days) ? acc : acc + days;
		}
		const days = dayjs.duration(curr).asDays();
		return Number.isNaN(days) ? acc : acc + days;
	}, 0);
	return totalDays;
};
