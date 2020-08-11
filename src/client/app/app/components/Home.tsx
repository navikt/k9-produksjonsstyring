import React, { FunctionComponent } from 'react';
import { Route, Switch } from 'react-router-dom';

import AvdelingslederIndex from 'avdelingsleder/AvdelingslederIndex';
import SaksbehandlerIndex from 'saksbehandler/SaksbehandlerIndex';
import AdminIndex from 'admin/AdminIndex';
import MissingPage from './MissingPage';

import styles from './home.less';

interface OwnProps {
    headerHeight: number;
}

/**
 * Home
 *
 * Presentasjonskomponent. Wrapper for sideinnholdet som vises under header.
 */
const Home: FunctionComponent<OwnProps> = ({
  headerHeight,
}) => (
  <div className={styles.content} style={{ margin: `${headerHeight + 10}px auto 0` }}>
    <Switch>
      <Route exact path="/" component={SaksbehandlerIndex} />
      <Route exact path="/avdelingsleder" component={AvdelingslederIndex} />
      <Route exact path="/driftsmeldinger" component={AdminIndex} />
      <Route component={MissingPage} />
    </Switch>
  </div>
);

export default Home;
