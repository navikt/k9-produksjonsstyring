import React from 'react';
import { expect } from 'chai';
import dayjs from 'dayjs';
import { IntlShape } from 'react-intl';
import { Form } from 'react-final-form';
import sinon from 'sinon';

import { ISO_DATE_FORMAT } from 'utils/formats';
import { SelectField } from 'form/FinalFields';
import kodeverkTyper from 'kodeverk/kodeverkTyper';
import * as useKodeverk from 'api/rest-api-hooks/src/global-data/useKodeverk';
import fagsakYtelseType from 'kodeverk/fagsakYtelseType';
import behandlingType from 'kodeverk/behandlingType';
import { ALLE_YTELSETYPER_VALGT } from 'avdelingsleder/nokkeltall/nokkeltallUtils';
import { BeholdningHistorikkPanel } from 'avdelingsleder/nokkeltall/components/beholdningHistorikk/BeholdningHistorikkPanel';
import HistorikkGraf from 'avdelingsleder/nokkeltall/HistorikkGraf';
import { intlMock, shallowWithIntl } from '../../../../../../../setup/testHelpers/intl-enzyme-test-helper';

describe('<TilBehandlingPanel>', () => {
  const intl: Partial<IntlShape> = {
    ...intlMock,
  };
  const fagsakYtelseTyper = [
    {
      kode: fagsakYtelseType.OMSORGSPENGER,
      navn: 'Omsorgspenger',
    },
    {
      kode: fagsakYtelseType.PLEIEPENGER_SYKT_BARN,
      navn: 'Pleiepenger sykt barn',
    },
    {
      kode: fagsakYtelseType.OMSORGSDAGER_KRONISKSYK,
      navn: 'Omsorgspenger',
    },
    {
      kode: fagsakYtelseType.OMSORGSDAGER_MIDLERTIDIGALENE,
      navn: 'Omsorgspenger',
    },
    {
      kode: fagsakYtelseType.OMSORGSDAGER_ALENEOMOMSORGEN,
      navn: 'Omsorgspenger',
    },
  ];

  const behandlingTyper = [
    {
      kode: behandlingType.FORSTEGANGSSOKNAD,
      navn: 'Førstegangssøknad',
    },
  ];

  const forstegangssoknad = {
    kode: behandlingType.FORSTEGANGSSOKNAD,
    navn: 'Førstegangssøknad',
  };

  const punsj = {
    kode: behandlingType.SKRIV_TIL_OSS_SVAR,
    navn: 'Førstegangssøknad',
    kodeverk: 'PUNSJ_INNSENDING_TYPE',
  };

  const beholdningPerDatoV2 = [{
    fagsakYtelseType: fagsakYtelseTyper[0],
    behandlingType: forstegangssoknad,
    dato: dayjs().format(ISO_DATE_FORMAT),
    antall: 1,
  },
  {
    fagsakYtelseType: fagsakYtelseTyper[1],
    behandlingType: forstegangssoknad,
    dato: dayjs().format(ISO_DATE_FORMAT),
    antall: 1,
  },
  {
    fagsakYtelseType: fagsakYtelseTyper[1],
    behandlingType: punsj,
    dato: dayjs().format(ISO_DATE_FORMAT),
    antall: 1,
  }, {
    fagsakYtelseType: fagsakYtelseTyper[2],
    behandlingType: forstegangssoknad,
    dato: dayjs().format(ISO_DATE_FORMAT),
    antall: 1,
  },
  {
    fagsakYtelseType: fagsakYtelseTyper[3],
    behandlingType: forstegangssoknad,
    dato: dayjs().format(ISO_DATE_FORMAT),
    antall: 1,
  },
  {
    fagsakYtelseType: fagsakYtelseTyper[4],
    behandlingType: forstegangssoknad,
    dato: dayjs().format(ISO_DATE_FORMAT),
    antall: 1,
  },
  ];

  let contextStub;
  beforeEach(() => {
    contextStub = sinon.stub(useKodeverk, 'default');
    contextStub.withArgs(kodeverkTyper.BEHANDLING_TYPE).callsFake(() => behandlingTyper)
      .withArgs(kodeverkTyper.FAGSAK_YTELSE_TYPE)
      .callsFake(() => fagsakYtelseTyper);
  });

  afterEach(() => {
    contextStub.restore();
  });

  it('skal vise ukevalg i dropdown', () => {
    const valuesMock = {
      [fagsakYtelseType.OMSORGSPENGER]: true,
      [fagsakYtelseType.PLEIEPENGER_SYKT_BARN]: true,
      ukevalg: '2',
    };
    const beholdningPerDato = [];

    const wrapper = shallowWithIntl(<BeholdningHistorikkPanel
      intl={intl as IntlShape}
      beholdningPerDato={beholdningPerDato}
      getValueFromLocalStorage={sinon.spy()}
      // @ts-ignore
    />).find(Form).renderProp('render')({ values: valuesMock });

    const select = wrapper.find(SelectField).first();
    expect(select).to.have.length(1);

    const options = select.prop('selectValues') as { props: { value: string; children: string }}[];
    expect(options).to.have.length(2);
    expect(options[0].props.value).to.eql('2');
    expect(options[0].props.children).to.eql('2 siste uker');
    expect(options[1].props.value).to.eql('4');
    expect(options[1].props.children).to.eql('4 siste uker');
  });

  it('skal filtrere bort alt som er eldre enn 4 uker', () => {
    const valuesMock = {
      ytelseType: 'ALLE',
      ukevalg: '4',
    };
    const beholdningPerDato = [{
      fagsakYtelseType: fagsakYtelseTyper[0],
      behandlingType: forstegangssoknad,
      dato: dayjs().subtract(27, 'd').format(ISO_DATE_FORMAT),
      antall: 1,
    }, {
      fagsakYtelseType: fagsakYtelseTyper[1],
      behandlingType: forstegangssoknad,
      dato: dayjs().subtract(29, 'd').format(ISO_DATE_FORMAT),
      antall: 1,
    }];

    const wrapper = shallowWithIntl(<BeholdningHistorikkPanel
      intl={intl as IntlShape}
      beholdningPerDato={beholdningPerDato}
      getValueFromLocalStorage={sinon.spy()}
      // @ts-ignore
    />).find(Form).renderProp('render')({ values: valuesMock });

    const graf = wrapper.find(HistorikkGraf);
    expect(graf).to.have.length(1);
    expect(graf.prop('isFireUkerValgt')).is.eql(true);
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
      dato: dayjs().format(ISO_DATE_FORMAT),
      antall: 1,
    }, {
      fagsakYtelseType: fagsakYtelseTyper[1],
      behandlingType: forstegangssoknad,
      dato: dayjs().format(ISO_DATE_FORMAT),
      antall: 1,
    }];

    const wrapper = shallowWithIntl(<BeholdningHistorikkPanel
      intl={intl as IntlShape}
      beholdningPerDato={beholdningPerDato}
      getValueFromLocalStorage={sinon.spy()}
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
      dato: dayjs().format(ISO_DATE_FORMAT),
      antall: 1,
    }, {
      fagsakYtelseType: fagsakYtelseTyper[1],
      behandlingType: forstegangssoknad,
      dato: dayjs().format(ISO_DATE_FORMAT),
      antall: 1,
    }];

    const wrapper = shallowWithIntl(<BeholdningHistorikkPanel
      intl={intl as IntlShape}
      beholdningPerDato={beholdningPerDato}
      getValueFromLocalStorage={sinon.spy()}
      // @ts-ignore
    />).find(Form).renderProp('render')({ values: valuesMock });

    const graf = wrapper.find(HistorikkGraf);
    expect(graf).to.have.length(1);
    expect(graf.prop('historiskData')).is.eql([beholdningPerDato[0]]);
  });

  it('skal kun få ned punsjoppgaver', () => {
    const valuesMock = {
      ytelseType: fagsakYtelseType.PUNSJ,
      ukevalg: '2',
    };

    const wrapper = shallowWithIntl(<BeholdningHistorikkPanel
      intl={intl as IntlShape}
      beholdningPerDato={beholdningPerDatoV2}
      getValueFromLocalStorage={sinon.spy()}
      // @ts-ignore
    />).find(Form).renderProp('render')({ values: valuesMock });

    const graf = wrapper.find(HistorikkGraf);
    expect(graf).to.have.length(1);
    expect(graf.prop('historiskData')[0].antall).is.eql(beholdningPerDatoV2[2].antall);
    expect(graf.prop('historiskData')[0].dato).is.eql(beholdningPerDatoV2[2].dato);
    expect(graf.prop('historiskData')[0].behandlingType.kode).is.eql('PUNSJ');
  });

  it('skal kun få ned omsorgsdager oppgaver', () => {
    const valuesMock = {
      ytelseType: fagsakYtelseType.OMSORGSDAGER,
      ukevalg: '2',
    };

    const wrapper = shallowWithIntl(<BeholdningHistorikkPanel
      intl={intl as IntlShape}
      beholdningPerDato={beholdningPerDatoV2}
      getValueFromLocalStorage={sinon.spy()}
      // @ts-ignore
    />).find(Form).renderProp('render')({ values: valuesMock });

    const graf = wrapper.find(HistorikkGraf);
    expect(graf).to.have.length(1);
    expect(graf.prop('historiskData')).is.eql([{ antall: 3, behandlingType: { kode: 'BT-002', navn: 'Førstegangssøknad' }, dato: dayjs().format(ISO_DATE_FORMAT) }]);
  });

  it('skal kun få ned omsorgspenger oppgaver', () => {
    const valuesMock = {
      ytelseType: fagsakYtelseType.OMSORGSPENGER,
      ukevalg: '2',
    };

    const wrapper = shallowWithIntl(<BeholdningHistorikkPanel
      intl={intl as IntlShape}
      beholdningPerDato={beholdningPerDatoV2}
      getValueFromLocalStorage={sinon.spy()}
      // @ts-ignore
    />).find(Form).renderProp('render')({ values: valuesMock });

    const graf = wrapper.find(HistorikkGraf);
    expect(graf).to.have.length(1);
    expect(graf.prop('historiskData')).is.eql([{
      antall: 1, behandlingType: { kode: 'BT-002', navn: 'Førstegangssøknad' }, dato: dayjs().format(ISO_DATE_FORMAT), fagsakYtelseType: { kode: 'OMP', navn: 'Omsorgspenger' },
    }]);
  });

  it('skal kun få ned pleiepenger oppgaver', () => {
    const valuesMock = {
      ytelseType: fagsakYtelseType.PLEIEPENGER_SYKT_BARN,
      ukevalg: '2',
    };

    const wrapper = shallowWithIntl(<BeholdningHistorikkPanel
      intl={intl as IntlShape}
      beholdningPerDato={beholdningPerDatoV2}
      getValueFromLocalStorage={sinon.spy()}
      // @ts-ignore
    />).find(Form).renderProp('render')({ values: valuesMock });

    const graf = wrapper.find(HistorikkGraf);
    expect(graf).to.have.length(1);
    expect(graf.prop('historiskData')).is.eql([{
      antall: 1, behandlingType: { kode: 'BT-002', navn: 'Førstegangssøknad' }, dato: dayjs().format(ISO_DATE_FORMAT), fagsakYtelseType: { kode: 'PSB', navn: 'Pleiepenger sykt barn' },
    }]);
  });

  it('skal slå sammen like behandlingstyper og datoer', () => {
    const valuesMock = {
      ytelseType: ALLE_YTELSETYPER_VALGT,
      ukevalg: '2',
    };
    const beholdningPerDato = [{
      fagsakYtelseType: fagsakYtelseTyper[0],
      behandlingType: forstegangssoknad,
      dato: dayjs().format(ISO_DATE_FORMAT),
      antall: 1,
    }, {
      fagsakYtelseType: fagsakYtelseTyper[1],
      behandlingType: forstegangssoknad,
      dato: dayjs().format(ISO_DATE_FORMAT),
      antall: 1,
    }];

    const wrapper = shallowWithIntl(<BeholdningHistorikkPanel
      intl={intl as IntlShape}
      beholdningPerDato={beholdningPerDato}
      getValueFromLocalStorage={sinon.spy()}
      // @ts-ignore
    />).find(Form).renderProp('render')({ values: valuesMock });

    const graf = wrapper.find(HistorikkGraf);
    expect(graf).to.have.length(1);
    expect(graf.prop('historiskData')).is.eql([{
      behandlingType: forstegangssoknad,
      dato: dayjs().format(ISO_DATE_FORMAT),
      antall: 2,
    }]);
  });
});
