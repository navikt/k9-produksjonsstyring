// src/mocks/server.js
import { rest } from 'msw';
import { setupServer } from 'msw/node';

// This configures a request mocking server with the given request handlers.
// eslint-disable-next-line import/prefer-default-export
export const server = setupServer(
    // ligger her fordi setupServer trenger absolute paths
    // burde gjøre at handlers.js eksporterer to sett med funksjoner
    rest.get('http://localhost:8030/api/driftsmeldinger', (req, res, ctx) =>
        res(
            ctx.json([
                {
                    id: '1',
                    melding: 'CrashMessage',
                    dato: '06-09-2021',
                    aktiv: true,
                    aktivert: '',
                },
            ]),
        ),
    ),
);
