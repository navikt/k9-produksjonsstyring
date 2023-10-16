import { createContext } from 'react';
import { OppgavekøV2MedNavn } from 'types/OppgavekøV2Type';
import { OppgavekøV1 } from './behandlingskoer/oppgavekoTsType';

export type Behandlingskoer = {
	oppgavekoer: OppgavekøV1[] | OppgavekøV2MedNavn[];
	setValgtOppgavekoId: (oppgavekoId: string) => void;
	valgtOppgavekoId: string;
};
export const BehandlingskoerContext = createContext(null);

export default BehandlingskoerContext;
