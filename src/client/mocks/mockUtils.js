import dayjs from 'dayjs';

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}
// eslint-disable-next-line import/prefer-default-export
export const randomDato = (max = 25) => dayjs().subtract(getRandomInt(max), 'd').format();
