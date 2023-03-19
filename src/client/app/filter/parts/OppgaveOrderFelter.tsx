import React from 'react';
import { Add, Delete } from '@navikt/ds-icons';
import { Button, Select } from '@navikt/ds-react';
import { OrderFelt } from '../filterTsTypes';
import { feltverdiKey, kodeFraKey, områdeFraKey } from '../utils';
import styles from './OppgaveOrderFelter.css';

interface OwnProps {
    felter: Oppgavefelt[];
    oppgaveQuery: OppgaveQuery;
    onLeggTil: () => void;
    onOppdater: (of: OrderFelt, verdi: string) => void;
    onFjern: (of: OrderFelt) => void;
}

const renderFjernOrderFeltKnapp = (felt, onFjern) => (
    <Button icon={<Delete aria-hidden />} size="medium" variant="tertiary" onClick={() => onFjern(felt)} />
);

const renderAddEnkelOrderFeltKnapp = (onLeggTil) => (
    <Button
        className={styles.orderLeggTil}
        icon={<Add aria-hidden />}
        size="xsmall"
        variant="tertiary"
        onClick={() => onLeggTil()}
    >
        Legg til felt
    </Button>
);

const renderOrderFelt = (felter, felt, onOppdater, onFjern) => (
    <div className={styles.orderEnkelFelt} key={felt.id}>
        <Select
            className={styles.noGap}
            value={feltverdiKey(felt)}
            onChange={(event) =>
                onOppdater(felt, {
                    område: områdeFraKey(event.target.value),
                    kode: kodeFraKey(event.target.value),
                })
            }
        >
            <option value="">Velg felt</option>
            {felter.map((feltdefinisjon) => (
                <option key={feltverdiKey(feltdefinisjon)} value={feltverdiKey(feltdefinisjon)}>
                    {feltdefinisjon.visningsnavn}
                </option>
            ))}
        </Select>
        <Select
            className={styles.orderDirection}
            value={felt.økende}
            onChange={(event) =>
                onOppdater(felt, {
                    økende: event.target.value,
                })
            }
        >
            <option key="true" value="true">
                Økende
            </option>
            <option key="false" value="false">
                Synkende
            </option>
        </Select>

        {renderFjernOrderFeltKnapp(felt, onFjern)}
    </div>
);

const OppgaveOrderFelter = ({ felter, oppgaveQuery, onLeggTil, onOppdater, onFjern }): OwnProps => (
    <div>
        {oppgaveQuery.order && oppgaveQuery.order.map((felt) => renderOrderFelt(felter, felt, onOppdater, onFjern))}
        {renderAddEnkelOrderFeltKnapp(onLeggTil)}
    </div>
);

export default OppgaveOrderFelter;
