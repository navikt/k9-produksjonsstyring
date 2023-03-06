import { Textarea, TextField } from '@navikt/ds-react';
import React from 'react';

const BehandlingsKoForm = () => (
    <div>
      <div className="text-3xl underline">heu</div>
      <TextField label="Navn" />
      <Textarea
        label="Beskrivelse"
        description="Her kan du legge inn en valgfri beskrivelse av hva denne køen inneholder."
      />
    </div>
  );

export default BehandlingsKoForm;
