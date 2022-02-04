/* eslint-disable import/no-mutable-exports */
import { rest } from 'msw';

import ferdigstilteHistorikk from './ferdigstilteHistorikk';
// Alle handlers som ligger direkte i dette arrayet vil gjelde
// selv om k9-sak-web startes uten env spesielle env-variabler.
// Requesten treffer handlerne i stedet for eventuelle eksisterende APIer
// f.eks hvis vi har handlere til alle APIene vi bruker her, vil vi aldri treffe den faktiske backenden når vi kjører opp lokalt.
// Derfor burde nok ting kun legges i dette arrayet midlertidig
let handlers = [];

const developmentHandlers = {
  navAnsatt: rest.get('/api/avdelingsleder/nokkeltall/ferdigstilte-historikk', (req, res, ctx) =>
    res(ctx.json(ferdigstilteHistorikk)),
  ),
};

if (process.env.MSW_MODE === 'development') {
  handlers = handlers.concat(Object.values(developmentHandlers));
}

export default handlers;
