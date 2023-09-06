import React from 'react';
import { useForm } from 'react-hook-form';
import { Button, ErrorMessage, Heading, Modal } from '@navikt/ds-react';
import { Form, InputField, TextAreaField } from '@navikt/ft-form-hooks';
import { minLength, required } from '@navikt/ft-form-validators';
import apiPaths from 'api/apiPaths';
import { useNyKøMutation } from 'api/queries/avdelingslederQueries';

enum fieldnames {
	TITTEL = 'tittel',
	BESKRIVELSE = 'beskrivelse',
}

interface OwnProps {
	lukk: () => void;
	vis: boolean;
	onSuccessCallback?: (id: string) => void;
}

const NyKøModal = ({ vis, lukk, onSuccessCallback }: OwnProps) => {
	const callback = (id) => {
		lukk();
		if (onSuccessCallback) onSuccessCallback(id);
	};
	const mutation = useNyKøMutation(callback);

	const formMethods = useForm({
		defaultValues: {
			[fieldnames.TITTEL]: '',
			[fieldnames.BESKRIVELSE]: '',
		},
	});

	return (
		<Modal className="w-[44rem]" open={vis} onClose={lukk}>
			<Modal.Content>
				<Heading size="medium">Ny behandlingskø</Heading>
				<Form
					formMethods={formMethods}
					onSubmit={(data) => mutation.mutate({ url: apiPaths.opprettOppgaveko, body: data })}
				>
					<InputField
						className="my-6 max-w"
						label="Kønavn"
						name={fieldnames.TITTEL}
						size="small"
						validate={[required, minLength(3)]}
					/>
					<TextAreaField
						name={fieldnames.BESKRIVELSE}
						label="Beskrivelse"
						description="Kort beskrivelse av hva denne køen inneholder"
						maxLength={4000}
						validate={[required, minLength(3)]}
					/>
					{mutation.isError && <ErrorMessage>Noe gikk galt ved oppretting av kø.</ErrorMessage>}
					<div className="mt-8 flex gap-4 justify-end">
						<Button variant="secondary" type="button" onClick={lukk}>
							Avbryt
						</Button>
						<Button loading={mutation.isLoading}>Opprett kø</Button>
					</div>
				</Form>
			</Modal.Content>
		</Modal>
	);
};

export default NyKøModal;
