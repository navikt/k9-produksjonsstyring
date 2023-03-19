import React, { FunctionComponent } from 'react';
import { FormattedMessage, WrappedComponentProps, injectIntl } from 'react-intl';
import { EtikettAdvarsel, EtikettFokus, EtikettInfo } from 'nav-frontend-etiketter';
import diskresjonskodeType from 'kodeverk/diskresjonskodeType';
import styles from './merkepanel.css';

interface OwnProps {
    erDod?: boolean;
    diskresjonskode?: string;
}

/**
 * MerkePanel
 *
 * Presentasjonskomponent. Definerer visning av personens merkinger. (Søker)
 *
 * Eksempel:
 * ```html
 *  <MerkePanel erDod={false} diskresjonskode="SPSF"  />
 * ```
 */
export const MerkePanel: FunctionComponent<OwnProps & WrappedComponentProps> = ({ intl, erDod, diskresjonskode }) => (
    <div className={styles.merkePanel}>
        {erDod && (
            <EtikettInfo className={styles.dodMerke} title={intl.formatMessage({ id: 'MerkePanel.DodTittel' })}>
                <FormattedMessage id="MerkePanel.Dod" />
            </EtikettInfo>
        )}
        {diskresjonskode === diskresjonskodeType.KODE6 && !erDod && (
            <EtikettAdvarsel
                className={styles.merkeDiskresjonskoder}
                title={intl.formatMessage({ id: 'MerkePanel.Diskresjon6Tittel' })}
            >
                <FormattedMessage id="MerkePanel.Diskresjon6" />
            </EtikettAdvarsel>
        )}

        {diskresjonskode === diskresjonskodeType.KODE7 && !erDod && (
            <EtikettFokus
                className={styles.merkeDiskresjonskoder}
                title={intl.formatMessage({ id: 'MerkePanel.Diskresjon7Tittel' })}
            >
                <FormattedMessage id="MerkePanel.Diskresjon7" />
            </EtikettFokus>
        )}
    </div>
);

MerkePanel.defaultProps = {
    diskresjonskode: '',
    erDod: false,
};

export default injectIntl(MerkePanel);
