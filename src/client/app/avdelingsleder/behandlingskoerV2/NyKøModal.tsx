import React from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from 'react-query';
import { OppgavekøV2 } from 'types/OppgavekøV2Type';
import { Button, Heading, Modal } from '@navikt/ds-react';
import { Form, InputField } from '@navikt/ft-form-hooks';
import { minLength, required } from '@navikt/ft-form-validators';
import { apiPaths } from 'api/k9LosApi';
import { useNyKøMutation } from 'api/queries/avdelingslederQueries';

enum fieldnames {
	TITTEL = 'tittel',
}

interface OwnProps {
	lukk: () => void;
	vis: boolean;
}

const NyKøModal = ({ vis, lukk }: OwnProps) => {
	const mutation = useNyKøMutation(lukk);

	const formMethods = useForm({
		defaultValues: {
			[fieldnames.TITTEL]: '',
		},
	});

	return (
		<Modal className="w-3/12" open={vis} onClose={lukk}>
			<Modal.Content>
				<Heading size="medium">Opprett ny kø</Heading>
				<Form
					formMethods={formMethods}
					onSubmit={(data) => mutation.mutate({ url: apiPaths.opprettOppgaveko, body: data })}
				>
					<InputField
						className="my-6 max-w-sm"
						label="Navn"
						name={fieldnames.TITTEL}
						size="small"
						validate={[required, minLength(3)]}
					/>
					<div className="mt-8 flex gap-4">
						<Button loading={mutation.isLoading}>Opprett kø</Button>
						<Button variant="secondary" type="button" onClick={lukk}>
							Avbryt
						</Button>
					</div>
				</Form>
			</Modal.Content>
		</Modal>
	);
};

export default NyKøModal;
