import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { Form } from 'react-final-form';

import andreKriterierType from 'kodeverk/andreKriterierType';
import { InputField } from 'form/FinalFields';
import { shallowWithIntl, intlMock } from 'testHelpers/intl-enzyme-test-helper';
import { UtvalgskriterierForOppgavekoForm } from './UtvalgskriterierForOppgavekoForm';
import AutoLagringVedBlur from './AutoLagringVedBlur';
import BehandlingstypeVelger from './BehandlingstypeVelger';

describe('<UtvalgskriterierForOppgavekoForm>', () => {
  it('skal vise form som lar avdelingsleder endre navn på oppgaveko', () => {
    const oppgaveko = {
      id: '1',
      navn: 'Nyansatte',
      sistEndret: '2017-08-31',
      skjermet: false,
      andreKriterierTyper: [{
        kode: andreKriterierType.TIL_BESLUTTER,
        navn: 'Til beslutter',
      }, {
        kode: andreKriterierType.REGISTRER_PAPIRSOKNAD,
        navn: 'Registrer papirsøknad',
      }],
      saksbehandlere: [],
    };

    const wrapper = shallowWithIntl(<UtvalgskriterierForOppgavekoForm
      intl={intlMock}
      valgtOppgaveko={oppgaveko}
      lagreOppgavekoNavn={sinon.spy()}
      lagreOppgavekoBehandlingstype={sinon.spy()}
      lagreOppgavekoFagsakYtelseType={sinon.spy()}
      lagreOppgavekoSortering={sinon.spy()}
      lagreOppgavekoAndreKriterier={sinon.spy()}
      lagreOppgavekoSkjermet={sinon.spy()}
      valgtAvdelingEnhet="1"
      hentAntallOppgaverForOppgaveko={sinon.spy()}
    />).find(Form).drill((props) => props.render({ values: { erDynamiskPeriode: false } })).shallow();

    expect(wrapper.find(AutoLagringVedBlur)).to.have.length(1);
    expect(wrapper.find(BehandlingstypeVelger)).to.have.length(1);
    expect(wrapper.find(InputField)).to.have.length(1);
  });

  it('skal vise default-navn for oppgavekon når dette ikke er satt fra før', () => {
    const oppgaveko = {
      id: '1',
      navn: undefined,
      sistEndret: '2017-08-31',
      saksbehandlere: [],
      skjermet: false,
    };

    const wrapper = shallowWithIntl(<UtvalgskriterierForOppgavekoForm
      intl={intlMock}
      valgtOppgaveko={oppgaveko}
      lagreOppgavekoNavn={sinon.spy()}
      lagreOppgavekoBehandlingstype={sinon.spy()}
      lagreOppgavekoFagsakYtelseType={sinon.spy()}
      lagreOppgavekoSortering={sinon.spy()}
      lagreOppgavekoSkjermet={sinon.spy()}
      hentAntallOppgaverForOppgaveko={sinon.spy()}
      lagreOppgavekoAndreKriterier={sinon.spy()}
    />);

    const initialValues = wrapper.prop('initialValues');
    expect(initialValues).to.eql({
      id: '1',
      navn: 'Ny behandlingskø',
      sortering: undefined,
      fagsakYtelseType: '',
      fomDato: undefined,
      tomDato: undefined,
      skjermet: false,
    });
  });

  it('skal vise navn for oppgavekon når dette er satt fra før', () => {
    const oppgaveko = {
      id: '1',
      navn: 'Nyansatte',
      sistEndret: '2017-08-31',
      saksbehandlere: [],
      skjermet: false,
    };

    const wrapper = shallowWithIntl(<UtvalgskriterierForOppgavekoForm
      intl={intlMock}
      valgtOppgaveko={oppgaveko}
      lagreOppgavekoNavn={sinon.spy()}
      lagreOppgavekoBehandlingstype={sinon.spy()}
      lagreOppgavekoFagsakYtelseType={sinon.spy()}
      lagreOppgavekoSortering={sinon.spy()}
      lagreOppgavekoSkjermet={sinon.spy()}
      hentAntallOppgaverForOppgaveko={sinon.spy()}
      lagreOppgavekoAndreKriterier={sinon.spy()}
    />);

    const initialValues = wrapper.prop('initialValues');
    expect(initialValues).to.eql({
      id: '1',
      navn: 'Nyansatte',
      sortering: undefined,
      skjermet: false,
      fagsakYtelseType: '',
      fomDato: undefined,
      tomDato: undefined,
    });
  });

  it('skal lagre oppgavekonavn ved blur i navnefelt', () => {
    const oppgaveko = {
      id: '1',
      navn: 'Nyansatte',
      sistEndret: '2017-08-31',
      saksbehandlere: [],
      skjermet: false,
    };

    const lagreOppgavekoNavnFn = sinon.spy();

    const wrapper = shallowWithIntl(<UtvalgskriterierForOppgavekoForm
      intl={intlMock}
      valgtOppgaveko={oppgaveko}
      lagreOppgavekoNavn={lagreOppgavekoNavnFn}
      lagreOppgavekoBehandlingstype={sinon.spy()}
      lagreOppgavekoFagsakYtelseType={sinon.spy()}
      lagreOppgavekoSortering={sinon.spy()}
      lagreOppgavekoSkjermet={sinon.spy()}
      hentAntallOppgaverForOppgaveko={sinon.spy()}
      lagreOppgavekoAndreKriterier={sinon.spy()}
    />).find(Form).drill((props) => props.render({ values: { erDynamiskPeriode: false } })).shallow();

    const lagreComp = wrapper.find(AutoLagringVedBlur);

    lagreComp.prop('lagre')({
      id: '1',
      navn: 'Foreldrepenger',
    });

    expect(lagreOppgavekoNavnFn.calledOnce).to.be.true;
    const { args } = lagreOppgavekoNavnFn.getCalls()[0];
    expect(args).to.have.length(2);
    expect(args[0]).to.eql('1');
    expect(args[1]).to.eql('Foreldrepenger');
  });
});

it('skal sette opp korrekt formstate for andrekriterier', () => {
  const oppgaveko = {
    id: '1',
    navn: 'Nyansatte',
    sistEndret: '2017-08-31',
    saksbehandlere: [],
    skjermet: false,
    andreKriterier: [{
      andreKriterierType: {
        kode: andreKriterierType.TIL_BESLUTTER,
        navn: 'Til beslutter',
      },
      inkluder: true,
    }, {
      andreKriterierType: {
        kode: andreKriterierType.REGISTRER_PAPIRSOKNAD,
        navn: 'Registrer papirsoknad',
      },
      inkluder: false,
    }],
  };

  const wrapper = shallowWithIntl(<UtvalgskriterierForOppgavekoForm
    intl={intlMock}
    valgtOppgaveko={oppgaveko}
    lagreOppgavekoNavn={sinon.spy()}
    lagreOppgavekoBehandlingstype={sinon.spy()}
    lagreOppgavekoFagsakYtelseType={sinon.spy()}
    lagreOppgavekoSkjermet={sinon.spy()}
    lagreOppgavekoSortering={sinon.spy()}
    hentAntallOppgaverForOppgaveko={sinon.spy()}
    lagreOppgavekoAndreKriterier={sinon.spy()}
  />);

  const initialValues = wrapper.prop('initialValues');
  expect(initialValues).to.eql({
    id: '1',
    navn: 'Nyansatte',
    sortering: undefined,
    skjermet: false,
    fagsakYtelseType: '',
    fomDato: undefined,
    tomDato: undefined,
    [andreKriterierType.REGISTRER_PAPIRSOKNAD]: true,
    [`${andreKriterierType.REGISTRER_PAPIRSOKNAD}_inkluder`]: false,
    [andreKriterierType.TIL_BESLUTTER]: true,
    [`${andreKriterierType.TIL_BESLUTTER}_inkluder`]: true,
  });
});
