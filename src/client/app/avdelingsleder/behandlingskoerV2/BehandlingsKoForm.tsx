import { Textarea, TextField } from '@navikt/ds-react';
import { K9LosApiKeys } from 'api/k9LosApi';
import { useRestApiRunner } from 'api/rest-api-hooks';
import React, { useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { Saksbehandler } from 'saksbehandler/behandlingskoer/saksbehandlerTsType';
import SearchWithDropdown from 'sharedComponents/SearchWithDropdown';

const BehandlingsKoForm = () => {
  const { startRequest: hentAlleSaksbehandlere, data: alleSaksbehandlere = [] } = useRestApiRunner<Saksbehandler[]>(
    K9LosApiKeys.SAKSBEHANDLERE,
  );
  useEffect(() => {
    hentAlleSaksbehandlere();
  }, []);

  const manglerGruppering = 'Mangler gruppering';
  const formaterteSaksbehandlere = alleSaksbehandlere.map(saksbehandler => ({
    value: saksbehandler.epost,
    label: saksbehandler.navn || saksbehandler.epost,
    group: saksbehandler.enhet || manglerGruppering,
  }));

  const grupper = [...new Set(formaterteSaksbehandlere.map(oppgavekode => oppgavekode.group))].sort();

  const valgteSaksbehandlere = [];
  const KØ_ID_LOL = 'ENDRE_MEG';

  const handleSaksbehandlerChange = (nyeValgteSaksbehandlereposter: string[] = []) => {
    const nyeValgteSaksbehandlere = nyeValgteSaksbehandlereposter
      .filter(saksbehandlerEpost => !valgteSaksbehandlere.includes(saksbehandlerEpost))
      .map(saksbehandlerEpost => ({
        id: KØ_ID_LOL,
        epost: saksbehandlerEpost,
        checked: true,
      }));
    const saksbehandlererSomSkalFjernes = valgteSaksbehandlere
      .filter(valgtSaksbehandler => !nyeValgteSaksbehandlereposter.includes(valgtSaksbehandler))
      .map(valgtSaksbehandler => ({
        id: KØ_ID_LOL,
        epost: valgtSaksbehandler,
        checked: false,
      }));
    const data = nyeValgteSaksbehandlere.concat(saksbehandlererSomSkalFjernes);

    console.error('fiks meg');
    // knyttSaksbehandlerTilOppgaveko(data).then(() => {
    // hentOppgaveko(valgtOppgaveko.i});
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <TextField label="Navn" />
        <Textarea
          label="Beskrivelse"
          description="Her kan du legge inn en valgfri beskrivelse av hva denne køen inneholder."
          className="my-8"
        />
      </div>
      <div>
        {alleSaksbehandlere.length === 0 && (
          <FormattedMessage id="SaksbehandlereForOppgavekoForm.IngenSaksbehandlere" />
        )}
        {alleSaksbehandlere.length > 0 && (
          <SearchWithDropdown
            label="Velg saksbehandlere"
            suggestions={formaterteSaksbehandlere}
            groups={grupper}
            addButtonText="Legg til saksbehandlere"
            heading="Velg saksbehandlere"
            updateSelection={handleSaksbehandlerChange}
            selectedValues={valgteSaksbehandlere}
          />
        )}
      </div>
    </div>
  );
};

export default BehandlingsKoForm;
