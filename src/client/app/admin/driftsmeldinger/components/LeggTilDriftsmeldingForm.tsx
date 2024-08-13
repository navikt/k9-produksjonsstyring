import React, { FunctionComponent, useState } from 'react';
import { Form } from 'react-final-form';
import { FormattedMessage } from 'react-intl';
import { Button } from '@navikt/ds-react';
import { K9LosApiKeys } from 'api/k9LosApi';
import useRestApiRunner from 'api/rest-api-hooks/src/local-data/useRestApiRunner';
import { InputField } from 'form/FinalFields';
import { hasValidEmailFormat } from 'utils/validation/validators';
import { Driftsmelding } from '../driftsmeldingTsType';

/**
 * LeggTilDriftsmeldingForm
 */
interface OwnProps {
	hentAlleDriftsmeldinger: () => void;
}

export const LeggTilDriftsmeldingForm: FunctionComponent<OwnProps> = ({ hentAlleDriftsmeldinger }) => {
	const [leggerTilNyDriftsmelding, setLeggerTilNyDriftsmelding] = useState(false);

	const { startRequest: leggTilDriftsmelding } = useRestApiRunner<Driftsmelding>(K9LosApiKeys.LAGRE_DRIFTSMELDING);

	const addDriftsmelding = (melding: string, resetFormValues: () => void) => {
		if (!melding) {
			return;
		}
		setLeggerTilNyDriftsmelding(true);
		leggTilDriftsmelding({ driftsmelding: melding })
			.then(() => hentAlleDriftsmeldinger())
			.then(() => setLeggerTilNyDriftsmelding(false));
		resetFormValues();
	};

	return (
		<Form
			onSubmit={() => undefined}
			render={({ submitting, form, values }) => (
				<div>
					<div className="flex gap-6 relative">
						<InputField
							name="melding"
							className="min-w-64"
							label={<FormattedMessage id="LeggTilDriftsmeldingForm.LeggTil" />}
							bredde="L"
							validate={[hasValidEmailFormat]}
						/>
						<div>
							<Button
								className="absolute bottom-0 h-[42px]"
								loading={submitting}
								disabled={submitting || leggerTilNyDriftsmelding}
								tabIndex={0}
								onClick={() => addDriftsmelding(values.melding, form.reset)}
							>
								<FormattedMessage id="LeggTilDriftsmeldingForm.Legg_Til" />
							</Button>
						</div>
					</div>
				</div>
			)}
		/>
	);
};

export default LeggTilDriftsmeldingForm;
