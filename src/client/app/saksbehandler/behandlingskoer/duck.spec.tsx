
import { expect } from 'chai';

import {
  behandlingskoerReducer, setValgtOppgavekoId,
} from './duck';

describe('Behandlingskøer-reducer', () => {
  it('skal returnere initial state', () => {
    expect(behandlingskoerReducer(undefined, { type: '' })).to.eql({
      valgtOppgavekoId: undefined,
    });
  });

  it('skal sette oppgavekø-id', () => {
    const addAction = setValgtOppgavekoId('1');
    expect(behandlingskoerReducer(undefined, addAction).valgtOppgavekoId).to.eql('1');
  });
});
