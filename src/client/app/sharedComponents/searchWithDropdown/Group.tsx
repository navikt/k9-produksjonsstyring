import React, { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@navikt/aksel-icons';
import { Button, Chips } from '@navikt/ds-react';

type groupObject = {
	label: string;
	value: string;
	group?: string;
};

interface Props {
	chips: groupObject[];
}

const Group = ({ group, chips }) => {
	const [open, setOpen] = useState(false);

	return (
		<div className={`bg-bg-subtle rounded-md ${open ? 'p-1 py-0 pl-0' : ''}`}>
			<Button
				style={{ padding: '4px' }}
				size="small"
				icon={!open ? <ChevronDownIcon /> : <ChevronUpIcon />}
				variant="tertiary"
				onClick={() => setOpen(!open)}
			>
				{`${group} (${chips.length})`}
			</Button>
			{open && (
				<div className="p-2">
					<Chips size="small">
						{chips
							.filter((v) => v.group === group)
							.map((v) => (
								<Chips.Removable key={v.value}>{v.label}</Chips.Removable>
							))}
					</Chips>
				</div>
			)}
		</div>
	);
};

export const GroupedChips = ({ chips }: Props) => {
	const getUniqueGroups = () => {
		const groups = chips.map((group) => group.group);
		return [...new Set(groups)];
	};
	const groups = getUniqueGroups();
	return (
		<div className="flex flex-wrap gap-2">
			{groups.map((group) => (
				<Group key={group} group={group} chips={chips.filter((v) => v.group === group)} />
			))}
		</div>
	);
};
