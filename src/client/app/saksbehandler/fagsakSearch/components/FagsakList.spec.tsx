import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';

import Table from 'sharedComponents/Table';
import { FagsakList } from './FagsakList';

describe('<FagsakList>', () => {
  const person = {
    navn: 'Frida',
    personnummer: '0405198632231',
    kjoenn: 'KVINNE',
    erDod: false,
  };

  const fagsak = {
    saksnummer: '12345',
    sakstype: {
      navn: '',
      kode: 'ES',
    },
    status: {
      navn: '',
      kode: 'UBEH',
    },
    opprettet: '16‎.‎07‎.‎2004‎ ‎17‎:‎35‎:‎21',
    endret: '16‎.‎07‎.‎2004‎ ‎17‎:‎35‎:‎21',
    person,
  };

  const fagsakStatusTyper = [{
    navn: 'Under behandling',
    kode: 'UBEH',
  }, {
    navn: 'Avsluttet',
    kode: 'AVSLU',
  }];
  const fagsakYtelseTyper = [{
    navn: 'Engangsstonad',
    kode: 'ES',
  }, {
    navn: 'Engangsstonad',
    kode: 'TEST',
  }];

  const headerTextCodes = [
    'FagsakList.Saksnummer',
    'FagsakList.Stonadstype',
    'FagsakList.Behandlingstype',
    'EMPTY_1',
  ];
});
