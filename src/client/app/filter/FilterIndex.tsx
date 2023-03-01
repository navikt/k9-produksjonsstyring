import React from 'react';

import { v4 as uuid } from 'uuid';
import { K9LosApiKeys, k9LosApi } from 'api/k9LosApi';
import { REQUEST_POLLING_CANCELLED } from 'api/rest-api';

import { Search } from '@navikt/ds-icons';
import { Alert, Button, ReadMore } from '@navikt/ds-react';

import { SelectFelt, Oppgavefelt, FiltereContainer, Oppgavefilter } from './filterTsTypes';
import OppgavefilterPanel from './parts/OppgavefilterPanel';
import OppgaveQueryModel from './OppgaveQueryModel';
import LeggTilFilterButton from './parts/LeggTilFilterButton';
import LeggTilGruppeButton from './parts/LeggTilGruppeButton';
import OppgaveQueryResultat from './parts/OppgaveQueryResultat';
import OppgaveSelectFelter from './parts/OppgaveSelectFelter';
import { kodeFraKey, områdeFraKey } from './utils';

import styles from './filterIndex.css';

class FilterIndex extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      oppgaveQuery: new OppgaveQueryModel().toOppgaveQuery(),
      felter: [],
      oppgaver: null,
      queryError: null,
      loading: false,
    };

    this.executeOppgavesøk = this.executeOppgavesøk.bind(this);
    this.fjernFilter = this.fjernFilter.bind(this);
    this.leggTilFilter = this.leggTilFilter.bind(this);
    this.leggTilGruppe = this.leggTilGruppe.bind(this);
    this.oppdaterFilter = this.oppdaterFilter.bind(this);

    this.fjernSelectFelt = this.fjernSelectFelt.bind(this);
    this.leggTilEnkelSelectFelt = this.leggTilEnkelSelectFelt.bind(this);
    this.oppdaterEnkelSelectFelt = this.oppdaterEnkelSelectFelt.bind(this);

    k9LosApi
      .startRequest(K9LosApiKeys.OPPGAVE_QUERY_FELTER)
      .then(dataRes => {
        if (dataRes.payload !== REQUEST_POLLING_CANCELLED) {
          this.setState({
            felter: dataRes.payload.felter,
          });
        } else {
          this.setState({
            felter: [],
          });
        }
      })
      .catch(error => {
        this.setState({
          felter: [],
        });
        throw error;
      });
  }

  executeOppgavesøk() {
    function updateIdentities(oppgaverader: Oppgaverad[]) {
      oppgaverader.forEach(o => {
        /* eslint-disable no-param-reassign */
        o.id = uuid();
      });
      return oppgaverader;
    }

    if (this.state.loading) {
      return;
    }

    this.setState({
      loading: true,
    });

    k9LosApi
      .startRequest(K9LosApiKeys.OPPGAVE_QUERY, this.state.oppgaveQuery)
      .then(dataRes => {
        if (dataRes.payload !== REQUEST_POLLING_CANCELLED) {
          this.setState({
            oppgaver: updateIdentities(dataRes.payload),
            queryError: null,
            loading: false,
          });
        } else {
          this.setState({
            oppgaver: [],
            queryError: 'Klarte ikke å kjøre søk grunnet tidsavbrudd.',
            loading: false,
          });
        }
      })
      .catch(() => {
        this.setState({
          oppgaver: [],
          queryError: 'Klarte ikke å kjøre søk grunnet ukjent feil.',
          loading: false,
        });
      });
  }

  fjernFilter(oppgavefilter: Oppgavefilter) {
    this.setState(state => ({
      oppgaveQuery: new OppgaveQueryModel(state.oppgaveQuery).removeFilter(oppgavefilter.id).toOppgaveQuery(),
    }));
  }

  leggTilFilter(filterContainer: FiltereContainer) {
    this.setState(state => ({
      oppgaveQuery: new OppgaveQueryModel(state.oppgaveQuery).addFilter(filterContainer.id).toOppgaveQuery(),
    }));
  }

  leggTilGruppe(filterContainer: FiltereContainer) {
    this.setState(state => ({
      oppgaveQuery: new OppgaveQueryModel(state.oppgaveQuery).addGruppe(filterContainer.id).toOppgaveQuery(),
    }));
  }

  fjernSelectFelt(oppgavefelt: Oppgavefelt) {
    this.setState(state => ({
      oppgaveQuery: new OppgaveQueryModel(state.oppgaveQuery).removeSelectFelt(oppgavefelt.id).toOppgaveQuery(),
    }));
  }

  leggTilEnkelSelectFelt(filtereContainer: FiltereContainer) {
    this.setState(state => ({
      oppgaveQuery: new OppgaveQueryModel(state.oppgaveQuery)
        .addEnkelSelectFelt(state.oppgaveQuery, filtereContainer.id)
        .toOppgaveQuery(),
      oppgaver: null,
    }));
  }

  oppdaterFilter(id, newData) {
    this.setState(state => {
      const oppgaveQueryModel = new OppgaveQueryModel(state.oppgaveQuery);
      const oppgavefilterToUpdate = oppgaveQueryModel.getById(id);
      const data = {
        ...oppgavefilterToUpdate,
        ...newData,
      };
      oppgaveQueryModel.updateFilter(id, data);

      return {
        oppgaveQuery: oppgaveQueryModel.toOppgaveQuery(),
      };
    });
  }

  oppdaterEnkelSelectFelt(selectFelt: SelectFelt, verdi: string) {
    this.setState(state => {
      const newOppgaveQueryModel = new OppgaveQueryModel(state.oppgaveQuery);
      const selectToUpdate = newOppgaveQueryModel.getById(selectFelt.id);
      const data = {
        ...selectToUpdate,
        område: områdeFraKey(verdi),
        kode: kodeFraKey(verdi),
      };

      newOppgaveQueryModel.updateEnkelSelectFelt(selectFelt.id, data);
      return {
        oppgaveQuery: newOppgaveQueryModel.toOppgaveQuery(),
        oppgaver: null,
      };
    });
  }

  render() {
    const { oppgaveQuery } = this.state;
    const { oppgaver } = this.state;
    const { felter } = this.state;

    if (felter.length === 0) {
      return null;
    }

    return (
      <div className={styles.filterTopp}>
        {oppgaveQuery.filtere.map(item => (
          <OppgavefilterPanel
            key={item.id}
            felter={felter}
            oppgavefilter={item}
            onLeggTilFilter={this.leggTilFilter}
            onLeggTilGruppe={this.leggTilGruppe}
            onOppdaterFilter={this.oppdaterFilter}
            onFjernFilter={this.fjernFilter}
          />
        ))}
        <LeggTilFilterButton filterContainer={oppgaveQuery} onLeggTilFilter={this.leggTilFilter} />
        <LeggTilGruppeButton filterContainer={oppgaveQuery} onLeggTilGruppe={this.leggTilGruppe} />

        <ReadMore className={styles.feltvalgBlokk} header="Velg felter som skal vises">
          <OppgaveSelectFelter
            felter={felter}
            oppgaveQuery={oppgaveQuery}
            onLeggTil={this.leggTilEnkelSelectFelt}
            onOppdater={this.oppdaterEnkelSelectFelt}
            onFjern={this.fjernSelectFelt}
          />
        </ReadMore>

        <div className={styles.filterButtonGroup}>
          <Button icon={<Search aria-hidden />} onClick={this.executeOppgavesøk} loading={this.state.loading}>
            Søk
          </Button>
        </div>

        {this.state.queryError && <Alert variant="error">{this.state.queryError}</Alert>}

        {oppgaver && <OppgaveQueryResultat felter={felter} oppgaveQuery={oppgaveQuery} oppgaver={oppgaver} />}
      </div>
    );
  }
}

export default FilterIndex;
