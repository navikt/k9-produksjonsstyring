import type { Meta, StoryObj } from '@storybook/react';
import { GroupedChips } from './Group';

const meta = {
	component: GroupedChips,
	title: 'sharedComponents/searchWithDropdown/Group',
	args: {
		chips: [
			{ label: 'label1', value: 'value1', group: 'group1' },
			{ label: 'label2', value: 'value2', group: 'group1' },
			{ label: 'label3', value: 'value3', group: 'group2' },
			{ label: 'label4', value: 'value4', group: 'group2' },
		],
	},
} satisfies Meta<typeof GroupedChips>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
