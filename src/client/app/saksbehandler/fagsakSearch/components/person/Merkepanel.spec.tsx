import React from 'react';
import { FormattedMessage, IntlShape } from 'react-intl';
import { expect } from 'chai';
import diskresjonskodeType from 'kodeverk/diskresjonskodeType';
import { intlMock, shallowWithIntl } from '../../../../../../../setup/testHelpers/intl-enzyme-test-helper';
import { MerkePanel } from './Merkepanel';

describe('<MerkePanel>', () => {
  const intl: IntlShape = {
    ...intlMock,
  };
  it('skal sjekke at kun merking om død vises når person er død', () => {
    const wrapper = shallowWithIntl(<MerkePanel erDod diskresjonskode={diskresjonskodeType.KODE6} intl={intl} />);
    expect(wrapper.find(FormattedMessage).prop('id')).to.equal('MerkePanel.Dod');
  });
});
