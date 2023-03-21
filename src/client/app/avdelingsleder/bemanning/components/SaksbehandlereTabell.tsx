import React, { FunctionComponent, useCallback, useContext, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useQueryClient } from 'react-query';
import addCircle from 'images/add-circle-bla.svg';
import Chevron from 'nav-frontend-chevron';
import { Knapp } from 'nav-frontend-knapper';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import { K9LosApiKeys } from 'api/k9LosApi';
import useRestApiRunner from 'api/rest-api-hooks/src/local-data/useRestApiRunner';
import LeggTilSaksbehandlerForm from 'avdelingsleder/bemanning/components/LeggTilSaksbehandlerForm';
import SaksbehandlerInfo from 'avdelingsleder/bemanning/components/SaksbehandlerInfo';
import { AvdelingslederContext } from 'avdelingsleder/context';
import Image from 'sharedComponents/Image';
import Table from 'sharedComponents/Table';
import TableColumn from 'sharedComponents/TableColumn';
import TableRow from 'sharedComponents/TableRow';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import saksbehandlereGra from '../../../../images/saksbehandlereGra.svg';
import { Saksbehandler } from '../saksbehandlerTsType';
import styles from './saksbehandlereTabell.css';

const headerTextCodes = ['SaksbehandlereTabell.Navn', 'EMPTY_1'];

/**
 * SaksbehandlereTabell
 */
const SaksbehandlereTabell: FunctionComponent = () => {
	const [valgtSaksbehandler, setValgtSaksbehandler] = useState<Saksbehandler>();
	const [visAddSaksbehadler, setVisAddSaksbehandler] = useState(false);
	const { saksbehandlere } = useContext(AvdelingslederContext);

	const queryClient = useQueryClient();

	const { startRequest: fjernSaksbehandler } = useRestApiRunner<Saksbehandler>(K9LosApiKeys.SLETT_SAKSBEHANDLER);
	const fjernSaksbehandlerFn = useCallback((epost: string) => {
		fjernSaksbehandler({ epost }).then(() =>
			queryClient.invalidateQueries({ queryKey: '/avdelingsleder/saksbehandlere' }),
		);
		setValgtSaksbehandler(undefined);
	}, []);

	const lukkForm = () => {
		setVisAddSaksbehandler(false);
	};

	const onClick = (saksbehandler: Saksbehandler) => {
		if (valgtSaksbehandler === saksbehandler) {
			setValgtSaksbehandler(undefined);
		} else {
			setValgtSaksbehandler(saksbehandler);
		}
	};

	const onAddClick = () => {
		setVisAddSaksbehandler(true);
	};

	return (
		<>
			<Element className={styles.tableHeader}>
				<Image src={saksbehandlereGra} className={styles.icon} />
				<FormattedMessage id="SaksbehandlereTabell.Saksbehandlere" />
			</Element>
			<Knapp mini className={styles.addKnapp} tabIndex={0} onClick={onAddClick}>
				<Image src={addCircle} className={styles.addIcon} />
				<FormattedMessage id="LeggTilSaksbehandlerForm.LeggTil" />
			</Knapp>
			{visAddSaksbehadler && <LeggTilSaksbehandlerForm lukkForm={lukkForm} />}
			{saksbehandlere.length === 0 && (
				<>
					<VerticalSpacer eightPx />
					<Normaltekst>
						<FormattedMessage id="SaksbehandlereTabell.IngenSaksbehandlere" />
					</Normaltekst>
					<VerticalSpacer eightPx />
				</>
			)}
			{saksbehandlere.length > 0 && (
				<Table headerTextCodes={headerTextCodes} noHover>
					{saksbehandlere.map((saksbehandler) => (
						<React.Fragment key={saksbehandler.brukerIdent}>
							<TableRow
								key={saksbehandler.brukerIdent}
								onMouseDown={() => onClick(saksbehandler)}
								onKeyDown={() => onClick(saksbehandler)}
							>
								<TableColumn>{saksbehandler.navn != null ? saksbehandler.navn : saksbehandler.epost}</TableColumn>
								<TableColumn>
									<Chevron
										key={saksbehandler.brukerIdent}
										type={valgtSaksbehandler && valgtSaksbehandler === saksbehandler ? 'opp' : 'ned'}
										className={styles.chevron}
									/>
								</TableColumn>
							</TableRow>
							{valgtSaksbehandler === saksbehandler && (
								<TableRow>
									<TableColumn>
										<SaksbehandlerInfo saksbehandler={saksbehandler} fjernSaksbehandler={fjernSaksbehandlerFn} />
									</TableColumn>
								</TableRow>
							)}
						</React.Fragment>
					))}
				</Table>
			)}
		</>
	);
};

export default SaksbehandlereTabell;
