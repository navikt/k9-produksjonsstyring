import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import behandlingStatus from 'kodeverk/behandlingStatus';
import behandlingType from 'kodeverk/behandlingType';
import fagsakYtelseType from 'kodeverk/fagsakYtelseType';
import FlyttReservasjonModal from './FlyttReservasjonModal';
import MenuButton from './MenuButton';
import OppgaveHandlingerMenu from './OppgaveHandlingerMenu';
import OpphevReservasjonModal from './OpphevReservasjonModal';

describe('<OppgaveHandlingerMenu>', () => {
	const oppgave = {
		eksternId: '1',
		status: {
			erReservert: false,
			reservertTilTidspunkt: '2020-02-02T23:59',
		},
		saksnummer: '1',
		behandlingId: 2,
		personnummer: '1234567',
		navn: 'Walter Lemon',
		system: 'K9SAK',
		behandlingstype: {
			kode: behandlingType.FORSTEGANGSSOKNAD,
			navn: '',
		},
		opprettetTidspunkt: '2017-01-01',
		behandlingsfrist: '2017-01-01',
		erTilSaksbehandling: true,
		fagsakYtelseType: {
			kode: fagsakYtelseType.OMSORGSPENGER,
			navn: 'OMP',
		},
		behandlingStatus: {
			kode: behandlingStatus.OPPRETTET,
			navn: '',
		},
	};

	it('skal rendre meny med to knapper og vise tidspunkt reservasjonen gjelder til', () => {
		const wrapper = shallow(
			<OppgaveHandlingerMenu
				toggleMenu={sinon.spy()}
				offset={{
					top: 10,
					left: 20,
				}}
				oppgave={oppgave}
				imageNode={<div />}
				forlengOppgaveReservasjon={sinon.spy()}
				hentReserverteOppgaver={sinon.spy()}
			/>,
		);

		expect(wrapper.find(MenuButton)).has.length(3);
	});

	it('skal vise modal for oppheving av reservasjon ved klikk på menyknapp og så lukke den ved å avbryte i modal', () => {
		const wrapper = shallow(
			<OppgaveHandlingerMenu
				toggleMenu={sinon.spy()}
				offset={{
					top: 10,
					left: 20,
				}}
				oppgave={oppgave}
				imageNode={<div />}
				forlengOppgaveReservasjon={sinon.spy()}
				hentReserverteOppgaver={sinon.spy()}
			/>,
		);
		expect(wrapper.find(OpphevReservasjonModal)).has.length(0);

		const menuButton = wrapper.find(MenuButton).first();
		menuButton.prop('onClick')();

		const modal = wrapper.find(OpphevReservasjonModal);
		expect(modal).has.length(1);

		modal.prop('cancel')();

		expect(wrapper.find(OpphevReservasjonModal)).has.length(0);
	});

	it('skal vise modal for oppheving av reservasjon', () => {
		const wrapper = shallow(
			<OppgaveHandlingerMenu
				toggleMenu={sinon.spy()}
				offset={{
					top: 10,
					left: 20,
				}}
				oppgave={oppgave}
				imageNode={<div />}
				forlengOppgaveReservasjon={sinon.spy()}
				hentReserverteOppgaver={sinon.spy()}
			/>,
		);

		const menuButton = wrapper.find(MenuButton).first();
		menuButton.prop('onClick')();

		const modal = wrapper.find(OpphevReservasjonModal);
		expect(modal).has.length(1);
	});

	it('skal vise modal for forlenging av reservasjon', async () => {
		const forlengOppgaveReservasjonFn = (oppgaveId) => Promise.resolve(`${oppgaveId}`);
		const wrapper = shallow(
			<OppgaveHandlingerMenu
				toggleMenu={sinon.spy()}
				offset={{
					top: 10,
					left: 20,
				}}
				oppgave={oppgave}
				imageNode={<div />}
				forlengOppgaveReservasjon={forlengOppgaveReservasjonFn}
				hentReserverteOppgaver={sinon.spy()}
			/>,
		);

		const menuButton = wrapper.find(MenuButton).at(1);
		await menuButton.prop('onClick')();
	});

	it('skal vise modal for flytting av reservasjon', () => {
		const wrapper = shallow(
			<OppgaveHandlingerMenu
				toggleMenu={sinon.spy()}
				offset={{
					top: 10,
					left: 20,
				}}
				oppgave={oppgave}
				imageNode={<div />}
				forlengOppgaveReservasjon={sinon.spy()}
				hentReserverteOppgaver={sinon.spy()}
			/>,
		);

		const menuButton = wrapper.find(MenuButton).last();
		menuButton.prop('onClick')();

		expect(wrapper.find(FlyttReservasjonModal)).has.length(1);
	});

	it('skal flytte reservasjon og så lukke modal', () => {
		const wrapper = shallow(
			<OppgaveHandlingerMenu
				toggleMenu={sinon.spy()}
				offset={{
					top: 10,
					left: 20,
				}}
				oppgave={oppgave}
				imageNode={<div />}
				forlengOppgaveReservasjon={sinon.spy()}
				hentReserverteOppgaver={sinon.spy()}
			/>,
		);

		wrapper.setState({ showFlyttReservasjonModal: true });

		const modal = wrapper.find(FlyttReservasjonModal);
		expect(modal).to.have.length(1);
	});
});
