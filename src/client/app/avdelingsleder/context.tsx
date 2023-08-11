import { createContext } from 'react';
import { Saksbehandler } from './bemanning/saksbehandlerTsType';

export type AvdelingslederContextState = { saksbehandlere: Saksbehandler[] };

export const AvdelingslederContext = createContext<AvdelingslederContextState>({
	saksbehandlere: [],
});
