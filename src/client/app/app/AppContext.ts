import { createContext } from 'react';
import { Oppgavefelt } from 'filter/filterTsTypes';

interface AppContextTypes {
	felter: Oppgavefelt[];
}

const AppContext = createContext<AppContextTypes>(null);

export default AppContext;
