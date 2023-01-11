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

type Oppgave = Readonly<{
  id: number;
}>;

type Oppgavefilter = {
  type: String;
}

type FeltverdiOppgavefilter = Oppgavefilter & {
  område: String,
  kode: String,
  operator: String
  verdi: object;
}

type CombineOppgavefilter = Oppgavefilter & FiltereContainer & {
  combineOperator: String,
}

type FiltereContainer = {
  filtere: Oppgavefilter[];
}

type OppgaveQuery = FiltereContainer & {
  select: Feltuttrekk[];
};

type Feltuttrekk = {
  type: String
};

type EnkelFeltuttrekk = Feltuttrekk & {
  område: String,
  kode: String,
};

type Oppgavefeltverdi = {
  område: String,
  kode: String,
  verdi: object;
}

type Oppgaverad = {
  felter: Oppgavefeltverdi[]
};

function feltverdiKey(item) {
  return item.område + "__" + item.kode;
}

const oppgaveQueryInput: OppgaveQuery = {
  "filtere": [],
  "select": [
    {
      "type": "enkel",
      "område": "K9",
      "kode": "ytelsestype"
    }
  ]
};
/*
const oppgaveQueryInput: OppgaveQuery = {
  "filtere" : [ {
    "id": uuid(),
    "type" : "feltverdi",
    "område" : null,
    "kode" : "oppgavestatus",
    "operator" : "EQUALS",
    "verdi" : "OPPR"
  }, {
    "id": uuid(),
    "type" : "feltverdi",
    "område" : null,
    "kode" : "kildeområde",
    "operator" : "EQUALS",
    "verdi" : "K9"
  }, {
    "id": uuid(),
    "type" : "feltverdi",
    "område" : null,
    "kode" : "oppgavetype",
    "operator" : "EQUALS",
    "verdi" : "aksjonspunkt"
  }, {
    "type" : "feltverdi",
    "område" : null,
    "kode" : "oppgaveområde",
    "operator" : "EQUALS",
    "verdi" : "aksjonspunkt"
  }, {
    "type" : "feltverdi",
    "område" : "K9",
    "kode" : "fagsystem",
    "operator" : "NOT_EQUALS",
    "verdi" : "Tullball"
  }, {
    "type" : "combine",
    "combineOperator" : "OR",
    "filtere" : [ {
      "type" : "feltverdi",
      "område" : "K9",
      "kode" : "totrinnskontroll",
      "operator" : "EQUALS",
      "verdi" : true
    }, {
      "type" : "feltverdi",
      "område" : "K9",
      "kode" : "helautomatiskBehandlet",
      "operator" : "NOT_EQUALS",
      "verdi" : false
    }, {
      "type" : "feltverdi",
      "område" : "K9",
      "kode" : "mottattDato",
      "operator" : "LESS_THAN",
      "verdi" : "2022-01-01"
    }, {
      "type" : "combine",
      "combineOperator" : "AND",
      "filtere" : [ {
        "type" : "feltverdi",
        "område" : "K9",
        "kode" : "aktorId",
        "operator" : "GREATER_THAN_OR_EQUALS",
        "verdi" : 2
      } ]
    } ]
  } ]
};
*/

function updateIdentities(oppgaveQuery) {
  oppgaveQuery.id = uuid();
  oppgaveQuery.filtere.forEach(f => {
    f.id = uuid();
    if (f.filtere != null) {
      updateIdentities(f);
    }
  });
  return oppgaveQuery;
}

function removeFilter(oppgaveQuery, id) {
  const index = oppgaveQuery.filtere.findIndex(f => f.id == id);
  if (index >= 0) {
    oppgaveQuery.filtere.splice(index, 1);
  } else {
    oppgaveQuery.filtere.filter(f => f.filtere != null).forEach(f => removeFilter(f, id));
  }
  return oppgaveQuery;
}

function getById(oppgaveQuery, id) {
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
    const result = getById(f, id);
    if (result != null) {
      return result;
    }
  }

  for (let f of oppgaveQuery.select) {
    if (f.id === id) {
      return f;
    }
  }
  return null;
}

function addFilter(oppgaveQuery, id) {
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
    oppgaveQuery.filtere.filter(f => f.filtere != null).forEach(f => addFilter(f, id));
  }
  return oppgaveQuery;
}

function updateFilter(oppgaveQuery, id, data) {
  const index = oppgaveQuery.filtere.findIndex(f => f.id === id);
  if (index >= 0) {
    oppgaveQuery.filtere[index] = data;
  } else {
    oppgaveQuery.filtere.filter(f => f.filtere != null).forEach(f => updateFilter(f, id, data));
  }
  return oppgaveQuery;
}

function addGruppe(oppgaveQuery, id) {
  if (oppgaveQuery.id === id) {
    oppgaveQuery.filtere.push({
      "id": uuid(),
      "type" : "combine",
      "combineOperator": (oppgaveQuery.combineOperator == null || oppgaveQuery.combineOperator === "AND") ? "OR" : "AND",
      "filtere": []
    });
  } else {
    oppgaveQuery.filtere.filter(f => f.filtere != null).forEach(f => addGruppe(f, id));
  }
  return oppgaveQuery;
}

function addEnkelSelectFelt(oppgaveQuery) {
  oppgaveQuery.select.push({
    "id": uuid(),
    "type" : "enkel",
    "område" : null,
    "kode" : null,
  });
  return oppgaveQuery;
}

function removeSelectFelt(oppgaveQuery, id) {
  const index = oppgaveQuery.select.findIndex(f => f.id == id);
  if (index >= 0) {
    oppgaveQuery.select.splice(index, 1);
  }
  return oppgaveQuery;
}

function updateEnkelSelectFelt(oppgaveQuery, id, data) {
  const index = oppgaveQuery.select.findIndex(f => f.id === id);
  if (index >= 0) {
    oppgaveQuery.select[index] = data;
  }
  return oppgaveQuery;
}

class FilterIndex extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      oppgaveQuery: updateIdentities(oppgaveQueryInput),
      felter: [],
      oppgaver: null,
      valgteVisningsfelter: ["Antall"],
      queryError: null
    };

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

  render() {
    const oppgaveQuery = this.state.oppgaveQuery;
    const oppgaver = this.state.oppgaver;
    const felter = this.state.felter;

    if (felter.length === 0) {
      return null;
    }

    const oppgaveSøk = () => {
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

    const renderFjernFilterKnapp = (oppgavefilter, index, filtereContainer) => {
      const fjernFilterKnapp = () => {
        this.setState((state, props) => ({
          oppgaveQuery: removeFilter(state.oppgaveQuery, oppgavefilter.id)
        }));
      };
      return <Button className={styles.filterFjern} icon={<Delete aria-hidden />} size="small" variant="tertiary" onClick={fjernFilterKnapp}></Button>
    }

    const renderFjernSelectFeltKnapp = (felt) => {
      const fjernSelectFeltKnapp = () => {
        this.setState((state, props) => ({
          oppgaveQuery: removeSelectFelt(state.oppgaveQuery, felt.id)
        }));
      };
      return <Button icon={<Delete aria-hidden />} size="medium" variant="tertiary" onClick={fjernSelectFeltKnapp}></Button>
    }

    const renderLeggTilFilterKnapp = (filtereContainer) => {
      const leggTilFilterKnapp = () => {
        this.setState((state, props) => ({
          oppgaveQuery: addFilter(state.oppgaveQuery, filtereContainer.id)
        }));
      };
      return <Button className={styles.filterLeggTil} icon={<Add aria-hidden />} size="xsmall" variant="tertiary" onClick={leggTilFilterKnapp}>Legg til filter</Button>
    }

    const renderLeggTilGruppeKnapp = (filtereContainer) => {
      const leggTilGruppeKnapp = () => {
        this.setState((state, props) => ({
          oppgaveQuery: addGruppe(state.oppgaveQuery, filtereContainer.id)
        }));
      };
      return <Button className={styles.filterLeggTil} icon={<Add aria-hidden />} size="xsmall" variant="tertiary" onClick={leggTilGruppeKnapp}>Legg til gruppe</Button>
    }

    const renderAddEnkelSelectFeltKnapp = (filtereContainer) => {
      const enkelSelectFeltKnapp = () => {
        this.setState((state, props) => ({
          oppgaveQuery: addEnkelSelectFelt(state.oppgaveQuery, filtereContainer.id),
          oppgaver: null
        }));
      };
      return <Button className={styles.filterLeggTil} icon={<Add aria-hidden />} size="xsmall" variant="tertiary" onClick={enkelSelectFeltKnapp}>Legg til felt</Button>
    }

    function områdeFraKey(key) {
      return key.split("__")[0];
    }

    function kodeFraKey(key) {
      return key.split("__")[1];
    }

    const visningsnavnForFelt = (område: String, kode: String) => {
      for (const felt of felter) {
        if (felt.område == område && felt.kode == kode) {
          return felt.visningsnavn;
        }
      }
      console.log("Mangler visningsnavn for: " + område + "." + kode);
      return kode;
    };

    const partialUpdateFilter = (id, newData) => {
      this.setState((state, props) => {
        const newOppgaveQuery = { ...state.oppgaveQuery };
        const oppgavefilterToUpdate = getById(newOppgaveQuery, id);
        const data = {
          ...oppgavefilterToUpdate,
          ...newData
        };
        updateFilter(newOppgaveQuery, id, data);
        return {
          oppgaveQuery: newOppgaveQuery
        }
      });
    }

    const renderOppgaveFilter = (oppgavefilter, index, filtereContainer) => {
      if (oppgavefilter.type === "feltverdi") {
        const handleChangeKey = (event) => {
          partialUpdateFilter(oppgavefilter.id, {
            "område" : områdeFraKey(event.target.value),
            "kode" : kodeFraKey(event.target.value)
          });
        };

        const handleChangeOperator = (event) => {
          partialUpdateFilter(oppgavefilter.id, {
            "operator" : event.target.value
          });
        };

        const handleChangeValue = (event) => {
          partialUpdateFilter(oppgavefilter.id, {
            "verdi" : event.target.value
          });
        };

        return (
          <Panel className={styles.filter + " " + styles.filterFelt} key={oppgavefilter.id} border>
            { renderFjernFilterKnapp(oppgavefilter, index, filtereContainer) }
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
            { renderFjernFilterKnapp(oppgavefilter, index, filtereContainer) }
            <Heading level="5" size="xsmall">{(oppgavefilter.combineOperator === "OR") ? "Minimum en av disse må gjelde for oppgaven" : "Alle disse må gjelde for oppgaven"}</Heading>
            { oppgavefilter.filtere.map((item, index) => renderOppgaveFilter(item, index, oppgavefilter)) }
            { renderLeggTilFilterKnapp(oppgavefilter) }
            { renderLeggTilGruppeKnapp(oppgavefilter) }
          </Panel>
        );
      } else {
        throw new Error("Unhandled type: " + oppgavefilter.type);
      }
    }

    const renderSelectFelt = (felt) => {
      const id = felt.id;

      const enkelSelectFeltKnapp = () => {
        this.setState((state, props) => {
          const newOppgaveQuery = { ...state.oppgaveQuery };
          const selectToUpdate = getById(newOppgaveQuery, id);
          const data = {
            ...selectToUpdate,
            "område" : områdeFraKey(event.target.value),
            "kode" : kodeFraKey(event.target.value)
          };

          updateEnkelSelectFelt(state.oppgaveQuery, id, data);
          return {
            oppgaveQuery: newOppgaveQuery,
            oppgaver: null
          }
        });
      };

      return (<div className={styles.selectEnkelFelt} key={felt.id}>
            <Select defaultValue={feltverdiKey(felt)} onBlur={enkelSelectFeltKnapp}>
              <option value="">Velg felt</option>
              {
                felter.map(function(feltdefinisjon, i) {
                  return <option value={feltverdiKey(feltdefinisjon)}>{feltdefinisjon.visningsnavn}</option>
                })
              }
            </Select>
            { renderFjernSelectFeltKnapp(felt) }
          </div>);
    };

    return (
      <div className={styles.filterTopp}>
        { oppgaveQuery.filtere.map((item, index) => renderOppgaveFilter(item, index, oppgaveQuery)) }
        { renderLeggTilFilterKnapp(oppgaveQuery) }
        { renderLeggTilGruppeKnapp(oppgaveQuery) }

        <ReadMore className={styles.feltvalgBlokk} header="Velg felter som skal vises">
          {oppgaveQuery.select && oppgaveQuery.select.map(renderSelectFelt)}
          { renderAddEnkelSelectFeltKnapp(oppgaveQuery) }
        </ReadMore>

        <div className={styles.filterButtonGroup}>
          <Button icon={<Search aria-hidden />} onClick={oppgaveSøk}>Søk</Button>
        </div>

        { this.state.queryError && <Alert variant="error">{this.state.queryError}</Alert>}
        { oppgaver &&
          <Table>
            <Table.Header>
              <Table.Row>
                {oppgaveQuery.select && oppgaveQuery.select.map(felt => {
                  return <Table.HeaderCell scope="col" key={felt.id}>{visningsnavnForFelt(felt.område, felt.kode)}</Table.HeaderCell>
                })}
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {oppgaver.map(oppgave => (<Table.Row key={oppgave.id}>
                  {oppgave.felter.map( felt => (<Table.DataCell>
                      {Array.isArray(felt.verdi) ? felt.verdi.join(", ") : felt.verdi}
                    </Table.DataCell>
                  ))}
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        }
      </div>
    );
  }
}

export default FilterIndex;
