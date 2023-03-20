import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import AvdelingslederDashboard from './AdminDashboard';

describe('<AvdelingslederDashboard>', () => {
	it('skal vise dashboard', () => {
		const wrapper = shallow(
			<AvdelingslederDashboard>
				<div>test</div>
			</AvdelingslederDashboard>,
		);

		expect(wrapper.childAt(0).text()).to.eql('test');
	});
});
