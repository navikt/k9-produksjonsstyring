import React from 'react';
import { useIntl } from 'react-intl';
import { Row, Column } from 'nav-frontend-grid';
import { Heading, Panel, Select } from '@navikt/ds-react';
import Hjelpetekst from 'nav-frontend-hjelpetekst';

import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import { ytelseTyper } from './nokkeltall/nokkeltallUtils';

interface OwnProps {
  setAntallUkerSomSkalVises: (uker: string) => void;
  setValgtYtelseType: (ytelse: string) => void;
  tittel: string;
  children: JSX.Element;
  hjelpetekst?: string;
}

const GrafBoks = ({ setAntallUkerSomSkalVises, setValgtYtelseType, tittel, hjelpetekst, children }: OwnProps) => {
  const intl = useIntl();
  return (
    <Panel border>
      <div>
        <Heading spacing level="3" size="medium">
          {tittel}
        </Heading>
        {hjelpetekst && <Hjelpetekst>{hjelpetekst}</Hjelpetekst>}
      </div>
      <VerticalSpacer eightPx />
      <Row>
        <Column xs="2">
          <Select onChange={e => setAntallUkerSomSkalVises(e.target.value)} label="Antall uker som skal vises">
            <option value="2" selected>
              {intl.formatMessage({ id: 'BehandlingerGårAvVent.ToNesteUker' })}
            </option>
            <option value="4">{intl.formatMessage({ id: 'BehandlingerGårAvVent.FireNesteUker' })}</option>
          </Select>
        </Column>
        <Column xs="2">
          <Select onChange={e => setValgtYtelseType(e.target.value)} label="Valgt ytelse">
            <option value="" disabled selected>
              {intl.formatMessage({ id: 'BehandlingerGårAvVent.VelgFagytelseType' })}
            </option>
            {ytelseTyper.map(ytelseValg => (
              <option key={ytelseValg.kode} value={ytelseValg.kode}>
                {ytelseValg.navn}
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
