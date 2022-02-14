import React from 'react';
import { render as rtlRender } from '@testing-library/react';
import { IntlProvider } from 'react-intl';

import defaultMessages from '../../src/client/app/sprak/nb_NO.json';

export function renderWithIntl(ui, { locale, messages, ...renderOptions } = {}) {
  const Wrapper = ({ children }) => (
    <IntlProvider locale={locale || 'nb-NO'} messages={messages || defaultMessages}>
      {children}
    </IntlProvider>
  );

  return rtlRender(ui, { wrapper: Wrapper, ...renderOptions });
}

export * from '@testing-library/react';
