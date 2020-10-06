import React from 'react';
import { expect } from 'chai';
import { Undertittel, Undertekst } from 'nav-frontend-typografi';

import Image from 'sharedComponents/Image';
import { IntlShape } from 'react-intl';
import { shallowWithIntl, intlMock } from 'testHelpers/intl-enzyme-test-helper';
import PersonInfo from './PersonInfo';
import MerkePanel from './Merkepanel';

describe('<PersonInfo>', () => {
  const intl: Partial<IntlShape> = {
    ...intlMock,
  };
  it('skal sjekke at props blir brukt korrekt', () => {
    const person = {
      navn: 'frida',
      personnummer: '12345678910',
      kjoenn: 'KVINNE',
      erDod: false,
      erVerge: true,
      diskresjonskode: '6',
      dodsdato: '2017.01.01',
      personstatusType: {
        kode: 'test',
        navn: 'test',
      },
    };
    const wrapper = shallowWithIntl(<PersonInfo.WrappedComponent
      intl={intl as IntlShape}
      person={person}
    />);

    const image = wrapper.find(Image);
    expect(image.prop('alt')).to.eql('Personinformasjon');

    const innholdstittel = wrapper.find(Undertittel);
    expect(innholdstittel.childAt(0).text()).to.eql('frida');
    const normaltekst = wrapper.find(Undertekst);
    expect(normaltekst.childAt(0).text()).to.eql('12345678910');
    const merkepanel = wrapper.find(MerkePanel);
    expect(merkepanel.prop('diskresjonskode')).to.eql('6');
  });
});
