import React from 'react';
import { expect } from 'chai';
import { IntlShape } from 'react-intl';
import {
  XYPlot, YAxis, HorizontalRectSeries, Hint,
} from 'react-vis';

import behandlingType from 'kodeverk/behandlingType';
import fagsakYtelseType from 'kodeverk/fagsakYtelseType';
import { shallowWithIntl, intlMock } from '../../../../../../../setup/testHelpers/intl-enzyme-test-helper';
import FordelingAvBehandlingstypeGraf from './FordelingAvBehandlingstypeGraf';

describe('<FordelingAvBehandlingstypeGraf>', () => {
  const intl: Partial<IntlShape> = {
    ...intlMock,
  };

  const fagsakYtelseTyper = [{
    kode: fagsakYtelseType.PLEIEPENGER_SYKT_BARN,
    navn: 'Pleiepenger sykt barn',
  }, {
    kode: fagsakYtelseType.OMSORGSPENGER,
    navn: 'Omsorgspenger',
  }];
  const behandlingTyper = [{
    kode: behandlingType.ANKE,
    navn: 'Anke',
  }, {
    kode: behandlingType.FORSTEGANGSSOKNAD,
    navn: 'Førstegangssøknad',
  }, {
    kode: behandlingType.KLAGE,
    navn: 'Klage',
  }, {
    kode: behandlingType.REVURDERING,
    navn: 'Revurdering',
  }, {
    kode: behandlingType.INNSYN,
    navn: 'Dokumentinnsyn',
  }];

  it('skal vise graf', () => {
    const alleOppgaver = [{
      fagsakYtelseType: fagsakYtelseTyper[0],
      behandlingType: behandlingTyper[0],
      tilBehandling: true,
      antall: 1,
    }];

    const wrapper = shallowWithIntl(<FordelingAvBehandlingstypeGraf.WrappedComponent
      intl={intl as IntlShape}
      width={300}
      height={200}
      alleOppgaver={alleOppgaver}
      behandlingTyper={behandlingTyper}
    />);

    const plot = wrapper.find(XYPlot);
    expect(plot).to.have.length(1);
  });

  it('skal vise behandlingstyper på y-aksen', () => {
    const alleOppgaver = [{
      fagsakYtelseType: fagsakYtelseTyper[0],
      behandlingType: behandlingTyper[0],
      tilBehandling: true,
      antall: 1,
    }];

    const wrapper = shallowWithIntl(<FordelingAvBehandlingstypeGraf.WrappedComponent
      intl={intl as IntlShape}
      width={300}
      height={200}
      alleOppgaver={alleOppgaver}
      behandlingTyper={behandlingTyper}
    />);

    const yAksen = wrapper.find(YAxis);
    expect(yAksen).to.have.length(1);

    const verdiIndekser = yAksen.prop('tickValues') as number[];
    expect(verdiIndekser).to.have.length(5);

    const verdiFn = yAksen.prop('tickFormat') as (v, i: number) => void;

    const behandlingstyper = verdiIndekser.map((i) => verdiFn(undefined, i - 1));
    expect(behandlingstyper).is.eql(['Anke', 'Dokumentinnsyn', 'Klage', 'Revurdering', 'Førstegangssøknad']);
  });

  it('skal vise hint med antall og total-antall ved mouseover', () => {
    const alleOppgaver = [{
      fagsakYtelseType: fagsakYtelseTyper[0],
      behandlingType: behandlingTyper[0],
      tilBehandling: true,
      antall: 1,
    }, {
      fagsakYtelseType: fagsakYtelseTyper[0],
      behandlingType: behandlingTyper[0],
      tilBehandling: false,
      antall: 1,
    }];

    const wrapper = shallowWithIntl(<FordelingAvBehandlingstypeGraf.WrappedComponent
      intl={intl as IntlShape}
      width={300}
      height={200}
      alleOppgaver={alleOppgaver}
      behandlingTyper={behandlingTyper}
    />);

    const hRectSeries = wrapper.find(HorizontalRectSeries);
    expect(hRectSeries).to.have.length(2);

    const grafPosisjon = {
      x: 2,
      x0: 1,
      y: 6,
    };
    const func = hRectSeries.first().prop('onValueMouseOver') as ({ x: number, x0, y }) => void;
    func(grafPosisjon);

    const hint = wrapper.find(Hint);
    expect(hint).to.have.length(1);
    expect(hint.childAt(0).html()).to.include('Antall: 1');
    expect(hint.childAt(0).html()).to.include('Totalt antall: 0');
  });
});
