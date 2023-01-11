import { Oppgaverad, Oppgavefeltverdi, EnkelFeltuttrekk, Feltuttrekk, OppgaveQuery, FiltereContainer, CombineOppgavefilter, FeltverdiOppgavefilter, Oppgavefilter } from './filterTsTypes.ts';

import { v4 as uuid } from 'uuid';

export default class OppgaveQueryModel {

    private oppgaveQuery: OppgaveQuery;

    constructor(oppgaveQuery: OppgaveQuery) {
        if (oppgaveQuery == null) {
            oppgaveQuery = {
                "filtere": [],
                "select": []
            }
        }

        oppgaveQuery = JSON.parse(JSON.stringify(oppgaveQuery));

        if (oppgaveQuery.id == null) {
            this.oppgaveQuery = OppgaveQueryModel.updateIdentities(oppgaveQuery);
        } else {
            this.oppgaveQuery = oppgaveQuery;
        }
    }


    private static updateIdentities(oppgaveQuery) {
        oppgaveQuery.id = uuid();
        oppgaveQuery.filtere.forEach(f => {
            f.id = uuid();
            if (f.filtere != null) {
                updateIdentities(f);
            }
        });
        return oppgaveQuery;
    }

    toOppgaveQuery(): OppgaveQuery {
        return this.oppgaveQuery;
    }

    removeFilter(id) {
        return this._removeFilter(this.oppgaveQuery, id);
    }

    private _removeFilter(oppgaveQuery, id) {
        const index = oppgaveQuery.filtere.findIndex(f => f.id == id);
        if (index >= 0) {
            oppgaveQuery.filtere.splice(index, 1);
        } else {
            oppgaveQuery.filtere.filter(f => f.filtere != null).forEach(f => this._removeFilter(f, id));
        }
        return this;
    }

    getById(id) {
        for (let f of this.oppgaveQuery.select) {
            if (f.id === id) {
                return f;
            }
        }

        return this._getById(this.oppgaveQuery, id);
    }

    private _getById(oppgaveQuery, id) {
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
            const result = this._getById(f, id);
            if (result != null) {
                return result;
            }
        }

        return null;
    }

    addFilter(id) {
        return this._addFilter(this.oppgaveQuery, id);
    }

    private _addFilter(oppgaveQuery, id) {
        if (oppgaveQuery.id === id) {
            oppgaveQuery.filtere.push({
                "id": uuid(),
                "type" : "feltverdi",
                "område" : null,
                "kode" : null,
                "operator" : "EQUALS",
                "verdi" : null
            });
        } else {
            oppgaveQuery.filtere.filter(f => f.filtere != null).forEach(f => this._addFilter(f, id));
        }
        return this;
    }

    updateFilter(id, data) {
        return this._updateFilter(this.oppgaveQuery, id, data);
    }

    private _updateFilter(oppgaveQuery, id, data) {
        const index = oppgaveQuery.filtere.findIndex(f => f.id === id);
        if (index >= 0) {
            oppgaveQuery.filtere[index] = data;
        } else {
            oppgaveQuery.filtere.filter(f => f.filtere != null).forEach(f => this._updateFilter(f, id, data));
        }
        return this;
    }

    addGruppe(id) {
        return this._addGruppe(this.oppgaveQuery, id);
    }

    private _addGruppe(oppgaveQuery, id) {
        if (oppgaveQuery.id === id) {
            oppgaveQuery.filtere.push({
                "id": uuid(),
                "type" : "combine",
                "combineOperator": (oppgaveQuery.combineOperator == null || oppgaveQuery.combineOperator === "AND") ? "OR" : "AND",
                "filtere": []
            });
        } else {
            oppgaveQuery.filtere.filter(f => f.filtere != null).forEach(f => this._addGruppe(f, id));
        }
        return this;
    }

    addEnkelSelectFelt() {
        this.oppgaveQuery.select.push({
            "id": uuid(),
            "type" : "enkel",
            "område" : null,
            "kode" : null,
        });
        return this;
    }

    removeSelectFelt(id) {
        const index = this.oppgaveQuery.select.findIndex(f => f.id == id);
        if (index >= 0) {
            this.oppgaveQuery.select.splice(index, 1);
        }
        return this;
    }

    updateEnkelSelectFelt(id, data) {
        const index = this.oppgaveQuery.select.findIndex(f => f.id === id);
        if (index >= 0) {
            this.oppgaveQuery.select[index] = data;
        }
        return this;
    }
}
