import React from 'react';
import { screen } from '@testing-library/react';
import { renderWithAllProviders } from '../../../../../../../setup/testHelpers/testUtils';

import KoSortering from 'kodeverk/KoSortering';
import kodeverkTyper from 'kodeverk/kodeverkTyper';
import { RestApiGlobalStatePathsKeys } from 'api/k9LosApi';
import RestApiTestMocker from '../../../../../../../setup/testHelpers/RestApiTestMocker';
import SorteringVelger from './SorteringVelger';
import kodeverk from '../../../../../mocks/kodeverk';
import KriterierType from '../../../../types/KriterierType';

describe('<SorteringVelger>', () => {
  const koSorteringTyper = [
    {
      kode: KoSortering.OPPRETT_BEHANDLING,
      felttype: '',
      feltkategori: '',
    },
  ];

  const koKriterierTyper = [
    {
      kode: KriterierType.Feilutbetaling,
      felttype: 'BELOP',
      feltkategori: 'BELOP',
    },
  ];

  it('skal vise radioknapper for alle sorteringsvalg', () => {
    new RestApiTestMocker()
      .withKodeverk(kodeverkTyper.KO_SORTERING, koSorteringTyper)
      .withKodeverk(kodeverkTyper.KO_KRITERIER, koKriterierTyper)
      .withDummyRunner()
      .withGlobalData(RestApiGlobalStatePathsKeys.KODEVERK, kodeverk)
      .runTest(() => {
        renderWithAllProviders(
          <SorteringVelger
            valgtOppgavekoId="1"
            fomDato="03-08-2020"
            tomDato="19-08-2020"
            hentOppgaveko={() => {}}
            kriterier={[]}
          />,
        );

        expect(screen.getByTestId('kriterie-FEILUTBETALING')).toBeInTheDocument();
        expect(screen.getByTestId('kriterie-OPPRBEH')).toBeInTheDocument();

        screen.getByTestId('kriterie-FEILUTBETALING').click();
        expect(screen.getByText('Til')).toBeInTheDocument();
        expect(screen.getByText('Fra')).toBeInTheDocument();
      });
  });
});
