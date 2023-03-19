import { v4 as uuid } from 'uuid';
import { OppgaveQuery } from './filterTsTypes';

export default class OppgaveQueryModel {
    private oppgaveQuery: OppgaveQuery;

    constructor(oppgaveQuery: OppgaveQuery) {
        let newOppgaveQuery = oppgaveQuery;
        if (newOppgaveQuery == null) {
            newOppgaveQuery = {
                filtere: [],
                select: [],
                order: [],
                limit: 10,
            };
        }

        newOppgaveQuery = JSON.parse(JSON.stringify(newOppgaveQuery));

        if (!newOppgaveQuery.id) {
            this.oppgaveQuery = OppgaveQueryModel.updateIdentities(newOppgaveQuery);
        } else {
            this.oppgaveQuery = newOppgaveQuery;
        }
    }

    updateLimit(limit: number) {
        this.oppgaveQuery.limit = limit;
        return this;
    }

    private static updateIdentities(oppgaveQuery) {
        oppgaveQuery.id = uuid();
        oppgaveQuery.filtere.forEach((f) => {
            f.id = uuid();
            if (f.filtere) {
                updateIdentities(f);
            }
        });
        oppgaveQuery.select.forEach((f) => {
            f.id = uuid();
        });
        oppgaveQuery.order.forEach((f) => {
            f.id = uuid();
        });
        return oppgaveQuery;
    }

    toOppgaveQuery(): OppgaveQuery {
        return this.oppgaveQuery;
    }

    removeFilter(id) {
        return this.internalRemoveFilter(this.oppgaveQuery, id);
    }

    private internalRemoveFilter(oppgaveQuery, id) {
        const index = oppgaveQuery.filtere.findIndex((f) => f.id === id);
        if (index >= 0) {
            oppgaveQuery.filtere.splice(index, 1);
        } else {
            oppgaveQuery.filtere.filter((f) => f.filtere).forEach((f) => this.internalRemoveFilter(f, id));
        }
        return this;
    }

    getById(id) {
        for (let f of this.oppgaveQuery.select) {
            if (f.id === id) {
                return f;
            }
        }

        for (let f of this.oppgaveQuery.order) {
            if (f.id === id) {
                return f;
            }
        }

        return this.internalGetById(this.oppgaveQuery, id);
    }

    private internalGetById(oppgaveQuery, id) {
        if (oppgaveQuery.id === id) {
            return oppgaveQuery;
        }
        if (oppgaveQuery.filtere == null) {
            return null;
        }

        for (let f of oppgaveQuery.filtere) {
            if (f.id === id) {
                return f;
            }
            const result = this.internalGetById(f, id);
            if (result != null) {
                return result;
            }
        }

        return null;
    }

    addFilter(id) {
        return this.internalAddFilter(this.oppgaveQuery, id);
    }

    private internalAddFilter(oppgaveQuery, id) {
        if (oppgaveQuery.id === id) {
            oppgaveQuery.filtere.push({
                id: uuid(),
                type: 'feltverdi',
                område: null,
                kode: null,
                operator: 'EQUALS',
                verdi: null,
            });
        } else {
            oppgaveQuery.filtere.filter((f) => f.filtere).forEach((f) => this.internalAddFilter(f, id));
        }
        return this;
    }

    updateFilter(id, data) {
        return this.internalUdateFilter(this.oppgaveQuery, id, data);
    }

    private internalUdateFilter(oppgaveQuery: OppgaveQuery, id, data) {
        const index = oppgaveQuery.filtere.findIndex((f) => f.id === id);
        if (index >= 0) {
            oppgaveQuery.filtere[index] = data;
        } else {
            oppgaveQuery.filtere.filter((f) => f.filtere).forEach((f) => this.internalUdateFilter(f, id, data));
        }
        return this;
    }

    addGruppe(id) {
        return this.internalAddGruppe(this.oppgaveQuery, id);
    }

    private internalAddGruppe(oppgaveQuery, id) {
        if (oppgaveQuery.id === id) {
            oppgaveQuery.filtere.push({
                id: uuid(),
                type: 'combine',
                combineOperator: !oppgaveQuery.combineOperator || oppgaveQuery.combineOperator === 'AND' ? 'OR' : 'AND',
                filtere: [],
            });
        } else {
            oppgaveQuery.filtere.filter((f) => f.filtere != null).forEach((f) => this.internalAddGruppe(f, id));
        }
        return this;
    }

    addEnkelSelectFelt() {
        this.oppgaveQuery.select.push({
            id: uuid(),
            type: 'enkel',
            område: null,
            kode: null,
        });
        return this;
    }

    removeSelectFelt(id) {
        const index = this.oppgaveQuery.select.findIndex((f) => f.id === id);
        if (index >= 0) {
            this.oppgaveQuery.select.splice(index, 1);
        }
        return this;
    }

    updateEnkelSelectFelt(id, data) {
        const index = this.oppgaveQuery.select.findIndex((f) => f.id === id);
        if (index >= 0) {
            this.oppgaveQuery.select[index] = data;
        }
        return this;
    }

    addEnkelOrderFelt() {
        this.oppgaveQuery.order.push({
            id: uuid(),
            type: 'enkel',
            område: null,
            kode: null,
            økende: true,
        });
        return this;
    }

    removeOrderFelt(id) {
        const index = this.oppgaveQuery.order.findIndex((f) => f.id === id);
        if (index >= 0) {
            this.oppgaveQuery.order.splice(index, 1);
        }
        return this;
    }

    updateEnkelOrderFelt(id, data) {
        const index = this.oppgaveQuery.order.findIndex((f) => f.id === id);
        if (index >= 0) {
            this.oppgaveQuery.order[index] = data;
        }
        return this;
    }
}
