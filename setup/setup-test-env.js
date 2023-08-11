import configure from '@commercetools/enzyme-extensions';
import '@testing-library/jest-dom';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import dayjs from 'dayjs';
import durationPlugin from 'dayjs/plugin/duration';
import { configure as configureEnzyme } from 'enzyme';
import ShallowWrapper from 'enzyme/ShallowWrapper';

configureEnzyme({ adapter: new Adapter() });
dayjs.extend(durationPlugin);

configure(ShallowWrapper);

jest.mock('react-intl', () => {
	const reactIntl = jest.requireActual('react-intl');
	const intl = reactIntl.createIntl({
		locale: 'nb-NO',
	});

	return {
		...reactIntl,
		useIntl: () => intl,
	};
});
