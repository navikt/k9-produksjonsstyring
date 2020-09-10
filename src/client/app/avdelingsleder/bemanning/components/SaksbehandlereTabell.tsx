import React, { Component, FunctionComponent, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { Normaltekst, Element } from 'nav-frontend-typografi';
import Image from 'sharedComponents/Image';
import addCircle from 'images/add-circle-bla.svg';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import Table from 'sharedComponents/Table';
import TableRow from 'sharedComponents/TableRow';
import TableColumn from 'sharedComponents/TableColumn';
import { Knapp } from 'nav-frontend-knapper';
import Chevron from 'nav-frontend-chevron';
import SaksbehandlerInfo from 'avdelingsleder/bemanning/components/SaksbehandlerInfo';
import saksbehandlereGra from '../../../../images/saksbehandlereGra.svg';
import SletteSaksbehandlerModal from './SletteSaksbehandlerModal';
import { Saksbehandler } from '../saksbehandlerTsType';

import styles from './saksbehandlereTabell.less';

const headerTextCodes = [
  'SaksbehandlereTabell.Navn',
  'EMPTY_1',
];

interface OwnProps {
  saksbehandlere: Saksbehandler[];
  fjernSaksbehandler: (epost: string) => Promise<string>;
}

/**
 * SaksbehandlereTabell
 */
const SaksbehandlereTabell: FunctionComponent<OwnProps> = ({
  saksbehandlere,
  fjernSaksbehandler,
}) => {
  const [valgtSaksbehandler, setValgtSaksbehandler] = useState<Saksbehandler>();

  const showSletteSaksbehandlerModal = (saksbehandler: Saksbehandler) => {
    setValgtSaksbehandler(saksbehandler);
  };

  const closeSletteModal = () => {
    setValgtSaksbehandler(undefined);
  };

  const slettSaksbehandler = (saksbehandler: Saksbehandler) => {
    fjernSaksbehandler(saksbehandler.epost);
    closeSletteModal();
  };

  const onClick = (saksbehandler: Saksbehandler) => {
    if (valgtSaksbehandler === saksbehandler) {
      setValgtSaksbehandler(undefined);
    } else {
      setValgtSaksbehandler(saksbehandler);
    }
  };


  const sorterteSaksbehandlere = saksbehandlere.sort((saksbehandler1, saksbehandler2) => saksbehandler1.epost.localeCompare(saksbehandler2.epost));

  return (
    <>
      <Element className={styles.tableHeader}>
        <Image src={saksbehandlereGra} className={styles.icon} />
        <FormattedMessage id="SaksbehandlereTabell.Saksbehandlere" />
      </Element>
      <Knapp
        mini
        className={styles.addKnapp}
        tabIndex={0}
      >
        <Image src={addCircle} className={styles.addIcon} />
        <FormattedMessage id="LeggTilSaksbehandlerForm.LeggTil" />
      </Knapp>
      {sorterteSaksbehandlere.length === 0 && (
      <>
        <VerticalSpacer eightPx />
        <Normaltekst><FormattedMessage id="SaksbehandlereTabell.IngenSaksbehandlere" /></Normaltekst>
        <VerticalSpacer eightPx />
      </>
      )}
      {sorterteSaksbehandlere.length > 0 && (
        <Table headerTextCodes={headerTextCodes} noHover>
          {sorterteSaksbehandlere.map((saksbehandler) => (
            <>
              <TableRow
                key={saksbehandler.brukerIdent}
                onMouseDown={() => onClick(saksbehandler)}
                onKeyDown={() => onClick(saksbehandler)}
              >
                <TableColumn>{saksbehandler.navn}</TableColumn>
                <TableColumn>
                  <Chevron
                    key={saksbehandler.brukerIdent}
                    type={(valgtSaksbehandler && valgtSaksbehandler === saksbehandler) ? 'opp' : 'ned'}
                    className={styles.chevron}
                  />
                </TableColumn>
              </TableRow>
              {valgtSaksbehandler === saksbehandler && <TableRow><SaksbehandlerInfo saksbehandler={valgtSaksbehandler} /></TableRow>}
            </>
          ))}
        </Table>
      )}
    </>
  );
};

export default SaksbehandlereTabell;
