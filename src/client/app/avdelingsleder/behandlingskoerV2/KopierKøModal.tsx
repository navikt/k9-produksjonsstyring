import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { OppgavekøV2Enkel } from 'types/OppgavekøV2Type';
import { Button, ErrorMessage, Heading, Modal } from '@navikt/ds-react';
import { CheckboxField, Form, InputField } from '@navikt/ft-form-hooks';
import { minLength, required } from '@navikt/ft-form-validators';
import { useKopierKøMutation } from 'api/queries/avdelingslederQueries';

interface Props {
	lukk: () => void;
	eksisterendeKø: OppgavekøV2Enkel;
}

const fieldnames = {
	TITTEL: 'tittel',
	TA_MED_QUERY: 'taMedQuery',
	TA_MED_SAKSBEHANDLERE: 'taMedSaksbehandlere',
};

const KopierKøModal: React.FC<Props> = ({ lukk, eksisterendeKø }) => {
	const { mutate, isError, reset } = useKopierKøMutation(lukk);
	const onClose = () => {
		lukk();
		reset();
	};

	useEffect(() => () => reset(), []);
	const formMethods = useForm({
		defaultValues: {
			[fieldnames.TITTEL]: '',
			[fieldnames.TA_MED_QUERY]: false,
			[fieldnames.TA_MED_SAKSBEHANDLERE]: false,
		},
	});

	const onSubmit = (data: Record<string, any>) => {
		const { tittel, taMedQuery, taMedSaksbehandlere } = data;
		const payload = {
			kopierFraOppgaveId: eksisterendeKø.id,
			tittel,
			taMedQuery,
			taMedSaksbehandlere,
		};

		mutate(payload);
	};
	return (
		<Modal className="w-2/6" onClose={onClose} open portal>
			<Modal.Body>
				<Form formMethods={formMethods} onSubmit={onSubmit}>
					<Heading spacing level="1" size="medium">
						Kopier behandlingskø
					</Heading>

					<InputField
						className="mt-6 mb-8 max-w"
						label="Kønavn"
						name={fieldnames.TITTEL}
						size="small"
						validate={[required, minLength(3)]}
					/>
					<CheckboxField name={fieldnames.TA_MED_QUERY} label={`Kopier køkriterier fra ${eksisterendeKø.tittel}`} />
					<CheckboxField
						name={fieldnames.TA_MED_SAKSBEHANDLERE}
						label={`Kopier saksbehandlere fra ${eksisterendeKø.tittel}`}
						className="mt-2"
					/>
					{isError && (
						<div className="my-4">
							<ErrorMessage>Noe gikk galt ved kopiering av kø</ErrorMessage>
						</div>
					)}
					<div className="flex gap-2 mt-4">
						<Button type="submit">Kopier behandlingskø</Button>
						<Button variant="secondary" onClick={onClose}>
							Avbryt
						</Button>
					</div>
				</Form>
			</Modal.Body>
		</Modal>
	);
};

export default KopierKøModal;
