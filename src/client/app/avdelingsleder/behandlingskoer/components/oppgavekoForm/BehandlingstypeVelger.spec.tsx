import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import { K9LosApiKeys, RestApiGlobalStatePathsKeys } from 'api/k9LosApi';
import { CheckboxField } from 'form/FinalFields';
import behandlingType from 'kodeverk/behandlingType';
import kodeverkTyper from 'kodeverk/kodeverkTyper';
import RestApiTestMocker from '../../../../../../../setup/testHelpers/RestApiTestMocker';
import kodeverk from '../../../../../mocks/kodeverk';
import BehandlingstypeVelger from './BehandlingstypeVelger';

const behandlingTyper = [
	{
		kode: behandlingType.ANKE,
		navn: 'Anke',
	},
	{
		kode: behandlingType.FORSTEGANGSSOKNAD,
		navn: 'Førstegangssøknad',
	},
	{
		kode: behandlingType.INNSYN,
		navn: 'Dokumentinnsyn',
	},
	{
		kode: behandlingType.KLAGE,
		navn: 'Klage',
	},
	{
		kode: behandlingType.REVURDERING,
		navn: 'Revurdering',
	},
	{
		kode: behandlingType.TILBAKEBETALING,
		navn: 'Tilbakebetaling',
	},
	{
		kode: behandlingType.PAPIRSØKNAD,
		navn: 'Papirsøknad',
	},
	{
		kode: behandlingType.PAPIRETTERSENDELSE,
		navn: 'Papirettersendelse',
	},
	{
		kode: behandlingType.DIGITAL_ETTERSENDELSE,
		navn: 'Digital ettersendelse',
	},
	{
		kode: behandlingType.PAPIRINNTEKTSOPPLYSNINGER,
		navn: 'Papirinntektsopplysninger',
	},
	{
		kode: behandlingType.INNLOGGET_CHAT,
		navn: 'Innlogget chat',
	},
	{
		kode: behandlingType.SKRIV_TIL_OSS_SPØRMSÅL,
		navn: 'Skriv til oss spørsmål',
	},
	{
		kode: behandlingType.SKRIV_TIL_OSS_SVAR,
		navn: 'Srkiv til oss svar',
	},
	{
		kode: behandlingType.KOPI,
		navn: 'KOPI',
	},
	{
		kode: behandlingType.UKJENT,
		navn: 'Ukjent',
	},
	{
		kode: behandlingType.SAMTALEREFERAT,
		navn: 'Samtalereferat',
	},
	{
		kode: behandlingType.KOPI,
		navn: 'Kopi',
	},
	{
		kode: behandlingType.INNTEKTSMELDING_UTGÅTT,
		navn: 'INNTEKTSMELDING_UTGÅTT',
	},
	{
		kode: behandlingType.UTEN_FNR_DNR,
		navn: 'Uten fnr eller dnr',
	},
];

describe('<BehandlingstypeVelger>', () => {
	it('skal vise checkboxer for behandlingstyper', () => {
		new RestApiTestMocker()
			.withKodeverk(kodeverkTyper.BEHANDLING_TYPE, behandlingTyper)
			.withGlobalData(RestApiGlobalStatePathsKeys.KODEVERK, kodeverk)
			.withDummyRunner()
			.runTest(() => {
				const wrapper = shallow(
					<BehandlingstypeVelger valgtOppgavekoId="1" hentOppgaveko={sinon.spy()} valgteBehandlingstyper={[]} />,
				);

				const checkboxer = wrapper.find(CheckboxField);
				expect(checkboxer).to.have.length(6);
				expect(checkboxer.first().prop('name')).to.eql(behandlingType.ANKE);
				expect(checkboxer.last().prop('name')).to.eql(behandlingType.TILBAKEBETALING);
			});
	});

	it('skal lagre behandlingstype ved klikk på checkbox', () => {
		const lagreBehandlingTypeFn = sinon.spy();
		new RestApiTestMocker()
			.withKodeverk(kodeverkTyper.BEHANDLING_TYPE, behandlingTyper)
			.withGlobalData(RestApiGlobalStatePathsKeys.KODEVERK, kodeverk)
			.withRestCallRunner(K9LosApiKeys.LAGRE_OPPGAVEKO_BEHANDLINGSTYPE, {
				startRequest: (params) => {
					lagreBehandlingTypeFn(params);
					return Promise.resolve();
				},
			})
			.runTest(() => {
				const wrapper = shallow(
					<BehandlingstypeVelger valgtOppgavekoId="1" hentOppgaveko={sinon.spy()} valgteBehandlingstyper={[]} />,
				);

				const checkbox = wrapper.find(CheckboxField);
				checkbox.first().prop('onChange')(true);

				expect(lagreBehandlingTypeFn.calledOnce).to.be.true;
				const { args } = lagreBehandlingTypeFn.getCalls()[0];
				expect(args).to.have.length(1);
				expect(args[0].id).to.eql('1');
				expect(args[0].behandlingsTyper[0].behandlingType).to.eql('BT-008');
				expect(args[0].behandlingsTyper[0].checked).is.true;
			});
	});
});
