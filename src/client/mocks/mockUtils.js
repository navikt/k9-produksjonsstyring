import dayjs from 'dayjs';

function getRandomInt(max) {
	return Math.floor(Math.random() * max);
}
// eslint-disable-next-line import/prefer-default-export
export const giRandomDato = (historikk, max = 25) =>
	historikk.map((v) => ({
		...v,
		dato: dayjs()
			.subtract(getRandomInt(max) + 1, 'd')
			.format(),
	}));
