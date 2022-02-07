import React from 'react';
import { useIntl } from 'react-intl';
import { Row, Column } from 'nav-frontend-grid';
import { Heading, Panel, Select } from '@navikt/ds-react';
import Hjelpetekst from 'nav-frontend-hjelpetekst';

import { setValueInLocalStorage } from 'utils/localStorageHelper';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import { uker, ytelseTyper } from './nokkeltall/nokkeltallUtils';

interface OwnProps {
  setAntallUkerSomSkalVises: (uker: string) => void;
  setValgtYtelseType: (ytelse: string) => void;
  tittel: string;
  children: JSX.Element;
  id?: string;
  hjelpetekst?: string;
}

const lagreTilLocalStorageCallback = (key, value, callback) => {
  setValueInLocalStorage(key, value);
  callback(value);
};

const GrafBoks = ({ setAntallUkerSomSkalVises, setValgtYtelseType, tittel, hjelpetekst, id, children }: OwnProps) => {
  const velgUkeHandler = value => {
    lagreTilLocalStorageCallback(`${id}-uker`, value, setAntallUkerSomSkalVises);
  };
  const velgYtelsesTypeHandler = value => {
    lagreTilLocalStorageCallback(`${id}-ytelsestype`, value, setValgtYtelseType);
  };

  const intl = useIntl();
  return (
    <Panel border>
      <div>
        <Heading spacing level="3" size="xsmall">
          {tittel}
        </Heading>
        {hjelpetekst && <Hjelpetekst>{hjelpetekst}</Hjelpetekst>}
      </div>
      <VerticalSpacer eightPx />
      <Row>
        <Column xs="3">
          <Select onChange={e => velgUkeHandler(e.target.value)} label="Antall uker som skal vises" hideLabel>
            {uker.map(u => (
              <option key={u.kode} value={u.kode}>
                {intl.formatMessage({ id: u.tekstKode })}
              </option>
            ))}
          </Select>
        </Column>
        <Column xs="3">
          <Select onChange={e => velgYtelsesTypeHandler(e.target.value)} label="Valgt ytelse" hideLabel>
            {ytelseTyper.map(u => (
              <option key={u.kode} value={u.kode}>
                {u.navn}
              </option>
            ))}
          </Select>
        </Column>
      </Row>
      <VerticalSpacer sixteenPx />
      {children}
    </Panel>
  );
};

export default GrafBoks;
