import React from 'react';
import { IntlShape } from 'react-intl';
import { expect } from 'chai';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';
import sinon from 'sinon';
import { intlMock, shallowWithIntl } from '../../../../../../setup/testHelpers/intl-enzyme-test-helper';
import { SletteOppgavekoModal } from './SletteOppgavekoModal';

describe('<SletteOppgavekoModal>', () => {
    const intl: IntlShape = {
        ...intlMock,
    };

    it('skal vise slette-modal med knapper for om en vil slette eller ikke', () => {
        const oppgaveko = {
            oppgavekoId: '1',
            navn: 'Nyansatte',
            sistEndret: '2017-01-01',
            erTilBeslutter: false,
            erRegistrerPapirsoknad: false,
            saksbehandlerIdenter: [],
            antallBehandlinger: 1,
        };

        const wrapper = shallowWithIntl(
            <SletteOppgavekoModal intl={intl} valgtOppgaveko={oppgaveko} cancel={sinon.spy()} submit={sinon.spy()} />,
        );

        expect(wrapper.find(Hovedknapp)).to.have.length(1);
        expect(wrapper.find(Knapp)).to.have.length(1);
    });

    it('skal kjøre slettefunksjon ved trykk på Ja-knapp', () => {
        const oppgaveko = {
            oppgavekoId: '1',
            navn: 'Nyansatte',
            sistEndret: '2017-01-01',
            erTilBeslutter: false,
            erRegistrerPapirsoknad: false,
            saksbehandlerIdenter: [],
            antallBehandlinger: 1,
        };
        const submitFn = sinon.spy();

        const wrapper = shallowWithIntl(
            <SletteOppgavekoModal intl={intl} valgtOppgaveko={oppgaveko} cancel={sinon.spy()} submit={submitFn} />,
        );

        const sletteknapp = wrapper.find(Hovedknapp);
        expect(sletteknapp).to.have.length(1);

        const slettFn = sletteknapp.prop('onClick') as () => void;
        slettFn();

        expect(submitFn.calledOnce).to.be.true;
        const { args } = submitFn.getCalls()[0];
        expect(args).to.have.length(1);
        expect(args[0]).to.eql(oppgaveko);
    });
});
