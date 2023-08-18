import React, { FunctionComponent, useContext, useState } from 'react';
import { Field, FieldMetaState, Form } from 'react-final-form';
import { FormattedMessage } from 'react-intl';
import { useQueryClient } from 'react-query';
import { FormApi } from 'final-form';
import { Knapp } from 'nav-frontend-knapper';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import { Button, TextField } from '@navikt/ds-react';
import { PlusIcon } from '@navikt/ft-plattform-komponenter';
import { K9LosApiKeys } from 'api/k9LosApi';
import useRestApiRunner from 'api/rest-api-hooks/src/local-data/useRestApiRunner';
import { AvdelingslederContext } from 'avdelingsleder/context';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import { FlexColumn } from 'sharedComponents/flexGrid';
import { hasValidEmailFormat } from 'utils/validation/validators';
import { Saksbehandler } from '../saksbehandlerTsType';

/**
 * LeggTilSaksbehandlerForm
 */
export const LeggTilSaksbehandlerForm: FunctionComponent = () => {
	const [showWarning, setShowWarning] = useState(false);
	const { saksbehandlere } = useContext(AvdelingslederContext);
	const queryClient = useQueryClient();

	const { startRequest: leggTilSaksbehandler, resetRequestData: resetSaksbehandlerSok } =
		useRestApiRunner<Saksbehandler>(K9LosApiKeys.SAKSBEHANDLER_SOK);

	const resetSok = (resetFormValues: () => void) => {
		resetSaksbehandlerSok();
		resetFormValues();
		setShowWarning(false);
	};

	const addSaksbehandler = (epost: string, form: FormApi<any, Partial<any>>, meta: FieldMetaState<any>) => {
		if (meta.error) {
			form.blur('epost');
			return;
		}
		if (saksbehandlere.some((s) => s.epost.toLowerCase() === epost.toLowerCase())) {
			setShowWarning(true);
		} else {
			leggTilSaksbehandler({ epost })
				.then(() => {
					resetSok(form.reset);
					form.resetFieldState('epost');
				})
				.then(() => queryClient.invalidateQueries({ queryKey: '/avdelingsleder/saksbehandlere' }));
		}
	};

	const formatText = () => <FormattedMessage id="LeggTilSaksbehandlerForm.FinnesAllerede" />;

	return (
		<Form
			onSubmit={() => undefined}
			render={({ submitting, form, values }) => (
				<div>
					<Element>
						<FormattedMessage id="LeggTilSaksbehandlerForm.LeggTil" />
					</Element>
					<VerticalSpacer eightPx />
					<div className="flex flex-row">
						<Field name="epost" validate={hasValidEmailFormat}>
							{({ input, meta }) => (
								<>
									<TextField
										onChange={input.onChange}
										onBlur={input.onBlur}
										value={input.value}
										label="Epost"
										size="small"
										className="w-72"
										error={meta.touched && meta.error?.[0] && <FormattedMessage id={meta.error[0].id} />}
									/>
									<Button
										className="ml-4 h-[30px] mt-[1.7rem]"
										loading={submitting}
										size="small"
										variant="secondary"
										onClick={() => addSaksbehandler(values.epost, form, meta)}
										icon={<PlusIcon />}
									>
										<FormattedMessage id="LeggTilSaksbehandlerForm.LeggTil" />
									</Button>
								</>
							)}
						</Field>
					</div>
					{showWarning && (
						<>
							<Normaltekst>{formatText()}</Normaltekst>
							<FlexColumn>
								<Knapp mini htmlType="button" tabIndex={0} onClick={() => resetSok(form.reset)}>
									<FormattedMessage id="LeggTilSaksbehandlerForm.Nullstill" />
								</Knapp>
							</FlexColumn>
						</>
					)}
				</div>
			)}
		/>
	);
};

export default LeggTilSaksbehandlerForm;
