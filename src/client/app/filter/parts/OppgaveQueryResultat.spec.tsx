import React from 'react';
import { render, screen } from '@testing-library/react';
import OppgaveQueryResultat from './OppgaveQueryResultat';
import { felter, oppgaveQueryForDate, oppgaveQueryForDuration, oppgaverMedDate, oppgaverMedDuration } from './testdata';

describe('OppgaveQueryResultat', () => {
	it('should render table headers with correct visningsnavn', () => {
		render(
			<OppgaveQueryResultat felter={felter} oppgaveQuery={oppgaveQueryForDuration} oppgaver={oppgaverMedDuration} />,
		);
		expect(screen.getByText('Akkumulert ventetid saksbehandler for tidligere versjoner')).toBeInTheDocument();
	});

	it('should render duration correctly', () => {
		render(
			<OppgaveQueryResultat felter={felter} oppgaveQuery={oppgaveQueryForDuration} oppgaver={oppgaverMedDuration} />,
		);
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

	it('should render date correctly', () => {
		render(<OppgaveQueryResultat felter={felter} oppgaveQuery={oppgaveQueryForDate} oppgaver={oppgaverMedDate} />);
		const expectedDates = [
			'21.12.2022',
			'14.09.2021',
			'20.12.2021',
			'26.08.2020',
			'25.12.2022',
			'21.06.2021',
			'24.12.2022',
			'20.01.2021',
			'10.03.2023',
			'24.02.2021',
		];
		expectedDates.forEach((date) => {
			expect(screen.getAllByText(date)).toHaveLength(1);
		});
	});
});
