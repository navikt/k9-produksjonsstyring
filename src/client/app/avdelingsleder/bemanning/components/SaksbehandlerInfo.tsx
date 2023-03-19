import React, { FunctionComponent, useState } from 'react';
import { WrappedComponentProps, injectIntl } from 'react-intl';
import { Normaltekst } from 'nav-frontend-typografi';
import { v4 as uuid4 } from 'uuid';
import SletteSaksbehandlerModal from 'avdelingsleder/bemanning/components/SletteSaksbehandlerModal';
import { Saksbehandler } from 'avdelingsleder/bemanning/saksbehandlerTsType';
import { FlexColumn, FlexRow } from 'sharedComponents/flexGrid';
import styles from './saksbehandlerInfo.css';

interface OwnProps {
    saksbehandler: Saksbehandler;
    fjernSaksbehandler: (epost: string) => void;
}

const SaksbehandlerInfo: FunctionComponent<OwnProps & WrappedComponentProps> = ({
    saksbehandler,
    fjernSaksbehandler,
}) => {
    const [visSlettModal, setVisSlettModal] = useState(false);
    const lukkSlettModal = () => {
        setVisSlettModal(false);
    };

    return (
        <>
            <FlexRow>
                <FlexColumn className={styles.koer}>
                    <Normaltekst className={styles.overskrift}>Køer</Normaltekst>
                    {saksbehandler.oppgavekoer.length === 0 && (
                        <Normaltekst className={styles.info}>Ingen køer tildelt</Normaltekst>
                    )}
                    {saksbehandler.oppgavekoer.length > 0 &&
                        saksbehandler.oppgavekoer.map((ko) => (
                            <Normaltekst key={uuid4()} className={styles.info}>
                                {ko}
                            </Normaltekst>
                        ))}
                </FlexColumn>
            </FlexRow>
            <div className={styles.container}>
                <FlexRow>
                    <FlexColumn className={styles.personinfo}>
                        <Normaltekst className={styles.overskrift}>Navn</Normaltekst>
                        <Normaltekst className={styles.info}>{saksbehandler.navn}</Normaltekst>
                    </FlexColumn>
                </FlexRow>

                <FlexRow>
                    <FlexColumn className={styles.epost}>
                        <Normaltekst className={styles.overskrift}>Epost</Normaltekst>
                        <Normaltekst className={styles.info}>{saksbehandler.epost}</Normaltekst>
                    </FlexColumn>
                    <FlexColumn className={styles.brukerident}>
                        <Normaltekst className={styles.overskrift}>Brukerident</Normaltekst>
                        <Normaltekst className={styles.info}>{saksbehandler.brukerIdent}</Normaltekst>
                    </FlexColumn>
                </FlexRow>
            </div>
            <FlexRow>
                {/* eslint-disable-next-line jsx-a11y/interactive-supports-focus */}
                <div
                    id="slett"
                    className={styles.slett}
                    role="button"
                    onClick={() => {
                        setVisSlettModal(true);
                    }}
                    onKeyDown={() => {
                        setVisSlettModal(true);
                    }}
                >
                    Slett saksbehandler
                </div>
            </FlexRow>
            {visSlettModal === true && (
                <SletteSaksbehandlerModal
                    valgtSaksbehandler={saksbehandler}
                    closeSletteModal={lukkSlettModal}
                    fjernSaksbehandler={fjernSaksbehandler}
                />
            )}
        </>
    );
};

export default injectIntl(SaksbehandlerInfo);
