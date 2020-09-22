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
import { ALLE_YTELSETYPER_VALGT } from 'avdelingsleder/nokkeltall/nokkeltallUtils';
import { BeholdningHistorikkPanel } from 'avdelingsleder/nokkeltall/components/beholdningHistorikk/BeholdningHistorikkPanel';
import HistorikkGraf from 'avdelingsleder/nokkeltall/HistorikkGraf';

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

  it('skal vise ukevalg i dropdown', () => {
    const valuesMock = {
      [fagsakYtelseType.OMSORGSPENGER]: true,
      [fagsakYtelseType.PLEIEPENGER_SYKT_BARN]: true,
      ukevalg: '4',
    };
    const beholdningPerDato = [];

    const wrapper = shallowWithIntl(<BeholdningHistorikkPanel
      intl={intl as IntlShape}
      width={300}
      height={200}
      fagsakYtelseTyper={fagsakYtelseTyper}
      behandlingTyper={behandlingTyper}
      beholdningPerDato={beholdningPerDato}
      initialValues={{ ytelseType: fagsakYtelseType.OMSORGSPENGER, ukevalg: valuesMock.ukevalg }}
      // @ts-ignore
    />).find(Form).renderProp('render')({ values: valuesMock });

    const select = wrapper.find(SelectField).first();
    expect(select).to.have.length(1);

    const options = select.prop('selectValues') as { props: { value: string; children: string }}[];
    expect(options).to.have.length(2);
    expect(options[0].props.value).to.eql('4');
    expect(options[0].props.children).to.eql('4 siste uker');
    expect(options[1].props.value).to.eql('8');
    expect(options[1].props.children).to.eql('8 siste uker');
  });

  it('skal filtrere bort alt som er eldre enn 4 uker', () => {
    const valuesMock = {
      ytelseType: 'ALLE',
      ukevalg: '4',
    };
    const beholdningPerDato = [{
      fagsakYtelseType: fagsakYtelseTyper[0],
      behandlingType: forstegangssoknad,
      dato: moment().subtract(27, 'd').format(ISO_DATE_FORMAT),
      antall: 1,
    }, {
      fagsakYtelseType: fagsakYtelseTyper[1],
      behandlingType: forstegangssoknad,
      dato: moment().subtract(28, 'd').format(ISO_DATE_FORMAT),
      antall: 1,
    }];

    const wrapper = shallowWithIntl(<BeholdningHistorikkPanel
      intl={intl as IntlShape}
      width={300}
      height={200}
      fagsakYtelseTyper={fagsakYtelseTyper}
      behandlingTyper={behandlingTyper}
      beholdningPerDato={beholdningPerDato}
      initialValues={{ ytelseType: fagsakYtelseType.PLEIEPENGER_SYKT_BARN, ukevalg: valuesMock.ukevalg }}
      // @ts-ignore
    />).find(Form).renderProp('render')({ values: valuesMock });

    const graf = wrapper.find(HistorikkGraf);
    expect(graf).to.have.length(1);
    expect(graf.prop('isFireUkerValgt')).is.true;
    expect(graf.prop('historiskData')).is.eql([beholdningPerDato[0]]);
  });

  it('skal ikke filtrere bort alt som er eldre enn 4 uker når 8 uker er valgt i filter', () => {
    const valuesMock = {
      ytelseType: 'ALLE',
      ukevalg: '8',
    };
    const beholdningPerDato = [{
      fagsakYtelseType: fagsakYtelseTyper[0],
      behandlingType: forstegangssoknad,
      dato: moment().subtract(27, 'd').format(ISO_DATE_FORMAT),
      antall: 1,
    }, {
      fagsakYtelseType: fagsakYtelseTyper[1],
      behandlingType: forstegangssoknad,
      dato: moment().subtract(28, 'd').format(ISO_DATE_FORMAT),
      antall: 1,
    }];

    const wrapper = shallowWithIntl(<BeholdningHistorikkPanel
      intl={intl as IntlShape}
      width={300}
      height={200}
      fagsakYtelseTyper={fagsakYtelseTyper}
      behandlingTyper={behandlingTyper}
      beholdningPerDato={beholdningPerDato}
      initialValues={{ ytelseType: fagsakYtelseType.PLEIEPENGER_SYKT_BARN, ukevalg: valuesMock.ukevalg }}
      // @ts-ignore
    />).find(Form).renderProp('render')({ values: valuesMock });

    const graf = wrapper.find(HistorikkGraf);
    expect(graf).to.have.length(1);
    expect(graf.prop('isFireUkerValgt')).is.false;
    expect(graf.prop('historiskData')).is.eql(beholdningPerDato);
  });

  it('skal filtrere bort engangsstønader', () => {
    const valuesMock = {
      ytelseType: fagsakYtelseType.PLEIEPENGER_SYKT_BARN,
      ukevalg: '2',
    };
    const beholdningPerDato = [{
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

    const wrapper = shallowWithIntl(<BeholdningHistorikkPanel
      intl={intl as IntlShape}
      width={300}
      height={200}
      fagsakYtelseTyper={fagsakYtelseTyper}
      behandlingTyper={behandlingTyper}
      beholdningPerDato={beholdningPerDato}
      initialValues={{ ytelseType: fagsakYtelseType.OMSORGSPENGER, ukevalg: valuesMock.ukevalg }}
      // @ts-ignore
    />).find(Form).renderProp('render')({ values: valuesMock });

    const graf = wrapper.find(HistorikkGraf);
    expect(graf).to.have.length(1);
    expect(graf.prop('historiskData')).is.eql([beholdningPerDato[1]]);
  });

  it('skal filtrere bort omsorgspenger', () => {
    const valuesMock = {
      ytelseType: fagsakYtelseType.OMSORGSPENGER,
      ukevalg: '2',
    };
    const beholdningPerDato = [{
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

    const wrapper = shallowWithIntl(<BeholdningHistorikkPanel
      intl={intl as IntlShape}
      width={300}
      height={200}
      fagsakYtelseTyper={fagsakYtelseTyper}
      behandlingTyper={behandlingTyper}
      beholdningPerDato={beholdningPerDato}
      initialValues={{ ytelseType: fagsakYtelseType.PLEIEPENGER_SYKT_BARN, ukevalg: valuesMock.ukevalg }}
      // @ts-ignore
    />).find(Form).renderProp('render')({ values: valuesMock });

    const graf = wrapper.find(HistorikkGraf);
    expect(graf).to.have.length(1);
    expect(graf.prop('historiskData')).is.eql([beholdningPerDato[0]]);
  });

  it('skal slå sammen like behandlingstyper og datoer', () => {
    const valuesMock = {
      ytelseType: ALLE_YTELSETYPER_VALGT,
      ukevalg: '2',
    };
    const beholdningPerDato = [{
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

    const wrapper = shallowWithIntl(<BeholdningHistorikkPanel
      intl={intl as IntlShape}
      width={300}
      height={200}
      fagsakYtelseTyper={fagsakYtelseTyper}
      behandlingTyper={behandlingTyper}
      beholdningPerDato={beholdningPerDato}
      initialValues={{ ytelseType: fagsakYtelseType.OMSORGSPENGER, ukevalg: valuesMock.ukevalg }}
      // @ts-ignore
    />).find(Form).renderProp('render')({ values: valuesMock });

    const graf = wrapper.find(HistorikkGraf);
    expect(graf).to.have.length(1);
    expect(graf.prop('historiskData')).is.eql([{
      behandlingType: forstegangssoknad,
      dato: moment().format(ISO_DATE_FORMAT),
      antall: 2,
    }]);
  });
});
