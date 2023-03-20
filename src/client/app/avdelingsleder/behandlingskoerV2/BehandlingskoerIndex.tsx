import React from 'react';
import { useMutation } from 'react-query';
import axios from 'axios';
import { Kødefinisjon } from 'types/Kødefinisjon';
import { Button } from '@navikt/ds-react';
import BehandlingsKoForm from './BehandlingsKoForm';

const BehandlingskoerIndex = () => {
	const mutation = useMutation<Kødefinisjon, unknown, { tittel: string }>((payload) =>
		axios.post('/api/opprett/v2', payload).then((res) => res.data),
	);
	return (
		<>
			<BehandlingsKoForm />

			{/* <Button onClick={() => mutation.mutate({ tittel: 'kø' })}>Legg til ny kø</Button> */}
		</>
	);
};

export default BehandlingskoerIndex;
