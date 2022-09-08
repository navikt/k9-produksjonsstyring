import React from 'react';
import { BrowserRouter } from 'react-router-dom';

const withRouterProvider = story => <BrowserRouter>{story()}</BrowserRouter>;

export default withRouterProvider;
