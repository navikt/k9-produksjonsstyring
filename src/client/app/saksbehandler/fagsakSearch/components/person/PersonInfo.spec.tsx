
import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { Undertittel, Undertekst } from 'nav-frontend-typografi';

import Image from 'sharedComponents/Image';
import PersonInfo from './PersonInfo';
import AlderVisning from './Aldervisning';
import MerkePanel from './Merkepanel';

describe('<PersonInfo>', () => {
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
    const wrapper = shallow(<PersonInfo
      person={person}
      isPrimaryParent
      medPanel
    />);

    const image = wrapper.find(Image);
    expect(image.prop('altCode')).to.eql('Person.ImageText');
    expect(image.prop('titleCode')).to.eql('Person.Woman');

    const innholdstittel = wrapper.find(Undertittel);
    expect(innholdstittel.childAt(0).text()).to.eql('frida');
    const normaltekst = wrapper.find(Undertekst);
    expect(normaltekst.childAt(0).text()).to.eql('12345678910');
  });

  it('skal vise annen title når søker er mann ', () => {
    const person = {
      navn: 'Espen',
      personnummer: '12345678910',
      kjoenn: 'MANN',
      erDod: false,
      erVerge: true,
      diskresjonskode: '6',
      dodsdato: '2017.01.01',
      personstatusType: {
        kode: 'test',
        navn: 'test',
      },
    };
    const wrapper = shallow(<PersonInfo
      person={person}
      isPrimaryParent
      medPanel
    />);

    const image = wrapper.find(Image);
    expect(image.prop('titleCode')).to.eql('Person.Man');
  });
});
