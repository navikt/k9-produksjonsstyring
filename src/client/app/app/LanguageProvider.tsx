import React, { ReactNode } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { IntlProvider } from 'react-intl';

import data from '../sprak/nb_NO.json';

type TsProps = Readonly<{
  nbMessages: {[key: string]: string};
  children: ReactNode;
}>

/**
 * LanguageProvider
 *
 * Container komponent. Har ansvar for å hente språkfilen.
 */
export const LanguageProvider = ({ nbMessages, children }: TsProps) => (
  <IntlProvider locale="nb-NO" messages={nbMessages}>
    <>
      {children}
    </>
  </IntlProvider>
);

LanguageProvider.propTypes = {
  nbMessages: PropTypes.shape({}).isRequired,
  children: PropTypes.node.isRequired,
};

const mapStateToProps = () => ({
  nbMessages: data,
});

export default connect(mapStateToProps)(LanguageProvider);
