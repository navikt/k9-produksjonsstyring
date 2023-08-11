import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchWithDropdown, { SearchWithDropdownProps } from './SearchWithDropdown';

const suggestions = [
	{ label: 'Label 1', value: 'Value 1', group: 'Group 1' },
	{ label: 'Label 2', value: 'Value 2', group: 'Group 1' },
	{ label: 'Label 3', value: 'Value 3', group: 'Group 2' },
	{ label: 'Label 4', value: 'Value 4', group: 'Group 2' },
];

const defaultProps: SearchWithDropdownProps = {
	label: 'Search label',
	suggestions,
	heading: 'Suggestion heading',
	addButtonText: 'Add suggestion',
	updateSelection: jest.fn(),
	selectedValues: [],
};

describe('SearchWithDropdown', () => {
	beforeEach(() => {
		render(<SearchWithDropdown {...defaultProps} />);
	});

	it('renders the correct label', () => {
		expect(screen.getByLabelText('Search label')).toBeInTheDocument();
	});

	it('filters suggestions correctly', () => {
		userEvent.type(screen.getByLabelText('Search label'), 'Value 1');
		expect(screen.getAllByRole('combobox')).toHaveLength(1);
	});

	it('renders selected suggestions correctly', () => {
		render(<SearchWithDropdown {...defaultProps} selectedValues={['Value 1']} />);
		expect(screen.getByText('Label 1')).toBeInTheDocument();
	});
});
