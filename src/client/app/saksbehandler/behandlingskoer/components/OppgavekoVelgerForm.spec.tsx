import React from 'react';
import { Form } from 'react-final-form';
import { FormattedMessage, IntlShape } from 'react-intl';
import { expect } from 'chai';
import sinon from 'sinon';
import { K9LosApiKeys, RestApiGlobalStatePathsKeys } from 'api/k9LosApi';
import { SelectField } from 'form/FinalFields';
import andreKriterierType from 'kodeverk/andreKriterierType';
import behandlingType from 'kodeverk/behandlingType';
import fagsakYtelseType from 'kodeverk/fagsakYtelseType';
import Image from 'sharedComponents/Image';
import LabelWithHeader from 'sharedComponents/LabelWithHeader';
import RestApiTestMocker from '../../../../../../setup/testHelpers/RestApiTestMocker';
import { intlMock, shallowWithIntl } from '../../../../../../setup/testHelpers/intl-enzyme-test-helper';
import kodeverk from '../../../../mocks/kodeverk';
import OppgavekoVelgerForm from './OppgavekoVelgerForm';

describe('<OppgavekoVelgerForm>', () => {
	const intl: IntlShape = {
		...intlMock,
	};

	const saksbehandlere = [
		{
			brukerIdent: 'T120101',
			navn: 'Espen Utvikler',
			epost: 'epost',
		},
		{
			brukerIdent: 'A120102',
			navn: 'Auto Joachim',
			epost: 'epost',
		},
		{
			brukerIdent: 'T120102',
			navn: 'Helge Ingstad',
			epost: 'epost',
		},
	];

	it('skal vise dropdown med to oppgavekoer', () => {
		const formProps = {};
		const oppgavekoer = [
			{
				id: '1',
				navn: 'Testliste 1',
				behandlingTyper: [],
				fagsakYtelseTyper: [],
				andreKriterier: [],
				skjermet: false,
				sortering: {
					sorteringType: {
						kode: 'test',
						navn: 'test',
					},
					fra: 1,
					til: 2,
					fomDato: '2019-01-01',
					tomDato: '2019-01-10',
				},
			},
			{
				id: '2',
				navn: 'Testliste 2',
				behandlingTyper: [],
				fagsakYtelseTyper: [],
				andreKriterier: [],
				skjermet: false,
				sortering: {
					sorteringType: {
						kode: 'test',
						navn: 'test',
					},
					fra: 1,
					til: 2,
					fomDato: '2019-01-01',
					tomDato: '2019-01-10',
				},
			},
		];
		new RestApiTestMocker()
			.withRestCallRunner(K9LosApiKeys.OPPGAVEKO_SAKSBEHANDLERE, { data: saksbehandlere })
			.withRestCallRunner(K9LosApiKeys.BEHANDLINGSKO_OPPGAVE_ANTALL, { startRequest: () => undefined, data: 10 })
			.runTest(() => {
				const wrapper = shallowWithIntl(
					<OppgavekoVelgerForm.WrappedComponent
						intl={intl}
						oppgavekoer={oppgavekoer}
						plukkNyOppgave={sinon.spy()}
						setValgtOppgavekoId={sinon.spy()}
						getValueFromLocalStorage={sinon.spy()}
						setValueInLocalStorage={sinon.spy()}
						removeValueFromLocalStorage={sinon.spy()}
						erRestApiKallLoading={false}
					/>,
				)
					.find(Form)
					.renderProp('render')(formProps);

				const select = wrapper.find(SelectField);
				expect(select).to.have.length(1);
				const options = select.prop('selectValues') as {
					key: number;
					props: { value: string; children: string };
				}[];
				expect(options[0].key).to.eql('1');
				expect(options[0].props.value).to.eql('1');
				expect(options[0].props.children).to.eql('Testliste 1');
				expect(options[1].key).to.eql('2');
				expect(options[1].props.value).to.eql('2');
				expect(options[1].props.children).to.eql('Testliste 2');
			});
	});

	it('skal ikke vise informasjon om oppgavekø når ingen oppgavekø er valgt', () => {
		const oppgavekoer = [
			{
				id: '1',
				navn: 'Testliste 1',
				behandlingTyper: [],
				fagsakYtelseTyper: [],
				andreKriterier: [],
				skjermet: false,
				sortering: {
					sorteringType: {
						kode: 'test',
						navn: 'test',
					},
					fra: 1,
					til: 2,
					fomDato: '2019-01-01',
					tomDato: '2019-01-10',
				},
			},
		];

		const formProps = { values: { id: undefined } };
		new RestApiTestMocker()
			.withRestCallRunner(K9LosApiKeys.OPPGAVEKO_SAKSBEHANDLERE, { data: saksbehandlere })
			.withRestCallRunner(K9LosApiKeys.BEHANDLINGSKO_OPPGAVE_ANTALL, { startRequest: () => undefined, data: 10 })
			.runTest(() => {
				const wrapper = shallowWithIntl(
					<OppgavekoVelgerForm.WrappedComponent
						intl={intl}
						oppgavekoer={oppgavekoer}
						setValgtOppgavekoId={sinon.spy()}
						plukkNyOppgave={sinon.spy()}
						getValueFromLocalStorage={sinon.spy()}
						setValueInLocalStorage={sinon.spy()}
						removeValueFromLocalStorage={sinon.spy()}
						erRestApiKallLoading={false}
					/>,
				)
					.find(Form)
					.renderProp('render')(formProps);

				expect(wrapper.find(LabelWithHeader)).to.have.length(0);
			});
	});

	it('skal vise at alle behandlingstyper og fagsakYtelseTyper er valgt når ingen verdier er oppgitt', () => {
		const oppgavekoer = [
			{
				id: '1',
				navn: 'Testliste 1',
				behandlingTyper: [],
				fagsakYtelseTyper: [],
				andreKriterier: [],
				skjermet: false,
				sortering: {
					sorteringType: {
						kode: 'test',
						navn: 'Sortert på noko',
					},
					fra: 1,
					til: 2,
					fomDato: '2019-01-01',
					tomDato: '2019-01-10',
				},
			},
		];

		const formProps = { values: { id: '1' } };
		new RestApiTestMocker()
			.withRestCallRunner(K9LosApiKeys.OPPGAVEKO_SAKSBEHANDLERE, { data: saksbehandlere })
			.withRestCallRunner(K9LosApiKeys.BEHANDLINGSKO_OPPGAVE_ANTALL, { startRequest: () => undefined, data: 10 })
			.runTest(() => {
				const wrapper = shallowWithIntl(
					<OppgavekoVelgerForm.WrappedComponent
						intl={intl}
						oppgavekoer={oppgavekoer}
						setValgtOppgavekoId={sinon.spy()}
						plukkNyOppgave={sinon.spy()}
						getValueFromLocalStorage={sinon.spy()}
						setValueInLocalStorage={sinon.spy()}
						removeValueFromLocalStorage={sinon.spy()}
						erRestApiKallLoading={false}
					/>,
				)
					.find(Form)
					.renderProp('render')(formProps);

				const labels = wrapper.find(LabelWithHeader);
				expect(labels).to.have.length(4);
				expect(labels.first().prop('texts')).to.eql(['Alle']);
				expect(labels.at(0).prop('texts')).to.eql(['Alle']);
				expect(labels.at(1).prop('texts')).to.eql(['Alle']);
			});
	});

	it('skal vise at alle behandlingstyper er valgt når alle verdiene er oppgitt', () => {
		const oppgavekoer = [
			{
				id: '1',
				navn: 'Testliste 1',
				behandlingTyper: [behandlingType.FORSTEGANGSSOKNAD],
				fagsakYtelseTyper: [],
				andreKriterier: [],
				skjermet: false,
				sortering: {
					sorteringType: {
						kode: 'test',
						navn: 'Sortert på noko',
					},
					fra: 1,
					til: 2,
					fomDato: '2019-01-01',
					tomDato: '2019-01-10',
				},
			},
		];

		const formProps = { values: { id: '1' } };
		new RestApiTestMocker()
			.withRestCallRunner(K9LosApiKeys.OPPGAVEKO_SAKSBEHANDLERE, { data: saksbehandlere })
			.withRestCallRunner(K9LosApiKeys.BEHANDLINGSKO_OPPGAVE_ANTALL, { startRequest: () => undefined, data: 10 })
			.withGlobalData(RestApiGlobalStatePathsKeys.KODEVERK, kodeverk)
			.runTest(() => {
				// totaltBehandlingTypeAntall er satt til 1 som er lik antall behandlingstypar satt på sakslisten
				const wrapper = shallowWithIntl(
					<OppgavekoVelgerForm.WrappedComponent
						intl={intl}
						oppgavekoer={oppgavekoer}
						setValgtOppgavekoId={sinon.spy()}
						plukkNyOppgave={sinon.spy()}
						getValueFromLocalStorage={sinon.spy()}
						setValueInLocalStorage={sinon.spy()}
						removeValueFromLocalStorage={sinon.spy()}
						erRestApiKallLoading={false}
					/>,
				)
					.find(Form)
					.renderProp('render')(formProps);

				const labels = wrapper.find(LabelWithHeader);
				expect(labels).to.have.length(4);
				expect(labels.first().prop('texts')).to.eql(['Alle']);
				expect(labels.at(1).prop('texts')).to.eql(['Førstegangsbehandling']);
			});
	});

	it('skal vise valgte behandlingstyper og fagsakYtelseTyper', () => {
		const oppgavekoer = [
			{
				id: '1',
				navn: 'Testliste 1',
				behandlingTyper: [behandlingType.FORSTEGANGSSOKNAD, behandlingType.REVURDERING],
				fagsakYtelseTyper: [fagsakYtelseType.PLEIEPENGER_SYKT_BARN],
				andreKriterier: [],
				skjermet: false,
				sortering: {
					sorteringType: {
						kode: 'test',
						navn: 'Sortert på noko',
					},
					fra: 1,
					til: 2,
					fomDato: '2019-01-01',
					tomDato: '2019-01-10',
				},
			},
		];

		const formProps = { values: { id: '1' } };
		new RestApiTestMocker()
			.withRestCallRunner(K9LosApiKeys.OPPGAVEKO_SAKSBEHANDLERE, { data: saksbehandlere })
			.withRestCallRunner(K9LosApiKeys.BEHANDLINGSKO_OPPGAVE_ANTALL, { startRequest: () => undefined, data: 10 })
			.withGlobalData(RestApiGlobalStatePathsKeys.KODEVERK, kodeverk)
			.runTest(() => {
				const wrapper = shallowWithIntl(
					<OppgavekoVelgerForm.WrappedComponent
						intl={intl}
						oppgavekoer={oppgavekoer}
						setValgtOppgavekoId={sinon.spy()}
						plukkNyOppgave={sinon.spy()}
						getValueFromLocalStorage={sinon.spy()}
						setValueInLocalStorage={sinon.spy()}
						removeValueFromLocalStorage={sinon.spy()}
						erRestApiKallLoading={false}
					/>,
				)
					.find(Form)
					.renderProp('render')(formProps);

				const labels = wrapper.find(LabelWithHeader);
				expect(labels).to.have.length(4);
				expect(labels.first().prop('texts')).to.eql(['Pleiepenger sykt barn']);
				expect(labels.at(1).prop('texts')).to.eql(['Førstegangsbehandling', 'Revurdering']);
			});
	});

	it('skal vise valgte andre kriterier som er inkluderte', () => {
		const oppgavekoer = [
			{
				id: '1',
				navn: 'Testliste 1',
				behandlingTyper: [],
				fagsakYtelseTyper: [],
				andreKriterier: [
					{
						andreKriterierType: {
							kode: andreKriterierType.TIL_BESLUTTER,
							navn: 'Til beslutter',
						},
						inkluder: true,
					},
				],
				skjermet: false,
				sortering: {
					sorteringType: {
						kode: 'test',
						navn: 'test',
					},
					fomDato: '2019-01-01',
					tomDato: '2019-01-10',
				},
			},
		];

		const formProps = { values: { id: '1' } };
		new RestApiTestMocker()
			.withRestCallRunner(K9LosApiKeys.OPPGAVEKO_SAKSBEHANDLERE, { data: saksbehandlere })
			.withRestCallRunner(K9LosApiKeys.BEHANDLINGSKO_OPPGAVE_ANTALL, { startRequest: () => undefined, data: 10 })
			.runTest(() => {
				const wrapper = shallowWithIntl(
					<OppgavekoVelgerForm.WrappedComponent
						intl={intl}
						oppgavekoer={oppgavekoer}
						setValgtOppgavekoId={sinon.spy()}
						plukkNyOppgave={sinon.spy()}
						getValueFromLocalStorage={sinon.spy()}
						setValueInLocalStorage={sinon.spy()}
						removeValueFromLocalStorage={sinon.spy()}
						erRestApiKallLoading={false}
					/>,
				)
					.find(Form)
					.renderProp('render')(formProps);

				const labels = wrapper.find(LabelWithHeader);
				expect(labels).to.have.length(4);
				expect(labels.at(2).prop('texts')).to.eql(['Til beslutter']);
			});
	});

	it('skal vise valgte andre kriterier som er ekskludert', () => {
		const oppgavekoer = [
			{
				id: '1',
				navn: 'Testliste 1',
				behandlingTyper: [],
				fagsakYtelseTyper: [],
				andreKriterier: [
					{
						andreKriterierType: {
							kode: andreKriterierType.TIL_BESLUTTER,
							navn: 'Til beslutter',
						},
						inkluder: false,
					},
				],
				skjermet: false,
				sortering: {
					sorteringType: {
						kode: 'test',
						navn: 'test',
					},
					fomDato: '2019-01-01',
					tomDato: '2019-01-10',
				},
			},
		];

		const formProps = { values: { id: '1' } };

		new RestApiTestMocker()
			.withRestCallRunner(K9LosApiKeys.OPPGAVEKO_SAKSBEHANDLERE, { data: saksbehandlere })
			.withRestCallRunner(K9LosApiKeys.BEHANDLINGSKO_OPPGAVE_ANTALL, { startRequest: () => undefined, data: 10 })
			.runTest(() => {
				const wrapper = shallowWithIntl(
					<OppgavekoVelgerForm.WrappedComponent
						intl={intl}
						oppgavekoer={oppgavekoer}
						setValgtOppgavekoId={sinon.spy()}
						plukkNyOppgave={sinon.spy()}
						getValueFromLocalStorage={sinon.spy()}
						setValueInLocalStorage={sinon.spy()}
						removeValueFromLocalStorage={sinon.spy()}
						erRestApiKallLoading={false}
					/>,
				)
					.find(Form)
					.renderProp('render')(formProps);

				const labels = wrapper.find(LabelWithHeader);
				expect(labels).to.have.length(4);
				expect(labels.at(2).prop('texts')).to.eql(['Uten: Til beslutter']);
			});
	});

	it('skal vise at alle andre kriterier er valgte', () => {
		const oppgavekoer = [
			{
				id: '1',
				navn: 'Testliste 1',
				behandlingTyper: [],
				fagsakYtelseTyper: [],
				andreKriterier: [],
				skjermet: false,
				sortering: {
					sorteringType: {
						kode: 'test',
						navn: 'test',
					},
					fomDato: '2019-01-01',
					tomDato: '2019-01-10',
				},
			},
		];

		const formProps = { values: { id: '1' } };
		new RestApiTestMocker()
			.withRestCallRunner(K9LosApiKeys.OPPGAVEKO_SAKSBEHANDLERE, { data: saksbehandlere })
			.withRestCallRunner(K9LosApiKeys.BEHANDLINGSKO_OPPGAVE_ANTALL, { startRequest: () => undefined, data: 10 })
			.runTest(() => {
				const wrapper = shallowWithIntl(
					<OppgavekoVelgerForm.WrappedComponent
						intl={intl}
						oppgavekoer={oppgavekoer}
						setValgtOppgavekoId={sinon.spy()}
						plukkNyOppgave={sinon.spy()}
						getValueFromLocalStorage={sinon.spy()}
						setValueInLocalStorage={sinon.spy()}
						removeValueFromLocalStorage={sinon.spy()}
						erRestApiKallLoading={false}
					/>,
				)
					.find(Form)
					.renderProp('render')(formProps);

				const labels = wrapper.find(LabelWithHeader);
				expect(labels).to.have.length(4);
				expect(labels.at(2).prop('texts')).to.eql(['Alle']);
			});
	});

	it('skal vise køens saksbehandlere i tooltip', () => {
		const oppgavekoer = [
			{
				id: '1',
				navn: 'Testliste 1',
				behandlingTyper: [],
				fagsakYtelseTyper: [],
				andreKriterier: [],
				skjermet: false,
				sortering: {
					sorteringType: {
						kode: 'test',
						navn: 'test',
					},
					fra: 1,
					til: 2,
					fomDato: '2019-01-01',
					tomDato: '2019-01-10',
				},
			},
		];

		const formProps = { values: { id: '1' } };
		new RestApiTestMocker()
			.withRestCallRunner(K9LosApiKeys.OPPGAVEKO_SAKSBEHANDLERE, { data: saksbehandlere })
			.withRestCallRunner(K9LosApiKeys.BEHANDLINGSKO_OPPGAVE_ANTALL, { startRequest: () => undefined, data: 10 })
			.runTest(() => {
				const wrapper = shallowWithIntl(
					<OppgavekoVelgerForm.WrappedComponent
						intl={intl}
						oppgavekoer={oppgavekoer}
						setValgtOppgavekoId={sinon.spy()}
						getValueFromLocalStorage={sinon.spy()}
						plukkNyOppgave={sinon.spy()}
						setValueInLocalStorage={sinon.spy()}
						removeValueFromLocalStorage={sinon.spy()}
						erRestApiKallLoading={false}
					/>,
				)
					.find(Form)
					.renderProp('render')(formProps);

				const image = wrapper.find(Image);
				expect(image).to.have.length(1);
				const tooltip = shallowWithIntl(image.first().prop('tooltip'));
				expect(tooltip.find(FormattedMessage).prop('id')).to.eql('OppgavekoVelgerForm.SaksbehandlerToolip');
			});
	});
});
