import React from 'react';
import sinon from 'sinon';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import andreKriterierType from 'kodeverk/andreKriterierType';
import SaksbehandlereForOppgavekoForm from './SaksbehandlereForOppgavekoForm';

describe('<SaksbehandlereForOppgavekoForm>', () => {
  const oppgaveko = {
    id: '1',
    navn: 'Nyansatte',
    sistEndret: '2017-08-31',
    skjermet: false,
    andreKriterierTyper: [
      {
        kode: andreKriterierType.TIL_BESLUTTER,
        navn: 'Til beslutter',
      },
      {
        kode: andreKriterierType.AVKLAR_MEDLEMSKAP,
        navn: 'Avklar medlemskap',
      },
    ],
    antallBehandlinger: 68,
    saksbehandlere: [],
    kriterier: [],
  };

  it('skal vise checkboxer og støtte filtrering', () => {
    const saksbehandlere = [
      {
        brukerIdent: 'TEST1',
        navn: 'Walter Lemon',
        epost: 'epost1',
        oppgavekoer: ['OMP'],
        enhet: 'Sørlandet',
      },
      {
        brukerIdent: 'TEST2',
        navn: 'Water Melon',
        epost: 'epost2',
        oppgavekoer: ['OMP'],
        enhet: 'Kristiania',
      },
    ];

    render(
      <SaksbehandlereForOppgavekoForm
        valgtOppgaveko={oppgaveko}
        alleSaksbehandlere={saksbehandlere}
        hentOppgaveko={sinon.spy()}
      />,
    );
    userEvent.click(screen.getByLabelText('Velg saksbehandlere'));
    expect(screen.getByLabelText('Kristiania')).toBeVisible();
    expect(screen.getByLabelText('Sørlandet')).toBeVisible();
    expect(screen.queryByLabelText('Walter Lemon')).toBe(null);
    userEvent.type(screen.getByLabelText('Velg saksbehandlere'), 'Lemon');
    expect(screen.getByLabelText('Walter Lemon')).toBeVisible();
  });
});
