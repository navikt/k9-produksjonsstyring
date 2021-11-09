import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { shallow } from 'enzyme';
import moment from 'moment';

import behandlingType from 'kodeverk/behandlingType';
import * as useKodeverk from 'api/rest-api-hooks/src/global-data/useKodeverk';
import { NyeOgFerdigstilteOppgaverForIdagPanel, getNyeOgFerdigstilteForIDag } from './NyeOgFerdigstilteOppgaverForIdagPanel';
import NyeOgFerdigstilteOppgaverForIdagGraf from './NyeOgFerdigstilteOppgaverForIdagGraf';

describe('<NyeOgFerdigstilteOppgaverForIdagPanel>', () => {
  it('skal vise rendre komponent', () => {
    const contextStub = sinon.stub(useKodeverk, 'default').callsFake(() => ([{
      kode: behandlingType.FORSTEGANGSSOKNAD,
      navn: 'FORSTEGANGSSOKNAD',
    }]));

    const nyeOgFerdigstilteOppgaver = [{
      behandlingType: {
        kode: behandlingType.FORSTEGANGSSOKNAD,
        navn: 'FORSTEGANGSSOKNAD',
      },
      fagsakYtelseType: {
        kode: 'OMP',
        navn: 'Omsorgspenger',
      },
      antallNye: 12,
      antallFerdigstilte: 2,
      antallFerdigstilteMine: 1,
      dato: '2019-01-01',
    }];

    const wrapper = shallow(<NyeOgFerdigstilteOppgaverForIdagPanel
      height={200}
      nyeOgFerdigstilteOppgaver={nyeOgFerdigstilteOppgaver}
    />);

    expect(wrapper.find(NyeOgFerdigstilteOppgaverForIdagGraf)).to.have.length(1);
    contextStub.restore();
  });

  it('skal filtrere bort alle andre enn dagens oppgaver', () => {
    const iDag = moment().format();
    const nyeOgFerdigstilteOppgaver = [{
      behandlingType: {
        kode: behandlingType.FORSTEGANGSSOKNAD,
        navn: 'FORSTEGANGSSOKNAD',
      },
      fagsakYtelseType: {
        kode: 'OMP',
        navn: 'Omsorgspenger',
      },
      antallNye: 12,
      antallFerdigstilte: 2,
      antallFerdigstilteMine: 1,
      dato: iDag,
    }, {
      behandlingType: {
        kode: behandlingType.KLAGE,
        navn: 'KLAGE',
      },
      fagsakYtelseType: {
        kode: 'PSB',
        navn: 'Pleiepenger',
      },
      antallNye: 1,
      antallFerdigstilte: 6,
      antallFerdigstilteMine: 1,
      dato: moment().add(1, 'days').format(),
    }, {
      behandlingType: {
        kode: behandlingType.FORSTEGANGSSOKNAD,
        navn: 'INNSYN',
      },
      fagsakYtelseType: {
        kode: 'PSB',
        navn: 'Pleiepenger',
      },
      antallNye: 8,
      antallFerdigstilte: 9,
      antallFerdigstilteMine: 1,
      dato: moment().subtract(1, 'days').format(),
    }];

    const filtrerteOppgaver = getNyeOgFerdigstilteForIDag(nyeOgFerdigstilteOppgaver);

    expect(filtrerteOppgaver).to.have.length(1);
    expect(filtrerteOppgaver[0].dato).is.eql(iDag);
  });
});
