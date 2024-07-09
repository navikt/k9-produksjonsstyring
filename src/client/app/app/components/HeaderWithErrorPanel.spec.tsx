import React from 'react';
import { act, screen, waitFor } from '@testing-library/react';
import { renderWithAllProviders } from '../../../../../setup/testHelpers/testUtils';
import { unitTestHandlers } from '../../../mocks/unitTestHandlers';
import HeaderWithErrorPanel from './HeaderWithErrorPanel';
import { setupServer } from 'msw/lib/node';

const setSiteHeight = (): void => null;
const crashMessage = 'CrashMessage';

const server = setupServer(...unitTestHandlers);
describe('<HeaderWithErrorPanel>', () => {
	beforeAll(() => server.listen());
	afterEach(() => server.resetHandlers());
	afterAll(() => server.close());
	// spyr ut errors om manglende tekster fordi setup-test-env.js mocker ut react-intl
	it('skal vise lenker for rettskilde i header men ingen avdelinger når det ikke er noen', async () => {
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
