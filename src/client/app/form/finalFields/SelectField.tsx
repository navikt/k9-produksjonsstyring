import React, { FunctionComponent, ReactNode } from 'react';
import { Field } from 'react-final-form';
import classnames from 'classnames/bind';
import { FieldValidator } from 'final-form';
import CustomNavSelect from './CustomNavSelect';
import { LabelType } from './Label';
import ReadOnlyField from './ReadOnlyField';
import renderNavField from './renderNavField';
import styles from './selectField.css';

const classNames = classnames.bind(styles);

// eslint-disable-next-line react/prop-types
const renderReadOnly =
	() =>
	({ input, selectValues, ...otherProps }) => {
		const option = selectValues.map((sv) => sv.props).find((o) => o.value === input.value);
		const value = option ? option.children : undefined;
		return <ReadOnlyField input={{ value }} {...otherProps} />;
	};

const renderNavSelect = renderNavField(CustomNavSelect);

interface OwnProps {
	name: string;
	selectValues: ReactNode[];
	label: LabelType;
	validate?: FieldValidator<any>;
	readOnly?: boolean;
	placeholder?: string;
	hideValueOnDisable?: boolean;
	bredde?: string;
	disabled?: boolean;
}

const SelectField: FunctionComponent<OwnProps> = ({ name, label, selectValues, validate, readOnly, ...otherProps }) => (
	<Field
		name={name}
		validate={validate}
		// @ts-ignore
		component={readOnly ? renderReadOnly() : renderNavSelect}
		label={label}
		selectValues={selectValues}
		disabled={!!readOnly}
		{...otherProps}
		readOnly={readOnly}
		readOnlyHideEmpty
		className={classNames('navSelect', { navSelectReadOnly: readOnly })}
	/>
);

SelectField.defaultProps = {
	readOnly: false,
	placeholder: ' ',
	hideValueOnDisable: false,
};

export default SelectField;
