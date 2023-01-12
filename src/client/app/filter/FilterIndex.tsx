import React, { useContext, useState } from 'react';

import useRestApi from 'api/rest-api-hooks/src/local-data/useRestApi';
import { K9LosApiKeys, k9LosApi } from 'api/k9LosApi';

import { REQUEST_POLLING_CANCELLED } from 'api/rest-api';
import useGlobalStateRestApiData from 'api/rest-api-hooks/src/global-data/useGlobalStateRestApiData';
import { RestApiRequestContext } from 'api/RestApiContext';

import { Knapp } from 'nav-frontend-knapper';
import { FlexColumn, FlexContainer, FlexRow } from 'sharedComponents/flexGrid';

import { Add, Delete, Search } from "@navikt/ds-icons";
import { Alert, Button, BodyLong, Heading, Modal, Panel, ReadMore, Select, Table, TextField } from "@navikt/ds-react";

import { Undertekst } from 'nav-frontend-typografi';

import { v4 as uuid } from 'uuid';

import styles from './filterIndex.less';

import { Oppgaverad, Oppgavefeltverdi, EnkelSelectFelt, SelectFelt, Oppgavefelt, OppgaveQuery, FiltereContainer, CombineOppgavefilter, FeltverdiOppgavefilter, Oppgavefilter } from './filterTsTypes.ts';
import OppgaveQueryModel from './OppgaveQueryModel.ts';
import LeggTilFilterButton from './parts/LeggTilFilterButton.tsx';
import LeggTilGruppeButton from './parts/LeggTilGruppeButton.tsx';
import OppgaveQueryResultat from './parts/OppgaveQueryResultat.tsx';
import OppgaveSelectFelter from './parts/OppgaveSelectFelter.tsx';
import { feltverdiKey, visningsnavnForFelt } from './utils.ts'


function områdeFraKey(key) {
  return key.split("__")[0];
}

function kodeFraKey(key) {
  return key.split("__")[1];
}

class FilterIndex extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      oppgaveQuery: new OppgaveQueryModel().toOppgaveQuery(),
      felter: [],
      oppgaver: null,
      queryError: null
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
            felter: dataRes.payload.felter
          });
        }
      })
      .catch(error => {
        this.setState({
          felter: []
        });
      });
  }

  hentFeltdefinisjoner() {

  }

  executeOppgavesøk() {
    k9LosApi
      .startRequest(K9LosApiKeys.OPPGAVE_QUERY, this.state.oppgaveQuery)
      .then(dataRes => {
        if (dataRes.payload !== REQUEST_POLLING_CANCELLED) {
          this.setState({
            oppgaver: dataRes.payload,
            queryError: null
          });
        }
      })
      .catch(error => {
        this.setState({
          oppgaver: [],
          queryError: "Klarte ikke å kjøre søk grunnet ukjent feil."
        });
      });
  }

  fjernFilter(oppgavefilter: Oppgavefiler) {
    this.setState((state, props) => ({
      oppgaveQuery: new OppgaveQueryModel(state.oppgaveQuery).removeFilter(oppgavefilter.id).toOppgaveQuery()
    }));
  }

  leggTilFilter(filterContainer: FiltereContainer) {
    this.setState((state, props) => ({
      oppgaveQuery: new OppgaveQueryModel(state.oppgaveQuery).addFilter(filterContainer.id).toOppgaveQuery()
    }));
  };

  leggTilGruppe(filterContainer: FiltereContainer) {
    this.setState((state, props) => ({
      oppgaveQuery: new OppgaveQueryModel(state.oppgaveQuery).addGruppe(filterContainer.id).toOppgaveQuery()
    }));
  };

  fjernSelectFelt(oppgavefelt: Oppgavefelt) {
    this.setState((state, props) => ({
      oppgaveQuery: new OppgaveQueryModel(state.oppgaveQuery).removeSelectFelt(oppgavefelt.id).toOppgaveQuery()
    }));
  };

  leggTilEnkelSelectFelt(filtereContainer: FiltereContainer) {
    this.setState((state, props) => ({
      oppgaveQuery: new OppgaveQueryModel(state.oppgaveQuery).addEnkelSelectFelt(state.oppgaveQuery, filtereContainer.id).toOppgaveQuery(),
      oppgaver: null
    }));
  };

  oppdaterFilter(id, newData) {
    this.setState((state, props) => {
      const oppgaveQueryModel = new OppgaveQueryModel(state.oppgaveQuery);;
      const oppgavefilterToUpdate = oppgaveQueryModel.getById(id);
      const data = {
        ...oppgavefilterToUpdate,
        ...newData
      };
      oppgaveQueryModel.updateFilter(id, data);

      return {
        oppgaveQuery: oppgaveQueryModel.toOppgaveQuery()
      }
    });
  }

  oppdaterEnkelSelectFelt(selectFelt: SelectFelt) {
    this.setState((state, props) => {
      const newOppgaveQueryModel = new OppgaveQueryModel(state.oppgaveQuery);
      const selectToUpdate = newOppgaveQueryModel.getById(selectFelt.id);
      const data = {
        ...selectToUpdate,
        "område" : områdeFraKey(event.target.value),
        "kode" : kodeFraKey(event.target.value)
      };

      newOppgaveQueryModel.updateEnkelSelectFelt(selectFelt.id, data);
      return {
        oppgaveQuery: newOppgaveQueryModel.toOppgaveQuery(),
        oppgaver: null
      }
    });
  };

  render() {
    const oppgaveQuery = this.state.oppgaveQuery;
    const oppgaveQueryModel = new OppgaveQueryModel(oppgaveQuery);
    const oppgaver = this.state.oppgaver;
    const felter = this.state.felter;

    if (felter.length === 0) {
      return null;
    }

    const renderFjernFilterKnapp = (oppgavefilter, filtereContainer) => {
      return <Button className={styles.filterFjern} icon={<Delete aria-hidden />} size="small" variant="tertiary" onClick={() => this.fjernFilter(oppgavefilter)}></Button>
    }

    const renderOppgaveFilter = (oppgavefilter, filtereContainer) => {
      if (oppgavefilter.type === "feltverdi") {
        const handleChangeKey = (event) => {
          this.oppdaterFilter(oppgavefilter.id, {
            "område" : områdeFraKey(event.target.value),
            "kode" : kodeFraKey(event.target.value)
          });
        };

        const handleChangeOperator = (event) => {
          this.oppdaterFilter(oppgavefilter.id, {
            "operator" : event.target.value
          });
        };

        const handleChangeValue = (event) => {
          this.oppdaterFilter(oppgavefilter.id, {
            "verdi" : event.target.value
          });
        };

        return (
          <Panel className={styles.filter + " " + styles.filterFelt} key={oppgavefilter.id} border>
            { renderFjernFilterKnapp(oppgavefilter, filtereContainer) }
            <Heading level="5" size="xsmall">Felt</Heading>
            <Select defaultValue={feltverdiKey(oppgavefilter)} onBlur={handleChangeKey}>
              <option value="">Velg felt</option>
              {
                felter.map(function(feltdefinisjon, i) {
                  return <option value={feltverdiKey(feltdefinisjon)}>{feltdefinisjon.visningsnavn}</option>
                })
              }
            </Select>
            <Select defaultValue={oppgavefilter.operator} onBlur={handleChangeOperator}>
              <option value="EQUALS">er lik</option>
              <option value="NOT_EQUALS">er IKKE lik</option>
              <option value="IN">inneholder</option>
              <option value="NOT_IN">inneholder IKKE</option>
              <option value="LESS_THAN">mindre enn (&#60;)</option>
              <option value="GREATER_THAN">større enn (&#62;)</option>
              <option value="LESS_THAN_OR_EQUALS">mindre enn eller lik (&#60;=)</option>
              <option value="GREATER_THAN_OR_EQUALS">større enn eller lik (&#62;=)</option>
            </Select>
            <TextField defaultValue={oppgavefilter.verdi} onBlur={handleChangeValue}/>
          </Panel>
        );
      } else if (oppgavefilter.type === "combine") {
        return (
          <Panel className={styles.filter + " " + styles.filterGruppe} key={oppgavefilter.id} border>
            { renderFjernFilterKnapp(oppgavefilter, filtereContainer) }
            <Heading level="5" size="xsmall">{(oppgavefilter.combineOperator === "OR") ? "Minimum en av disse må gjelde for oppgaven" : "Alle disse må gjelde for oppgaven"}</Heading>
            { oppgavefilter.filtere.map((item) => renderOppgaveFilter(item, oppgavefilter)) }
            <LeggTilFilterButton filterContainer={oppgavefilter} onLeggTilFilter={this.leggTilFilter} />
            <LeggTilGruppeButton filterContainer={oppgavefilter} onLeggTilGruppe={this.leggTilGruppe} />
          </Panel>
        );
      } else {
        throw new Error("Unhandled type: " + oppgavefilter.type);
      }
    }

    return (
      <div className={styles.filterTopp}>
        { oppgaveQuery.filtere.map((item) => renderOppgaveFilter(item, oppgaveQuery)) }
        <LeggTilFilterButton filterContainer={oppgaveQuery} onLeggTilFilter={this.leggTilFilter} />
        <LeggTilGruppeButton filterContainer={oppgaveQuery} onLeggTilGruppe={this.leggTilGruppe} />

        <ReadMore className={styles.feltvalgBlokk} header="Velg felter som skal vises">
          <OppgaveSelectFelter felter={felter} oppgaveQuery={oppgaveQuery} onLeggTil={this.leggTilEnkelSelectFelt} onOppdater={this.oppdaterEnkelSelectFelt} onFjern={this.fjernSelectFelt} />
        </ReadMore>

        <div className={styles.filterButtonGroup}>
          <Button icon={<Search aria-hidden />} onClick={this.executeOppgavesøk}>Søk</Button>
        </div>

        { this.state.queryError && <Alert variant="error">{this.state.queryError}</Alert>}

        { oppgaver &&
          <OppgaveQueryResultat felter={felter} oppgaveQuery={oppgaveQuery} oppgaver={oppgaver} />
        }
      </div>
    );
  }
}

export default FilterIndex;
