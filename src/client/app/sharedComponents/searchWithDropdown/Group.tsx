import React from 'react';
import { Chips } from '@navikt/ds-react';

type groupObject = {
	label: string;
	value: string;
	group?: string;
};

interface Props {
	chips: groupObject[];
}
export const GroupedChips = ({ chips }: Props) => {
	const getUniqueGroups = () => {
		const groups = chips.map((group) => group.group);
		return [...new Set(groups)];
	};
	const groups = getUniqueGroups();
	return groups.map((group) => (
		<div key={group}>
			<h2>{group}</h2>
			<Chips>
				{chips.map((v) => {
					if (v.group === group) {
						return <Chips.Removable key={v.value}>{v.label}</Chips.Removable>;
					}
					return null;
				})}
			</Chips>
		</div>
	));
};
