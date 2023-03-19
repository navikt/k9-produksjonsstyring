import React from 'react';
import { IntlShape } from 'react-intl';
import { expect } from 'chai';
import { Undertekst, Undertittel } from 'nav-frontend-typografi';
import Image from 'sharedComponents/Image';
import { intlMock, shallowWithIntl } from '../../../../../../../setup/testHelpers/intl-enzyme-test-helper';
import PersonInfo from './PersonInfo';

describe('<PersonInfo>', () => {
  const intl: IntlShape = {
    ...intlMock,
  };
  it('skal sjekke at props blir brukt korrekt', () => {
    const person = {
      navn: 'frida',
      personnummer: '12345678910',
      kjoenn: 'KVINNE',
      erDod: false,
      erVerge: true,
      personstatusType: {
        kode: 'test',
        navn: 'test',
      },
    };
    const wrapper = shallowWithIntl(<PersonInfo.WrappedComponent intl={intl} person={person} />);

    const image = wrapper.find(Image);
    expect(image.prop('alt')).to.eql('Personinformasjon');

    const innholdstittel = wrapper.find(Undertittel);
    expect(innholdstittel.childAt(0).text()).to.eql('frida');
    const normaltekst = wrapper.find(Undertekst);
    expect(normaltekst.childAt(0).text()).to.eql('12345678910');
  });
});
