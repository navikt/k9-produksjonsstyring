import { Button } from '@navikt/ds-react';
import axios from 'axios';
import { OppgaveQuery } from 'filter/filterTsTypes';
import React from 'react';
import { useMutation } from 'react-query';
import BehandlingsKoForm from './BehandlingsKoForm';

interface Kødefinisjon {
  id: number;
  tittel: string;
  oppgaveQuery: OppgaveQuery;
  saksbehandlere: string[];
  versjon: number;
}

const BehandlingskoerIndex = () => {
  const mutation = useMutation<Kødefinisjon, unknown, { tittel: string }>(payload =>
    axios.post('/api/opprett/v2', payload).then(res => res.data),
  );
  return (
    <>
      <BehandlingsKoForm />

      {/* <Button onClick={() => mutation.mutate({ tittel: 'kø' })}>Legg til ny kø</Button> */}
    </>
  );
};

export default BehandlingskoerIndex;
