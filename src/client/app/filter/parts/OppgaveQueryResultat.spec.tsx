/* eslint-disable @typescript-eslint/no-use-before-define */
import React from 'react';
import { render, screen } from '@testing-library/react';
import OppgaveQueryResultat from './OppgaveQueryResultat';
import { felter } from './testdata';

describe('OppgaveQueryResultat', () => {
	it('should render table headers with correct visningsnavn', () => {
		render(<OppgaveQueryResultat felter={felter} oppgaveQuery={oppgaveQuery} oppgaver={oppgaver} />);
		expect(screen.getByText('Akkumulert ventetid saksbehandler for tidligere versjoner')).toBeInTheDocument();
	});

	it('should render table rows with correct values', () => {
		render(<OppgaveQueryResultat felter={felter} oppgaveQuery={oppgaveQuery} oppgaver={oppgaver} />);
		expect(screen.getByText('113d 17t')).toBeInTheDocument();
		expect(screen.getByText('280d 6t')).toBeInTheDocument();
		expect(screen.getByText('128d 1t')).toBeInTheDocument();
		expect(screen.getByText('293d 1t')).toBeInTheDocument();
		expect(screen.getByText('154d 22t')).toBeInTheDocument();
		expect(screen.getByText('117d 3t')).toBeInTheDocument();
		expect(screen.getByText('276d 23t')).toBeInTheDocument();
		expect(screen.getByText('167d 2t')).toBeInTheDocument();
		expect(screen.getByText('424d 22t')).toBeInTheDocument();
		expect(screen.getByText('175d 4t')).toBeInTheDocument();
	});
});

const oppgaveQuery = {
	filtere: [
		{
			id: '9c826b1e-35f3-416f-a4b2-7c0862e90c9b',
			type: 'feltverdi',
			område: 'K9',
			kode: 'akkumulertVentetidSaksbehandlerForTidligereVersjoner',
			operator: 'GREATER_THAN',
			verdi: 'P100DT',
		},
	],
	select: [
		{
			id: '77530d5d-0ec6-4a1e-aa5d-ea27a5a30655',
			type: 'enkel',
			område: 'K9',
			kode: 'akkumulertVentetidSaksbehandlerForTidligereVersjoner',
		},
	],
	order: [],
	limit: 10,
	id: 'ba50126a-5e5e-4c24-86ea-0255af308837',
};

const oppgaver = [
	{
		felter: [
			{
				område: 'K9',
				kode: 'akkumulertVentetidSaksbehandlerForTidligereVersjoner',
				verdi: 'PT2729H38M17.206648844S',
			},
		],
	},
	{
		felter: [
			{
				område: 'K9',
				kode: 'akkumulertVentetidSaksbehandlerForTidligereVersjoner',
				verdi: 'PT6726H14M36.343829446S',
			},
		],
	},
	{
		felter: [
			{
				område: 'K9',
				kode: 'akkumulertVentetidSaksbehandlerForTidligereVersjoner',
				verdi: 'PT3073H46M51.467301321S',
			},
		],
	},
	{
		felter: [
			{
				område: 'K9',
				kode: 'akkumulertVentetidSaksbehandlerForTidligereVersjoner',
				verdi: 'PT7033H2M49.007959404S',
			},
		],
	},
	{
		felter: [
			{
				område: 'K9',
				kode: 'akkumulertVentetidSaksbehandlerForTidligereVersjoner',
				verdi: 'PT3718H26M1.401001181S',
			},
		],
	},
	{
		felter: [
			{
				område: 'K9',
				kode: 'akkumulertVentetidSaksbehandlerForTidligereVersjoner',
				verdi: 'PT2811H7M30.840869325S',
			},
		],
	},
	{
		felter: [
			{
				område: 'K9',
				kode: 'akkumulertVentetidSaksbehandlerForTidligereVersjoner',
				verdi: 'PT6647H44M16.82464825S',
			},
		],
	},
	{
		felter: [
			{
				område: 'K9',
				kode: 'akkumulertVentetidSaksbehandlerForTidligereVersjoner',
				verdi: 'PT4010H47M50.980515912S',
			},
		],
	},
	{
		felter: [
			{
				område: 'K9',
				kode: 'akkumulertVentetidSaksbehandlerForTidligereVersjoner',
				verdi: 'PT10198H6M33.2663571S',
			},
		],
	},
	{
		felter: [
			{
				område: 'K9',
				kode: 'akkumulertVentetidSaksbehandlerForTidligereVersjoner',
				verdi: 'PT4204H18M24.56699856S',
			},
		],
	},
];
