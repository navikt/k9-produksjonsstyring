import React, { useState } from 'react';
import { action } from '@storybook/addon-actions';
import { LeggTilSaksbehandlerForm } from 'avdelingsleder/bemanning/components/LeggTilSaksbehandlerForm';
import Saksbehandler from 'avdelingsleder/bemanning/saksbehandlerTsType';
import withIntl from '../../../decorators/withIntl';

export default {
  title: 'avdelingsleder/saksbehandlere/LeggTilSaksbehandlerForm',
  component: LeggTilSaksbehandlerForm,
  decorators: [withIntl],
};

export const skalVisePanelForÅLeggeTilSaksbehandlere = intl => {
  const [erFerdig, setFerdig] = useState(false);
  const [saksbehandler, setSaksbehandler] = useState<Saksbehandler>();
  const finnSaksbehandler = () => {
    setSaksbehandler({
      brukerIdent: 'R232323',
      navn: 'Espen Utvikler',
      avdelingsnavn: ['NAV Viken'],
    });
    setFerdig(true);
  };
  return (
    <LeggTilSaksbehandlerForm
      intl={intl}
      saksbehandler={saksbehandler}
      finnSaksbehandler={finnSaksbehandler as () => Promise<string>}
      leggTilSaksbehandler={action('button-click') as () => Promise<string>}
      resetSaksbehandlerSok={action('button-click')}
      erLagtTilAllerede={false}
      erSokFerdig={erFerdig}
      valgtAvdelingEnhet="NAV Viken"
    />
  );
};

export const skalVisePanelForNårSaksbehandlerErLagtTilAllerede = intl => {
  const [erFerdig, setFerdig] = useState(false);
  const [saksbehandler, setSaksbehandler] = useState<Saksbehandler>();
  const finnSaksbehandler = () => {
    setSaksbehandler({
      brukerIdent: 'R232323',
      navn: 'Espen Utvikler',
      avdelingsnavn: ['NAV Viken'],
    });
    setFerdig(true);
  };
  return (
    <LeggTilSaksbehandlerForm
      intl={intl}
      saksbehandler={saksbehandler}
      finnSaksbehandler={finnSaksbehandler as () => Promise<string>}
      leggTilSaksbehandler={action('button-click') as () => Promise<string>}
      resetSaksbehandlerSok={action('button-click')}
      erLagtTilAllerede
      erSokFerdig={erFerdig}
      valgtAvdelingEnhet="NAV Viken"
    />
  );
};
