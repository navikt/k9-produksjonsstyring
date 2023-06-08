import React from 'react';
import dayjs from 'dayjs';
import durationPlugin from 'dayjs/plugin/duration';
import { Oppgavefelt, Oppgavefeltverdi, TolkesSom } from 'filter/filterTsTypes';

dayjs.extend(durationPlugin);
interface Props {
	oppgaveFelter: Oppgavefelt[];
	felt: Oppgavefeltverdi;
}

const OppgaveFeltVisning = ({ felt, oppgaveFelter }: Props) => {
	const oppgaveFelt = oppgaveFelter.find((v) => v.kode === felt.kode);

	if (!oppgaveFelt) {
		return null;
	}

	if (oppgaveFelt.tolkes_som === TolkesSom.Duration) {
		const duration = dayjs.duration(felt.verdi);
		const formattedDuration = `${Math.floor(duration.hours() / 24)}d ${duration.hours() % 24}t`;
		return <div>{formattedDuration}</div>;
	}

	if (oppgaveFelt.tolkes_som === TolkesSom.Timestamp) {
		return <div>{dayjs(felt.verdi).format('DD.MM.YYYY')}</div>;
	}

	return <div>{Array.isArray(felt) ? felt.verdi.join(', ') : felt.verdi}</div>;
};

export default OppgaveFeltVisning;
