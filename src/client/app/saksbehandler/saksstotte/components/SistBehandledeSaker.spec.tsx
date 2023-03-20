import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import Lenke from 'nav-frontend-lenker';
import { K9LosApiKeys, RestApiGlobalStatePathsKeys } from 'api/k9LosApi';
import RestApiTestMocker from '../../../../../../setup/testHelpers/RestApiTestMocker';
import SistBehandledeSaker from './SistBehandledeSaker';

describe('<SistBehandledeSaker>', () => {
    it('skal vise sist behandlede saker som lenker i en liste', () => {
        const oppgaver = [
            {
                eksternId: '3',
                status: {
                    erReservert: false,
                },
                saksnummer: '1',
                behandlingId: 1,
                personnummer: '123456789',
                navn: 'Espen Utvikler',
                system: 'K9SAK',
                behandlingstype: {
                    kode: 'test',
                    navn: 'test',
                },
                behandlingStatus: {
                    kode: 'test',
                    navn: 'test',
                },
                opprettetTidspunkt: '2018-01-01',
                behandlingsfrist: '2018-01-01',
                fagsakYtelseType: {
                    kode: 'test',
                    navn: 'test',
                },
                erTilSaksbehandling: true,
            },
            {
                eksternId: '4',
                status: {
                    erReservert: false,
                },
                saksnummer: '2',
                behandlingId: 2,
                personnummer: '657643535',
                navn: 'Espen Solstråle',
                system: 'K9SAK',
                behandlingstype: {
                    kode: 'test',
                    navn: 'test',
                },
                behandlingStatus: {
                    kode: 'test',
                    navn: 'test',
                },
                opprettetTidspunkt: '2018-01-01',
                behandlingsfrist: '2018-01-01',
                fagsakYtelseType: {
                    kode: 'test',
                    navn: 'test',
                },
                erTilSaksbehandling: true,
            },
        ];

        new RestApiTestMocker()
            .withGlobalData(RestApiGlobalStatePathsKeys.K9SAK_URL, { verdi: 'url' })
            .withRestCall(K9LosApiKeys.BEHANDLEDE_OPPGAVER, oppgaver)
            .withDummyRunner()
            .runTest(() => {
                const wrapper = shallow(<SistBehandledeSaker />);

                const links = wrapper.find(Lenke);
                expect(links).to.have.length(2);
                expect(links.first().childAt(0).text()).to.eql('Espen Utvikler 123456789');
                expect(links.last().childAt(0).text()).to.eql('Espen Solstråle 657643535');
            });
    });

    it('skal ikke vise noen lenker når ingen behandlede saker blir funnet', () => {
        const oppgaver = [];

        new RestApiTestMocker()
            .withGlobalData(RestApiGlobalStatePathsKeys.K9SAK_URL, { verdi: 'url' })
            .withRestCall(K9LosApiKeys.BEHANDLEDE_OPPGAVER, oppgaver)
            .withDummyRunner()
            .runTest(() => {
                const wrapper = shallow(<SistBehandledeSaker />);

                expect(wrapper.find(Lenke)).to.have.length(0);
            });
    });
});
