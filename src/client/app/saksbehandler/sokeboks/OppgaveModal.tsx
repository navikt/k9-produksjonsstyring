import React from 'react';
import { BodyShort, Button, Modal } from '@navikt/ds-react';
import {
	useEndreReservasjoner,
	useInnloggetSaksbehandler,
	useOpphevReservasjoner,
	useReserverOppgaveMutation,
} from 'api/queries/saksbehandlerQueries';
import { SøkeboksOppgaveDto } from 'saksbehandler/sokeboks/SøkeboksOppgaveDto';
import { modalInnhold } from 'saksbehandler/sokeboks/modal-innhold';

const åpneOppgave = (oppgave: SøkeboksOppgaveDto) => {
	window.location.href = oppgave.oppgavebehandlingsUrl;
};

export function OppgaveModal(props: { oppgave: SøkeboksOppgaveDto; open: boolean; closeModal: () => void }) {
	const { isFetched: isFetchedSaksbehandler, data: innloggetSaksbehandler } = useInnloggetSaksbehandler();
	const { isLoading: isLoadingEndreReservasjoner, mutate: endreReservasjoner } = useEndreReservasjoner(() =>
		åpneOppgave(props.oppgave),
	);
	const { mutate: reserverOppgave, isLoading: isLoadingReserverOppgave } = useReserverOppgaveMutation(() =>
		åpneOppgave(props.oppgave),
	);
	const { mutate: opphevReservasjoner, isLoading: isLoadingOpphevReservasjon } = useOpphevReservasjoner(
		props.closeModal,
	);

	if (!isFetchedSaksbehandler) {
		return null;
	}

	const { visÅpneOgReserverKnapp, visÅpneOgEndreReservasjonKnapp, visLeggTilbakeIKøKnapp, heading, modaltekst } =
		modalInnhold(props.oppgave, innloggetSaksbehandler);

	return (
		<Modal open={props.open} onClose={props.closeModal} closeOnBackdropClick header={{ heading }}>
			<Modal.Body>
				<BodyShort>{modaltekst}</BodyShort>
				<BodyShort>Hva ønsker du å gjøre med oppgaven?</BodyShort>
			</Modal.Body>
			<Modal.Footer>
				{visÅpneOgReserverKnapp && (
					<Button
						type="button"
						variant="primary"
						loading={isLoadingReserverOppgave}
						onClick={() => reserverOppgave(props.oppgave.oppgaveNøkkel)}
					>
						Reserver og åpne oppgave
					</Button>
				)}
				{visÅpneOgEndreReservasjonKnapp && (
					<Button
						type="button"
						variant="primary"
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
				<Button
					type="button"
					variant={visÅpneOgReserverKnapp || visÅpneOgEndreReservasjonKnapp ? 'secondary' : 'primary'}
					onClick={() => åpneOppgave(props.oppgave)}
				>
					Åpne oppgave
				</Button>

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
