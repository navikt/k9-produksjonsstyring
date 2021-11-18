import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { Form } from 'react-final-form';

import { intlMock, shallowWithIntl } from '../../../../../../../setup/testHelpers/intl-enzyme-test-helper';
import behandlingType from 'kodeverk/behandlingType';
import { SelectField } from 'form/FinalFields';
import fagsakYtelseType from 'kodeverk/fagsakYtelseType';
import RestApiTestMocker from '../../../../../../../setup/testHelpers/RestApiTestMocker';
import kodeverkTyper from 'kodeverk/kodeverkTyper';
import { IntlShape } from 'react-intl';
import { NyeHistorikkPanel } from './NyeHistorikkPanel';

const intl: Partial<IntlShape> = {
  ...intlMock,
};
const fagsakYtelseTyper = [{
  kode: fagsakYtelseType.PLEIEPENGER_SYKT_BARN,
  navn: 'Pleiepenger sykt barn',
}, {
  kode: fagsakYtelseType.OMSORGSPENGER,
  navn: 'Omsorgspenger',
}, {
  kode: fagsakYtelseType.OMSORGSDAGER,
  navn: 'Omsorgsdager',
}, {
  kode: fagsakYtelseType.PUNSJ,
  navn: 'Punsj',
}];

const behandlingTyper = [{
  kode: behandlingType.FORSTEGANGSSOKNAD,
  navn: 'Førstegangssøknad',
}, {
  kode: behandlingType.KLAGE,
  navn: 'Klage',
}, {
  kode: behandlingType.INNSYN,
  navn: 'Dokumentinnsyn',
}, {
  kode: behandlingType.REVURDERING,
  navn: 'Revurdering',
}, {
  kode: behandlingType.ANKE,
  navn: 'Anke',
}];

describe('<NyeHistorikkPanel>', () => {
  it('skal vise ytelsetyper i radioknapper', () => {
    const valuesMock = {
      valgtYtelseType: 'ALLE',
    };

    new RestApiTestMocker()
      .withKodeverk(kodeverkTyper.BEHANDLING_TYPE, behandlingTyper)
      .withKodeverk(kodeverkTyper.FAGSAK_YTELSE_TYPE, fagsakYtelseTyper)
      .runTest(() => {
        const wrapper = shallowWithIntl(<NyeHistorikkPanel
          intl={intl as IntlShape}
          width={300}
          height={200}
          nyePerDato={[]}
          getValueFromLocalStorage={sinon.spy()}
        />).find(Form).renderProp('render')({ values: valuesMock });

        const selectUker = wrapper.find(SelectField).first();
        expect(selectUker).to.have.length(1);

        const optionsUker = selectUker.prop('selectValues') as { props: { value: string; children: string }}[];
        expect(optionsUker).to.have.length(2);
        expect(optionsUker[0].props.value).to.eql('4');
        expect(optionsUker[0].props.children).to.eql('4 siste uker');
        expect(optionsUker[1].props.value).to.eql('8');
        expect(optionsUker[1].props.children).to.eql('8 siste uker');

        const selectYtelse = wrapper.find(SelectField).at(1);
        expect(selectYtelse).to.have.length(1);

        const optionsYtelse = selectYtelse.prop('selectValues') as { props: { value: string; children: string }}[];
        expect(optionsYtelse).to.have.length(5);
        expect(optionsYtelse[0].props.value).to.eql(fagsakYtelseTyper[1].kode);
        expect(optionsYtelse[0].props.children).to.eql(fagsakYtelseTyper[1].navn);
        expect(optionsYtelse[1].props.value).to.eql(fagsakYtelseTyper[2].kode);
        expect(optionsYtelse[1].props.children).to.eql(fagsakYtelseTyper[2].navn);
        expect(optionsYtelse[2].props.value).to.eql(fagsakYtelseTyper[0].kode);
        expect(optionsYtelse[2].props.children).to.eql(fagsakYtelseTyper[0].navn);
        expect(optionsYtelse[3].props.value).to.eql(fagsakYtelseTyper[3].kode);
        expect(optionsYtelse[3].props.children).to.eql(fagsakYtelseTyper[3].navn);
        expect(optionsYtelse[4].props.value).to.eql('ALLE');
        expect(optionsYtelse[4].props.children).to.eql('Alle ytelser');
      });
  });
});
