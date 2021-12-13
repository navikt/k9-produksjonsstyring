import React, { FunctionComponent } from 'react';
import { Route, Routes } from 'react-router-dom';

import AvdelingslederIndex from 'avdelingsleder/AvdelingslederIndex';
import SaksbehandlerIndex from 'saksbehandler/SaksbehandlerIndex';
import AdminIndex from '../../admin/AdminIndex';
import MissingPage from './MissingPage';

import styles from './home.less';
import AktoerIndex from '../../aktoer/AktoerIndex';

export const aktoerPath = '/aktoer/:aktoerId(\\d+)';

interface OwnProps {
    headerHeight: number;
}

/**
 * Home
 *
 * Presentasjonskomponent. Wrapper for sideinnholdet som vises under header.
 */
const Home: FunctionComponent<OwnProps> = function ({
  headerHeight,
}) {
  return (
    <div className={styles.content} style={{ margin: `${headerHeight + 10}px auto 0` }}>
      <Routes>
        <Route path="/" element={<SaksbehandlerIndex />} />
        <Route path="/avdelingsleder" element={<AvdelingslederIndex />} />
        <Route path="/admin" element={<AdminIndex />} />
        <Route path={aktoerPath} element={<AktoerIndex />} />
        <Route element={<MissingPage />} />
      </Routes>
    </div>
  );
};

export default Home;
