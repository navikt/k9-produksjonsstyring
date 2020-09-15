import React from 'react';
import { expect } from 'chai';
import moment from 'moment';
import { IntlShape } from 'react-intl';
import { Form } from 'react-final-form';

import { ISO_DATE_FORMAT } from 'utils/formats';
import { RadioOption, SelectField } from 'form/FinalFields';
import fagsakYtelseType from 'kodeverk/fagsakYtelseType';
import behandlingType from 'kodeverk/behandlingType';
import { shallowWithIntl, intlMock } from 'testHelpers/intl-enzyme-test-helper';
import { TilBehandlingPanel, ALLE_YTELSETYPER_VALGT } from './TilBehandlingPanel';
import TilBehandlingGraf from './TilBehandlingGraf';

describe('<TilBehandlingPanel>', () => {
  const intl: Partial<IntlShape> = {
    ...intlMock,
  };
  const fagsakYtelseTyper = [{
    kode: fagsakYtelseType.OMSORGSPENGER,
    navn: 'Omsorgspenger',
  }, {
    kode: fagsakYtelseType.PLEIEPENGER_SYKT_BARN,
    navn: 'Pleiepenger sykt barn',
  }];

  const behandlingTyper = [{
    kode: behandlingType.FORSTEGANGSSOKNAD,
    navn: 'Førstegangssøknad',
  }];

  const forstegangssoknad = {
    kode: behandlingType.FORSTEGANGSSOKNAD,
    navn: 'Førstegangssøknad',
  };

  it('skal vise ukevalg i dropdown og valg av ytelsetype i radioknapper', () => {
    const valuesMock = {
      [fagsakYtelseType.OMSORGSPENGER]: true,
      [fagsakYtelseType.PLEIEPENGER_SYKT_BARN]: true,
      ukevalg: '2',
    };
    const oppgaverPerDato = [];

    const wrapper = shallowWithIntl(<TilBehandlingPanel
      intl={intl as IntlShape}
      width={300}
      height={200}
      fagsakYtelseTyper={fagsakYtelseTyper}
      behandlingTyper={behandlingTyper}
      oppgaverPerDato={oppgaverPerDato}
      initialValues={{ ytelseType: fagsakYtelseType.OMSORGSPENGER, ukevalg: valuesMock.ukevalg }}
      // @ts-ignore
    />).find(Form).renderProp('render')({ values: valuesMock });

    const select = wrapper.find(SelectField);
    expect(select).to.have.length(1);

    const options = select.prop('selectValues') as { props: { value: string; children: string }}[];
    expect(options).to.have.length(2);
    expect(options[0].props.value).to.eql('2');
    expect(options[0].props.children).to.eql('2 siste uker');
    expect(options[1].props.value).to.eql('4');
    expect(options[1].props.children).to.eql('4 siste uker');


    const radioOptions = wrapper.find(RadioOption);
    expect(radioOptions).to.have.length(3);
    expect(radioOptions.first().prop('value')).to.eql('OMP');
    expect(radioOptions.first().prop('label')).to.eql('Omsorgspenger');
    expect(radioOptions.at(1).prop('value')).to.eql('PSB');
    expect(radioOptions.at(1).prop('label')).to.eql('Pleiepenger sykt barn');
    expect(radioOptions.last().prop('value')).to.eql('ALLE');
  });

  it('skal filtrere bort alt som er eldre enn to uker', () => {
    const valuesMock = {
      ytelseType: 'ALLE',
      ukevalg: '2',
    };
    const oppgaverPerDato = [{
      fagsakYtelseType: fagsakYtelseTyper[0],
      behandlingType: forstegangssoknad,
      dato: moment().subtract(13, 'd').format(ISO_DATE_FORMAT),
      antall: 1,
    }, {
      fagsakYtelseType: fagsakYtelseTyper[1],
      behandlingType: forstegangssoknad,
      dato: moment().subtract(14, 'd').format(ISO_DATE_FORMAT),
      antall: 1,
    }];

    const wrapper = shallowWithIntl(<TilBehandlingPanel
      intl={intl as IntlShape}
      width={300}
      height={200}
      fagsakYtelseTyper={fagsakYtelseTyper}
      behandlingTyper={behandlingTyper}
      oppgaverPerDato={oppgaverPerDato}
      initialValues={{ ytelseType: fagsakYtelseType.PLEIEPENGER_SYKT_BARN, ukevalg: valuesMock.ukevalg }}
      // @ts-ignore
    />).find(Form).renderProp('render')({ values: valuesMock });

    const graf = wrapper.find(TilBehandlingGraf);
    expect(graf).to.have.length(1);
    expect(graf.prop('isToUkerValgt')).is.true;
    expect(graf.prop('oppgaverPerDato')).is.eql([oppgaverPerDato[0]]);
  });

  it('skal ikke filtrere bort alt som er eldre enn to uker når fire uker er valgt i filter', () => {
    const valuesMock = {
      ytelseType: 'ALLE',
      ukevalg: '4',
    };
    const oppgaverPerDato = [{
      fagsakYtelseType: fagsakYtelseTyper[0],
      behandlingType: forstegangssoknad,
      dato: moment().subtract(13, 'd').format(ISO_DATE_FORMAT),
      antall: 1,
    }, {
      fagsakYtelseType: fagsakYtelseTyper[1],
      behandlingType: forstegangssoknad,
      dato: moment().subtract(14, 'd').format(ISO_DATE_FORMAT),
      antall: 1,
    }];

    const wrapper = shallowWithIntl(<TilBehandlingPanel
      intl={intl as IntlShape}
      width={300}
      height={200}
      fagsakYtelseTyper={fagsakYtelseTyper}
      behandlingTyper={behandlingTyper}
      oppgaverPerDato={oppgaverPerDato}
      initialValues={{ ytelseType: fagsakYtelseType.PLEIEPENGER_SYKT_BARN, ukevalg: valuesMock.ukevalg }}
      // @ts-ignore
    />).find(Form).renderProp('render')({ values: valuesMock });

    const graf = wrapper.find(TilBehandlingGraf);
    expect(graf).to.have.length(1);
    expect(graf.prop('isToUkerValgt')).is.false;
    expect(graf.prop('oppgaverPerDato')).is.eql(oppgaverPerDato);
  });

  it('skal filtrere bort engangsstønader', () => {
    const valuesMock = {
      ytelseType: fagsakYtelseType.PLEIEPENGER_SYKT_BARN,
      ukevalg: '2',
    };
    const oppgaverPerDato = [{
      fagsakYtelseType: fagsakYtelseTyper[0],
      behandlingType: forstegangssoknad,
      dato: moment().format(ISO_DATE_FORMAT),
      antall: 1,
    }, {
      fagsakYtelseType: fagsakYtelseTyper[1],
      behandlingType: forstegangssoknad,
      dato: moment().format(ISO_DATE_FORMAT),
      antall: 1,
    }];

    const wrapper = shallowWithIntl(<TilBehandlingPanel
      intl={intl as IntlShape}
      width={300}
      height={200}
      fagsakYtelseTyper={fagsakYtelseTyper}
      behandlingTyper={behandlingTyper}
      oppgaverPerDato={oppgaverPerDato}
      initialValues={{ ytelseType: fagsakYtelseType.OMSORGSPENGER, ukevalg: valuesMock.ukevalg }}
      // @ts-ignore
    />).find(Form).renderProp('render')({ values: valuesMock });

    const graf = wrapper.find(TilBehandlingGraf);
    expect(graf).to.have.length(1);
    expect(graf.prop('oppgaverPerDato')).is.eql([oppgaverPerDato[1]]);
  });

  it('skal filtrere bort omsorgspenger', () => {
    const valuesMock = {
      ytelseType: fagsakYtelseType.OMSORGSPENGER,
      ukevalg: '2',
    };
    const oppgaverPerDato = [{
      fagsakYtelseType: fagsakYtelseTyper[0],
      behandlingType: forstegangssoknad,
      dato: moment().format(ISO_DATE_FORMAT),
      antall: 1,
    }, {
      fagsakYtelseType: fagsakYtelseTyper[1],
      behandlingType: forstegangssoknad,
      dato: moment().format(ISO_DATE_FORMAT),
      antall: 1,
    }];

    const wrapper = shallowWithIntl(<TilBehandlingPanel
      intl={intl as IntlShape}
      width={300}
      height={200}
      fagsakYtelseTyper={fagsakYtelseTyper}
      behandlingTyper={behandlingTyper}
      oppgaverPerDato={oppgaverPerDato}
      initialValues={{ ytelseType: fagsakYtelseType.PLEIEPENGER_SYKT_BARN, ukevalg: valuesMock.ukevalg }}
      // @ts-ignore
    />).find(Form).renderProp('render')({ values: valuesMock });

    const graf = wrapper.find(TilBehandlingGraf);
    expect(graf).to.have.length(1);
    expect(graf.prop('oppgaverPerDato')).is.eql([oppgaverPerDato[0]]);
  });

  it('skal slå sammen like behandlingstyper og datoer', () => {
    const valuesMock = {
      ytelseType: ALLE_YTELSETYPER_VALGT,
      ukevalg: '2',
    };
    const oppgaverPerDato = [{
      fagsakYtelseType: fagsakYtelseTyper[0],
      behandlingType: forstegangssoknad,
      dato: moment().format(ISO_DATE_FORMAT),
      antall: 1,
    }, {
      fagsakYtelseType: fagsakYtelseTyper[1],
      behandlingType: forstegangssoknad,
      dato: moment().format(ISO_DATE_FORMAT),
      antall: 1,
    }];

    const wrapper = shallowWithIntl(<TilBehandlingPanel
      intl={intl as IntlShape}
      width={300}
      height={200}
      fagsakYtelseTyper={fagsakYtelseTyper}
      behandlingTyper={behandlingTyper}
      oppgaverPerDato={oppgaverPerDato}
      initialValues={{ ytelseType: fagsakYtelseType.OMSORGSPENGER, ukevalg: valuesMock.ukevalg }}
      // @ts-ignore
    />).find(Form).renderProp('render')({ values: valuesMock });

    const graf = wrapper.find(TilBehandlingGraf);
    expect(graf).to.have.length(1);
    expect(graf.prop('oppgaverPerDato')).is.eql([{
      behandlingType: forstegangssoknad,
      dato: moment().format(ISO_DATE_FORMAT),
      antall: 2,
    }]);
  });
});
