import React from 'react';
import { v4 as uuid } from 'uuid';
import { FloppydiskIcon } from '@navikt/aksel-icons';
import { Download, Search } from '@navikt/ds-icons';
import { Alert, Button, ReadMore, TextField } from '@navikt/ds-react';
import { K9LosApiKeys, k9LosApi } from 'api/k9LosApi';
import { REQUEST_POLLING_CANCELLED } from 'api/rest-api';
import OppgaveQueryModel from './OppgaveQueryModel';
import styles from './filterIndex.css';
import {
	CombineOppgavefilter,
	EnkelOrderFelt,
	EnkelSelectFelt,
	FeltverdiOppgavefilter,
	OppgaveQuery,
	Oppgavefelt,
	Oppgaverad,
} from './filterTsTypes';
import LeggTilFilterButton from './parts/LeggTilFilterButton';
import LeggTilGruppeButton from './parts/LeggTilGruppeButton';
import OppgaveOrderFelter from './parts/OppgaveOrderFelter';
import OppgaveQueryResultat from './parts/OppgaveQueryResultat';
import OppgaveSelectFelter from './parts/OppgaveSelectFelter';
import OppgavefilterPanel from './parts/OppgavefilterPanel';
import { kodeFraKey, områdeFraKey } from './utils';

interface OwnProps {
	lagre?: (oppgaveQuery: OppgaveQuery) => void;
	avbryt?: () => void;
	initialQuery?: OppgaveQuery;
}

interface OwnState {
	oppgaveQuery: OppgaveQuery;
	felter: Oppgavefelt[];
	oppgaver?: Oppgaverad[];
	queryError?: string;
	loading: boolean;
	loadingDownload: boolean;
}

class FilterIndex extends React.Component<OwnProps, OwnState> {
	constructor(props) {
		super(props);

		this.state = {
			oppgaveQuery: props.initialQuery || new OppgaveQueryModel().toOppgaveQuery(),
			felter: [],
			oppgaver: null,
			queryError: null,
			loading: false,
			loadingDownload: false,
		};

		this.executeOppgavesøk = this.executeOppgavesøk.bind(this);
		this.executeOppgavesøkToFile = this.executeOppgavesøkToFile.bind(this);

		this.fjernFilter = this.fjernFilter.bind(this);
		this.leggTilFilter = this.leggTilFilter.bind(this);
		this.leggTilGruppe = this.leggTilGruppe.bind(this);
		this.oppdaterFilter = this.oppdaterFilter.bind(this);

		this.fjernSelectFelt = this.fjernSelectFelt.bind(this);
		this.leggTilEnkelSelectFelt = this.leggTilEnkelSelectFelt.bind(this);
		this.oppdaterEnkelSelectFelt = this.oppdaterEnkelSelectFelt.bind(this);

		this.fjernOrderFelt = this.fjernOrderFelt.bind(this);
		this.leggTilEnkelOrderFelt = this.leggTilEnkelOrderFelt.bind(this);
		this.oppdaterEnkelOrderFelt = this.oppdaterEnkelOrderFelt.bind(this);

		this.oppdaterLimit = this.oppdaterLimit.bind(this);

		k9LosApi
			.startRequest(K9LosApiKeys.OPPGAVE_QUERY_FELTER, undefined)
			.then((dataRes) => {
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
			.catch((error) => {
				this.setState({
					felter: [],
				});
				throw error;
			});
	}

	executeOppgavesøk() {
		function updateIdentities(oppgaverader: Oppgaverad[]) {
			oppgaverader.map((v) => ({
				...v,
				id: uuid(),
			}));
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
			.then((dataRes) => {
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

	executeOppgavesøkToFile() {
		if (this.state.loadingDownload) {
			return;
		}

		this.setState({
			loadingDownload: true,
		});

		k9LosApi
			.startRequest(
				K9LosApiKeys.OPPGAVE_QUERY_TO_FILE,
				new OppgaveQueryModel(this.state.oppgaveQuery).updateLimit(-1).toOppgaveQuery(),
			)
			.then((dataRes) => {
				if (dataRes.payload !== REQUEST_POLLING_CANCELLED) {
					this.setState({
						queryError: null,
						loadingDownload: false,
					});
				} else {
					this.setState({
						queryError: 'Klarte ikke å kjøre søk grunnet tidsavbrudd.',
						loadingDownload: false,
					});
				}
			})
			.catch(() => {
				this.setState({
					queryError: 'Klarte ikke å kjøre søk grunnet ukjent feil.',
					loadingDownload: false,
				});
			});
	}

	fjernFilter(oppgavefilter: FeltverdiOppgavefilter | CombineOppgavefilter) {
		this.setState((state) => ({
			oppgaveQuery: new OppgaveQueryModel(state.oppgaveQuery).removeFilter(oppgavefilter.id).toOppgaveQuery(),
			oppgaver: null,
		}));
	}

	leggTilFilter(filterContainer: OppgaveQuery | CombineOppgavefilter) {
		this.setState((state) => ({
			oppgaveQuery: new OppgaveQueryModel(state.oppgaveQuery).addFilter(filterContainer.id).toOppgaveQuery(),
			oppgaver: null,
		}));
	}

	leggTilGruppe(filterContainer: OppgaveQuery) {
		this.setState((state) => ({
			oppgaveQuery: new OppgaveQueryModel(state.oppgaveQuery).addGruppe(filterContainer.id).toOppgaveQuery(),
			oppgaver: null,
		}));
	}

	fjernSelectFelt(oppgavefelt: EnkelSelectFelt) {
		this.setState((state) => ({
			oppgaveQuery: new OppgaveQueryModel(state.oppgaveQuery).removeSelectFelt(oppgavefelt.id).toOppgaveQuery(),
			oppgaver: null,
		}));
	}

	leggTilEnkelSelectFelt() {
		this.setState((state) => ({
			oppgaveQuery: new OppgaveQueryModel(state.oppgaveQuery).addEnkelSelectFelt().toOppgaveQuery(),
			oppgaver: null,
		}));
	}

	oppdaterFilter(id, newData) {
		this.setState((state) => {
			const oppgaveQueryModel = new OppgaveQueryModel(state.oppgaveQuery);
			const oppgavefilterToUpdate = oppgaveQueryModel.getById(id);
			const data = {
				...oppgavefilterToUpdate,
				...newData,
			};
			oppgaveQueryModel.updateFilter(id, data);

			return {
				oppgaveQuery: oppgaveQueryModel.toOppgaveQuery(),
				oppgaver: null,
			};
		});
	}

	oppdaterEnkelSelectFelt(selectFelt: EnkelSelectFelt, verdi: string) {
		this.setState((state) => {
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

	fjernOrderFelt(orderFelt: EnkelOrderFelt) {
		this.setState((state) => ({
			oppgaveQuery: new OppgaveQueryModel(state.oppgaveQuery).removeOrderFelt(orderFelt.id).toOppgaveQuery(),
			oppgaver: null,
		}));
	}

	leggTilEnkelOrderFelt() {
		this.setState((state) => ({
			oppgaveQuery: new OppgaveQueryModel(state.oppgaveQuery).addEnkelOrderFelt().toOppgaveQuery(),
			oppgaver: null,
		}));
	}

	oppdaterEnkelOrderFelt(orderFelt: EnkelOrderFelt, newData) {
		this.setState((state) => {
			const newOppgaveQueryModel = new OppgaveQueryModel(state.oppgaveQuery);
			const orderToUpdate = newOppgaveQueryModel.getById(orderFelt.id);
			const data = {
				...orderToUpdate,
				...newData,
			};

			newOppgaveQueryModel.updateEnkelOrderFelt(orderFelt.id, data);
			return {
				oppgaveQuery: newOppgaveQueryModel.toOppgaveQuery(),
				oppgaver: null,
			};
		});
	}

	oppdaterLimit(limit: number) {
		this.setState((state) => ({
			oppgaveQuery: new OppgaveQueryModel(state.oppgaveQuery).updateLimit(limit).toOppgaveQuery(),
		}));
	}

	render() {
		const { oppgaveQuery } = this.state;
		const { oppgaver } = this.state;
		const { felter } = this.state;
		const { lagre, avbryt } = this.props;

		if (felter.length === 0) {
			return null;
		}

		return (
			<div className={styles.filterTopp}>
				{oppgaveQuery.filtere.map((item) => (
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
				<ReadMore
					className={styles.feltvalgBlokk}
					header="Velg felter som skal vises"
					defaultOpen={!!oppgaveQuery.select.length}
				>
					<OppgaveSelectFelter
						felter={felter}
						oppgaveQuery={oppgaveQuery}
						onLeggTil={this.leggTilEnkelSelectFelt}
						onOppdater={this.oppdaterEnkelSelectFelt}
						onFjern={this.fjernSelectFelt}
					/>
				</ReadMore>

				<ReadMore className={styles.feltvalgBlokk} header="Velg sortering" defaultOpen={!!oppgaveQuery.order.length}>
					<OppgaveOrderFelter
						felter={felter}
						oppgaveQuery={oppgaveQuery}
						onLeggTil={this.leggTilEnkelOrderFelt}
						onOppdater={this.oppdaterEnkelOrderFelt}
						onFjern={this.fjernOrderFelt}
					/>
				</ReadMore>

				<div className={styles.filterButtonGroup}>
					{lagre && (
						<>
							<Button
								icon={<FloppydiskIcon />}
								onClick={() => lagre(this.state.oppgaveQuery)}
								loading={this.state.loading}
							>
								Lagre
							</Button>
							<Button className="mr-2" variant="secondary" onClick={avbryt}>
								Avbryt
							</Button>
						</>
					)}
					<Button
						variant={lagre ? 'tertiary' : 'primary'}
						icon={<Search aria-hidden />}
						onClick={this.executeOppgavesøk}
						loading={this.state.loading}
					>
						Søk
					</Button>
					<Button
						variant={lagre ? 'tertiary' : 'primary'}
						icon={<Download aria-hidden />}
						onClick={this.executeOppgavesøkToFile}
						loading={this.state.loadingDownload}
					>
						Last ned CSV
					</Button>
				</div>

				{this.state.queryError && <Alert variant="error">{this.state.queryError}</Alert>}

				{oppgaver && (
					<>
						<OppgaveQueryResultat felter={felter} oppgaveQuery={oppgaveQuery} oppgaver={oppgaver} />
						<TextField
							className={styles.limitTextField}
							label="Maksimalt antall rader"
							description="Du kan endre antallet rader som blir hentet ned ved søk. Trykk på søkeknappen etter å ha oppdatert antallet. Merk at høye tall kan medføre at du må vente en stund før svaret kommer. Hvis søket blir avbrutt, fordi det tar for lang tid, så kan du forsøke det samme søket på nytt."
							htmlSize={4}
							type="number"
							defaultValue={oppgaveQuery.limit}
							onBlur={(event) => this.oppdaterLimit(parseInt(event.target.value, 10) || 0)}
						/>
					</>
				)}
			</div>
		);
	}
}

export default FilterIndex;
