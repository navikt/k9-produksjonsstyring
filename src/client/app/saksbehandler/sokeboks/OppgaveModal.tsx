import React from 'react';
import { BodyShort, Button, Modal } from '@navikt/ds-react';
import NavAnsatt from 'app/navAnsattTsType';
import { RestApiGlobalStatePathsKeys } from 'api/k9LosApi';
import {
	useEndreReservasjoner,
	useOpphevReservasjoner,
	useReserverOppgaveMutation,
} from 'api/queries/saksbehandlerQueries';
import { useGlobalStateRestApiData } from 'api/rest-api-hooks';
import { SøkeboksOppgaveDto } from 'saksbehandler/sokeboks/SøkeboksOppgaveDto';
import { modalInnhold } from 'saksbehandler/sokeboks/modal-innhold';

const åpneOppgave = (oppgave: SøkeboksOppgaveDto) => {
	window.location.href = oppgave.oppgavebehandlingsUrl;
};

export function OppgaveModal(props: { oppgave: SøkeboksOppgaveDto; open: boolean; closeModal: () => void }) {
	const innloggetSaksbehandler = useGlobalStateRestApiData<NavAnsatt>(RestApiGlobalStatePathsKeys.NAV_ANSATT);

	const { isLoading: isLoadingEndreReservasjoner, mutate: endreReservasjoner } = useEndreReservasjoner(() =>
		åpneOppgave(props.oppgave),
	);
	const { mutate: reserverOppgave, isLoading: isLoadingReserverOppgave } = useReserverOppgaveMutation(() =>
		åpneOppgave(props.oppgave),
	);
	const { mutate: opphevReservasjoner, isLoading: isLoadingOpphevReservasjon } = useOpphevReservasjoner(
		props.closeModal,
	);

	const { visÅpneOgReserverKnapp, visÅpneOgEndreReservasjonKnapp, visLeggTilbakeIKøKnapp, heading, modaltekst } =
		modalInnhold(props.oppgave, innloggetSaksbehandler);

	return (
		<Modal open={props.open} onClose={props.closeModal} closeOnBackdropClick header={{ heading }}>
			<Modal.Body>
				<BodyShort>{modaltekst}</BodyShort>
				<BodyShort>Hva ønsker du å gjøre med oppgaven?</BodyShort>
			</Modal.Body>
			<Modal.Footer>
				<Button type="button" onClick={() => åpneOppgave(props.oppgave)}>
					Åpne oppgave
				</Button>
				{visÅpneOgReserverKnapp && (
					<Button
						type="button"
						variant="secondary"
						loading={isLoadingReserverOppgave}
						onClick={() => reserverOppgave(props.oppgave.oppgaveNøkkel)}
					>
						Reserver og åpne oppgave
					</Button>
				)}
				{visÅpneOgEndreReservasjonKnapp && (
					<Button
						type="button"
						variant="secondary"
						loading={isLoadingEndreReservasjoner}
						onClick={() =>
							endreReservasjoner([
								{ oppgaveNøkkel: props.oppgave.oppgaveNøkkel, brukerIdent: innloggetSaksbehandler.brukerIdent },
							])
						}
					>
						Reserver og åpne oppgave
					</Button>
				)}
				{visLeggTilbakeIKøKnapp && (
					<Button
						type="button"
						variant="secondary"
						loading={isLoadingOpphevReservasjon}
						onClick={() => opphevReservasjoner([...props.oppgave.oppgaveNøkkel])}
					>
						Legg tilbake i kø
					</Button>
				)}
				<Button type="button" variant="tertiary" onClick={props.closeModal}>
					Avbryt
				</Button>
			</Modal.Footer>
		</Modal>
	);
}
