import React from 'react';
import { render as rtlRender } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import { RestApiStateContext } from 'api/rest-api-hooks';

import defaultMessages from '../../src/client/app/sprak/nb_NO.json';
import kodeverk from 'mocks/kodeverk';

export function renderWithIntl(ui, { locale, messages, ...renderOptions } = {}) {
  const Wrapper = ({ children }) => (
    <IntlProvider locale={locale || 'nb-NO'} messages={messages || defaultMessages}>
      {children}
    </IntlProvider>
  );

  return rtlRender(ui, { wrapper: Wrapper, ...renderOptions });
}

export const renderWithAllProviders = (ui, { ...renderOptions } = {}) => {
  const Wrapper = ({ children }) => (
    <RestApiStateContext.Provider value={{ KODEVERK: kodeverk }}>
      <IntlProvider locale={'nb-NO'} messages={defaultMessages}>
        {children}
      </IntlProvider>
    </RestApiStateContext.Provider>
  );
  return rtlRender(ui, { wrapper: Wrapper, ...renderOptions });
};
