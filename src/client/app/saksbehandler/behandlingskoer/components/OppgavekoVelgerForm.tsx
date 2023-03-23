import React, { FunctionComponent, ReactNode, useEffect } from 'react';
import { Form, FormSpy } from 'react-final-form';
import { FormattedMessage, WrappedComponentProps, injectIntl } from 'react-intl';
import gruppeUrl from 'images/gruppe.svg';
import gruppeHoverUrl from 'images/gruppe_hover.svg';
import { Hovedknapp } from 'nav-frontend-knapper';
import { Element, Undertekst } from 'nav-frontend-typografi';
import { K9LosApiKeys } from 'api/k9LosApi';
import useRestApiRunner from 'api/rest-api-hooks/src/local-data/useRestApiRunner';
import { SelectField } from 'form/FinalFields';
import { Oppgaveko } from 'saksbehandler/behandlingskoer/oppgavekoTsType';
import Image from 'sharedComponents/Image';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import { FlexColumn, FlexContainer, FlexRow } from 'sharedComponents/flexGrid';
import { Saksbehandler } from '../saksbehandlerTsType';
import OldOppsummeringAvKø from './OldOppsummeringAvKø';
import styles from './oppgavekoVelgerForm.css';

interface OwnProps {
	oppgavekoer: Oppgaveko[];
	setValgtOppgavekoId: (id: string) => void;
	getValueFromLocalStorage: (key: string) => string;
	setValueInLocalStorage: (key: string, value: string) => void;
	removeValueFromLocalStorage: (key: string) => void;
	plukkNyOppgave: () => void;
	erRestApiKallLoading: boolean;
}

const createTooltip = (saksbehandlere: Saksbehandler[]): ReactNode | undefined => {
	if (!saksbehandlere || saksbehandlere.length === 0) {
		return undefined;
	}

	return (
		<div>
			<Element className={styles.tooltipHeader}>
				<FormattedMessage id="OppgavekoVelgerForm.SaksbehandlerToolip" />
			</Element>
			{saksbehandlere
				.sort((n1, n2) => n1.epost.localeCompare(n2.epost))
				.map((s) => (
					<li key={s.epost}>{s.navn ? s.navn : s.epost}</li>
				))}
		</div>
	);
};

const getDefaultOppgaveko = (oppgavekoer, getValueFromLocalStorage, removeValueFromLocalStorage) => {
	const lagretOppgavekoId = getValueFromLocalStorage('id');
	if (lagretOppgavekoId) {
		if (oppgavekoer.some((s) => `${s.id}` === lagretOppgavekoId)) {
			return lagretOppgavekoId;
		}
		removeValueFromLocalStorage('id');
	}

	const sortertOppgavekoer = oppgavekoer.sort((oppgaveko1, oppgaveko2) =>
		oppgaveko1.navn.localeCompare(oppgaveko2.navn),
	);
	return sortertOppgavekoer.length > 0 ? sortertOppgavekoer[0].id : undefined;
};

const getInitialValues = (oppgavekoer, getValueFromLocalStorage, removeValueFromLocalStorage) => {
	if (oppgavekoer.length === 0) {
		return {
			id: undefined,
		};
	}
	const defaultOppgaveko = getDefaultOppgaveko(oppgavekoer, getValueFromLocalStorage, removeValueFromLocalStorage);
	return {
		id: defaultOppgaveko ? `${defaultOppgaveko}` : undefined,
	};
};

/**
 * OppgavekoVelgerForm
 *
 */
export const OppgavekoVelgerForm: FunctionComponent<OwnProps & WrappedComponentProps> = ({
	intl,
	oppgavekoer,
	setValgtOppgavekoId,
	getValueFromLocalStorage,
	setValueInLocalStorage,
	removeValueFromLocalStorage,
	plukkNyOppgave,
	erRestApiKallLoading,
}) => {
	const { startRequest: fetchAntallOppgaver, data: antallOppgaver } = useRestApiRunner<number>(
		K9LosApiKeys.BEHANDLINGSKO_OPPGAVE_ANTALL,
	);

	const { data: saksbehandlere, startRequest: hentSaksbehandlere } = useRestApiRunner<Saksbehandler[]>(
		K9LosApiKeys.OPPGAVEKO_SAKSBEHANDLERE,
	);

	useEffect(() => {
		if (oppgavekoer.length > 0) {
			const defaultOppgavekoId = getDefaultOppgaveko(
				oppgavekoer,
				getValueFromLocalStorage,
				removeValueFromLocalStorage,
			);
			if (defaultOppgavekoId) {
				setValgtOppgavekoId(defaultOppgavekoId);
				hentSaksbehandlere({ id: defaultOppgavekoId });
				fetchAntallOppgaver({ id: defaultOppgavekoId });
			}
		}
	}, []);

	return (
		<div className={styles.oppgavevelgerform_container}>
			<Form
				onSubmit={() => undefined}
				initialValues={getInitialValues(oppgavekoer, getValueFromLocalStorage, removeValueFromLocalStorage)}
				render={({ values = {} }) => (
					<form>
						<FormSpy
							onChange={(val) => {
								if (val && val.values.id && val.dirtyFields.id) {
									setValueInLocalStorage('id', val.values.id);
									const { id } = val.values;
									setValgtOppgavekoId(id);
									fetchAntallOppgaver({ id });
								}
							}}
							subscription={{ values: true, dirtyFields: true }}
						/>
						<FlexContainer>
							<FlexRow>
								<FlexColumn className={styles.navnInput}>
									<SelectField
										name="id"
										label={intl.formatMessage({ id: 'OppgavekoVelgerForm.Oppgaveko' })}
										selectValues={oppgavekoer.map((oppgaveko) => (
											<option key={oppgaveko.id} value={`${oppgaveko.id}`}>
												{oppgaveko.navn}
											</option>
										))}
										bredde="l"
									/>
									<VerticalSpacer eightPx />
									<Undertekst>
										<FormattedMessage
											id="OppgavekoVelgerForm.AntallOppgaver"
											values={{ antall: antallOppgaver || 0 }}
										/>
									</Undertekst>
									<VerticalSpacer sixteenPx />
								</FlexColumn>
								<FlexColumn>
									<div className={styles.saksbehandlerIkon} />
									<Image
										alt={intl.formatMessage({ id: 'OppgavekoVelgerForm.Saksbehandlere' })}
										src={gruppeUrl}
										srcHover={gruppeHoverUrl}
										tooltip={createTooltip(saksbehandlere)}
									/>
								</FlexColumn>
								<OldOppsummeringAvKø id={values.id} oppgavekoer={oppgavekoer} />
							</FlexRow>
						</FlexContainer>
					</form>
				)}
			/>
			<Hovedknapp
				id="frode sin knapp"
				className={styles.nyOppgaveBtn}
				spinner={erRestApiKallLoading}
				disabled={erRestApiKallLoading}
				onClick={() => plukkNyOppgave()}
			>
				{intl.formatMessage({ id: 'OppgavekoVelgerForm.PlukkNyOppgave' })}
			</Hovedknapp>
		</div>
	);
};

export default injectIntl(OppgavekoVelgerForm);
