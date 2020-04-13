import { expect } from 'chai';

import {
  organiseringAvOppgavekoerReducer, setValgtOppgavekoId, resetValgtOppgavekoId, getValgtOppgavekoId,
} from './duck';

describe('Oppgavekø-reducer', () => {
  it('skal returnere initial state', () => {
    expect(organiseringAvOppgavekoerReducer(undefined, {})).to.eql({ valgtOppgavekoId: undefined });
  });

  it('skal oppdatere state med valgt oppgavekø id', () => {
    const setAction = setValgtOppgavekoId('1');
    expect(organiseringAvOppgavekoerReducer(undefined, setAction)).to.eql({
      valgtOppgavekoId: '1',
    });
  });

  it('skal resette state', () => {
    const state = {
      valgtOppgavekoId: '1',
    };
    const resetAction = resetValgtOppgavekoId();
    expect(organiseringAvOppgavekoerReducer(state, resetAction)).to.eql({
      valgtOppgavekoId: undefined,
    });
  });

  it('skal finne valgt oppgavekø id', () => {
    const state = {
      default: {
        organiseringAvOppgavekoerContext: {
          valgtOppgavekoId: '1',
        },
      },
    };

    expect(getValgtOppgavekoId(state)).is.eql('1');
  });
});
