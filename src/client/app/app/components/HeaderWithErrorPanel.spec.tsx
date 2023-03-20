import React from 'react';
import { act, screen, waitFor } from '@testing-library/react';
import { renderWithAllProviders } from '../../../../../setup/testHelpers/testUtils';
import { server } from '../../../mocks/server';
import HeaderWithErrorPanel from './HeaderWithErrorPanel';

const setSiteHeight = (headerHeight: number): void => null;
const crashMessage = 'CrashMessage';

describe('<HeaderWithErrorPanel>', () => {
	beforeAll(() => server.listen());
	afterEach(() => server.resetHandlers());
	afterAll(() => server.close());
	// spyr ut errors om manglende tekster fordi setup-test-env.js mocker ut react-intl
	it('skal vise lenker for rettskilde og systemrutine i header men ingen avdelinger når det ikke er noen', async () => {
		act(() => {
			renderWithAllProviders(
				<HeaderWithErrorPanel queryStrings={{}} crashMessage={crashMessage} setSiteHeight={setSiteHeight} />,
			);
		});
		await waitFor(() => {
			expect(screen.getByText(crashMessage)).toBeVisible();
		});
	});
});
