import React, { FunctionComponent, useCallback, useEffect, useRef, useState } from 'react';
import { FormattedMessage, WrappedComponentProps, injectIntl, useIntl } from 'react-intl';
import classNames from 'classnames';
import menuIconBlackUrl from 'images/ic-menu-18px_black.svg';
import menuIconBlueUrl from 'images/ic-menu-18px_blue.svg';
import { Normaltekst } from 'nav-frontend-typografi';
import { WarningColored } from '@navikt/ds-icons';
import { Loader } from '@navikt/ds-react';
import { K9LosApiKeys, RestApiGlobalStatePathsKeys } from 'api/k9LosApi';
import { useGlobalStateRestApiData } from 'api/rest-api-hooks';
import useRestApiRunner from 'api/rest-api-hooks/src/local-data/useRestApiRunner';
import Reservasjon from 'avdelingsleder/reservasjoner/reservasjonTsType';
import AlleKodeverk from 'kodeverk/alleKodeverkTsType';
import kodeverkTyper from 'kodeverk/kodeverkTyper';
import {
    getHeaderCodes,
    hentIDFraSak,
} from 'saksbehandler/behandlingskoer/components/oppgavetabeller/oppgavetabellerfelles';
import KommentarMedMerknad from 'saksbehandler/components/KommentarMedMerknad';
import Oppgave from 'saksbehandler/oppgaveTsType';
import DateLabel from 'sharedComponents/DateLabel';
import Image from 'sharedComponents/Image';
import Table from 'sharedComponents/Table';
import TableColumn from 'sharedComponents/TableColumn';
import TableRow from 'sharedComponents/TableRow';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import { getDateAndTime } from 'utils/dateUtils';
import { getKodeverknavnFraKode } from 'utils/kodeverkUtils';
import OppgaveHandlingerMenu from '../menu/OppgaveHandlingerMenu';
import styles from './oppgaverTabell.css';

interface OwnProps {
    apneOppgave: (oppgave: Oppgave) => void;
    reserverteOppgaver: Oppgave[];
    hentReserverteOppgaver: () => void;
    requestFinished: boolean;
    hastesaker?: boolean;
}

const ReserverteOppgaverTabell: FunctionComponent<OwnProps & WrappedComponentProps> = ({
    apneOppgave,
    reserverteOppgaver,
    hentReserverteOppgaver,
    requestFinished,
    hastesaker,
}) => {
    const intl = useIntl();
    const [showMenu, setShowMenu] = useState(false);
    const [reserverteOppgaverState, setReserverteOppgaveState] = useState<Oppgave[]>(reserverteOppgaver);
    const [requestFinishedState, setRequestFinishedState] = useState<boolean>(requestFinished);

    const [valgtOppgaveId, setValgtOppgaveId] = useState<string>();
    const [offset, setOffset] = useState({
        left: 0,
        top: 0,
    });

    const alleKodeverk: AlleKodeverk = useGlobalStateRestApiData(RestApiGlobalStatePathsKeys.KODEVERK);

    const { startRequest: leggTilBehandletOppgave } = useRestApiRunner(K9LosApiKeys.LEGG_TIL_BEHANDLET_OPPGAVE);
    const { startRequest: forlengOppgavereservasjon } = useRestApiRunner<Reservasjon[]>(
        K9LosApiKeys.FORLENG_OPPGAVERESERVASJON,
    );

    const initialRender = useRef(true);

    useEffect(() => {
        if (!showMenu) {
            if (
                reserverteOppgaver.length !== reserverteOppgaverState.length ||
                !reserverteOppgaver.every((oppgave) => reserverteOppgaverState.includes(oppgave))
            ) {
                setReserverteOppgaveState(reserverteOppgaver);
            }

            if (requestFinished !== requestFinishedState) {
                setRequestFinishedState(requestFinished);
            }
        }
    }, [reserverteOppgaver, requestFinished]);

    useEffect(() => {
        if (!showMenu && !initialRender.current) {
            hentReserverteOppgaver();
        }
    }, [showMenu]);

    useEffect(() => {
        if (initialRender.current) {
            initialRender.current = false;
        }
    });

    const forlengOppgaveReservasjonFn = useCallback(
        (oppgaveId: string): Promise<any> =>
            forlengOppgavereservasjon({ oppgaveId }).then(() => hentReserverteOppgaver()),
        [],
    );

    const ref = useRef({});

    const goToFagsak = useCallback(
        (event: Event, id: number, oppgave: Oppgave) => {
            if (
                ref.current &&
                Object.keys(ref.current).some((key) => ref.current[key] && ref.current[key].contains(event.target))
            ) {
                return;
            }
            leggTilBehandletOppgave(oppgave);
            apneOppgave(oppgave);
        },
        [ref.current],
    );

    const toggleMenu = useCallback(
        (oppgaveValgt: Oppgave) => {
            const newOffset = ref.current[oppgaveValgt.eksternId]?.getBoundingClientRect();

            if (newOffset) {
                setShowMenu(!showMenu);
                setValgtOppgaveId(oppgaveValgt.eksternId);
                setOffset({ top: newOffset.top, left: newOffset.left });
            }
        },
        [ref.current, showMenu],
    );

    const valgtOppgave = reserverteOppgaverState.find((o) => o.eksternId === valgtOppgaveId);

    return (
        <div>
            {reserverteOppgaverState.length === 0 && !requestFinishedState && (
                <Loader size="2xlarge" className={styles.spinner} />
            )}

            {reserverteOppgaverState.length === 0 && requestFinishedState && (
                <>
                    <VerticalSpacer eightPx />
                    <Normaltekst>
                        {!hastesaker ? (
                            <FormattedMessage id="OppgaverTabell.IngenReserverteOppgaver" />
                        ) : (
                            <FormattedMessage id="OppgaverTabell.IngenReserverteHastesaker" />
                        )}
                    </Normaltekst>
                </>
            )}

            {reserverteOppgaverState.length > 0 && requestFinishedState && (
                <>
                    <Table headerTextCodes={getHeaderCodes(true, hastesaker).filter(Boolean)}>
                        {reserverteOppgaverState.map((oppgave) => (
                            <TableRow
                                key={oppgave.eksternId}
                                onMouseDown={goToFagsak}
                                onKeyDown={goToFagsak}
                                className={classNames(styles.isUnderBehandling, { [styles.hastesak]: hastesaker })}
                                model={oppgave}
                            >
                                {hastesaker && (
                                    <TableColumn className={styles.hastesakTd}>
                                        <WarningColored className={styles.hastesakIkon} />
                                    </TableColumn>
                                )}
                                <TableColumn className={hastesaker ? '' : styles.soekerPadding}>
                                    {oppgave.navn ? `${oppgave.navn} ${oppgave.personnummer}` : '<navn>'}
                                </TableColumn>
                                <TableColumn>{hentIDFraSak(oppgave, alleKodeverk)}</TableColumn>
                                <TableColumn>
                                    {getKodeverknavnFraKode(
                                        oppgave.behandlingstype,
                                        kodeverkTyper.BEHANDLING_TYPE,
                                        alleKodeverk,
                                    )}
                                </TableColumn>
                                <TableColumn>
                                    {oppgave.opprettetTidspunkt && (
                                        <DateLabel dateString={oppgave.opprettetTidspunkt} />
                                    )}
                                </TableColumn>
                                <TableColumn className={styles.reservertTil}>
                                    <FormattedMessage
                                        id="OppgaveHandlingerMenu.ReservertTil"
                                        values={{
                                            ...getDateAndTime(oppgave.status.reservertTilTidspunkt),
                                            // eslint-disable-next-line react/no-unstable-nested-components
                                            b: (...chunks) => <b>{chunks}</b>,
                                        }}
                                    />
                                </TableColumn>
                                <TableColumn>
                                    <KommentarMedMerknad oppgave={oppgave} />
                                </TableColumn>
                                <TableColumn className={styles.noPadding}>
                                    <div
                                        ref={(el) => {
                                            ref.current = { ...ref.current, [oppgave.eksternId]: el };
                                        }}
                                    >
                                        <Image
                                            className={styles.image}
                                            src={menuIconBlackUrl}
                                            srcHover={menuIconBlueUrl}
                                            alt={intl.formatMessage({ id: 'OppgaverTabell.OppgaveHandlinger' })}
                                            onMouseDown={() => toggleMenu(oppgave)}
                                            onKeyDown={() => toggleMenu(oppgave)}
                                        />
                                    </div>
                                </TableColumn>
                            </TableRow>
                        ))}
                    </Table>
                    {showMenu && valgtOppgaveId && valgtOppgave && (
                        <OppgaveHandlingerMenu
                            imageNode={ref.current[valgtOppgaveId]}
                            toggleMenu={toggleMenu}
                            offset={offset}
                            oppgave={valgtOppgave}
                            forlengOppgaveReservasjon={forlengOppgaveReservasjonFn}
                            hentReserverteOppgaver={hentReserverteOppgaver}
                        />
                    )}
                </>
            )}
        </div>
    );
};

export default injectIntl(ReserverteOppgaverTabell);
