import React, { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@navikt/aksel-icons';
import { Button, Chips } from '@navikt/ds-react';

type groupObject = {
	label: string;
	value: string;
	group?: string;
};

interface Props {
	values: groupObject[];
	remove: (value: string) => void;
}

const Group = ({ group, chips, remove }: { group: string; chips: Props['values']; remove: Props['remove'] }) => {
	const [open, setOpen] = useState(false);

	return (
		<div className={open ? `bg-[#F2F9FF] rounded-md p-1 py-0 pl-0` : ''}>
			<Button
				style={{ padding: '4px' }}
				size="small"
				type="button"
				icon={!open ? <ChevronDownIcon /> : <ChevronUpIcon />}
				variant="tertiary"
				onClick={() => setOpen(!open)}
			>
				{`${group} (${chips.length})`}
			</Button>
			{open && (
				<div className="p-2">
					<Chips size="small">
						{chips.map((v) => (
							<Chips.Removable key={v.value} onClick={() => remove(v.value)}>
								{v.label}
							</Chips.Removable>
						))}
					</Chips>
				</div>
			)}
		</div>
	);
};

export const SelectedValues = ({ values, remove }: Props) => {
	const getUniqueGroups = () => {
		const groups = values.map((group) => group.group);
		return [...new Set(groups)];
	};
	const groups = getUniqueGroups();
	return (
		<div className="flex flex-wrap gap-2">
			{groups.map((group) => (
				<Group key={group} group={group} chips={values.filter((v) => v.group === group)} remove={remove} />
			))}
		</div>
	);
};
