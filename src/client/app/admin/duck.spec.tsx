import { expect } from 'chai';

import AdminPanels from './AdminPanels';
import {
  avdelingslederReducer, setSelectedPanel, resetBehandlingSupport, getSelectedPanel,
} from './duck';

describe('Avdelingsleder-reducer', () => {
  it('skal returnere initial state', () => {
    expect(avdelingslederReducer(undefined, { type: '' })).to.eql({ selectedAvdelingslederPanel: undefined });
  });

  it('skal oppdatere state med valgt panel', () => {
    const setAction = setSelectedPanel(AdminPanels.BEHANDLINGSKOER);
    expect(avdelingslederReducer(undefined, setAction)).to.eql({
      selectedAvdelingslederPanel: AdminPanels.BEHANDLINGSKOER,
    });
  });

  it('skal resette state', () => {
    const state = {
      selectedAvdelingslederPanel: AdminPanels.BEHANDLINGSKOER,
    };
    const resetAction = resetBehandlingSupport();
    expect(avdelingslederReducer(state, resetAction)).to.eql({
      selectedAvdelingslederPanel: undefined,
    });
  });

  it('skal finne valgt panel', () => {
    const state = {
      default: {
        avdelingslederContext: {
          selectedAvdelingslederPanel: AdminPanels.BEHANDLINGSKOER,
        },
      },
    };

    expect(getSelectedPanel(state)).is.eql(AdminPanels.BEHANDLINGSKOER);
  });
});
