import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Normaltekst, Element } from 'nav-frontend-typografi';

import Image from 'sharedComponents/Image';
import removeIcon from 'images/remove.svg';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import Table from 'sharedComponents/Table';
import TableRow from 'sharedComponents/TableRow';
import TableColumn from 'sharedComponents/TableColumn';
import driftsmeldingPropType from '../driftsmeldingPropType';
import { Driftsmelding } from '../driftsmeldingTsType';

import styles from './driftsmeldingerTabell.less';
import SletteDriftsmeldingerModal from './SletteDriftsmeldingerModal';

const headerTextCodes = [
  'DriftsmeldingTabell.Tekst',
  'DriftsmeldingTabell.Dato',
  'DriftsmeldingTabell.Aktiv',
];

interface TsProps {
  driftsmeldinger: Driftsmelding[];
  fjernDriftsmelding : (id: string) => Promise<string>;
}

interface StateTsProps {
  valgtDriftsmelding?: Driftsmelding;
}

/**
 * DriftsmeldingerTabell
 */
export class DriftsmeldingerTabell extends Component<TsProps, StateTsProps> {
  static propTypes = {
    driftsmeldinger: PropTypes.arrayOf(driftsmeldingPropType).isRequired,
    fjernDriftsmelding: PropTypes.func.isRequired,
  };

  constructor(props: TsProps) {
    super(props);

    this.state = {
      valgtDriftsmelding: undefined,
    };
  }

  showSletteDriftsmeldingModal = (saksbehandler: Driftsmelding) => {
    this.setState((prevState) => ({ ...prevState, valgtSaksbehandler: saksbehandler }));
  }

  closeSletteModal = () => {
    this.setState((prevState) => ({ ...prevState, valgtSaksbehandler: undefined }));
  }

  fjernDriftsmelding = (valgtDriftsmelding: Driftsmelding) => {
    const {
      fjernDriftsmelding,
    } = this.props;
    fjernDriftsmelding(valgtDriftsmelding.id);
    this.closeSletteModal();
  }

  render = () => {
    const {
      driftsmeldinger,
    } = this.props;
    const {
      valgtDriftsmelding,
    } = this.state;

    const sorterteDriftsmeldinger = driftsmeldinger.sort((d1, d2) => d1.dato.localeCompare(d2.dato));

    return (
      <>
        <Element><FormattedMessage id="DriftsmeldingerTabell.Driftsmeldinger" /></Element>
        {sorterteDriftsmeldinger.length === 0 && (
          <>
            <VerticalSpacer eightPx />
            <Normaltekst><FormattedMessage id="DriftsmeldingerTabell.IngenDriftsmeldinger" /></Normaltekst>
            <VerticalSpacer eightPx />
          </>
        )}
        {sorterteDriftsmeldinger.length > 0 && (
        <Table headerTextCodes={headerTextCodes} noHover>
          {sorterteDriftsmeldinger.map((driftsmelding) => (
            <TableRow key={driftsmelding.id}>
              <TableColumn>{driftsmelding.melding}</TableColumn>
              <TableColumn>{driftsmelding.dato}</TableColumn>
              <TableColumn>{driftsmelding.aktiv}</TableColumn>
              <TableColumn>
                <Image
                  src={removeIcon}
                  className={styles.removeImage}
                  onMouseDown={() => this.showSletteDriftsmeldingModal(driftsmelding)}
                  onKeyDown={() => this.showSletteDriftsmeldingModal(driftsmelding)}
                  tabIndex={0}
                />
              </TableColumn>
            </TableRow>
          ))}
        </Table>
        )}
        {valgtDriftsmelding && (
        <SletteDriftsmeldingerModal
          valgtDriftsmelding={valgtDriftsmelding}
          closeSletteModal={this.closeSletteModal}
          fjernDriftsmelding={this.fjernDriftsmelding}
        />
        )}
      </>
    );
  }
}


export default DriftsmeldingerTabell;
