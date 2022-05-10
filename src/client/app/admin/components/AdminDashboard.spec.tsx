import React from 'react';
import { screen, render } from '@testing-library/react';
import AvdelingslederDashboard from './AdminDashboard';

test('skal vise dashboard', () =>{
  render(<AvdelingslederDashboard><div>test</div></AvdelingslederDashboard>);

  expect(screen.getByText('test')).toBeInTheDocument();
});
