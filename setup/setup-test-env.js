import { configure as configureEnzyme } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import configure from '@commercetools/enzyme-extensions';
import ShallowWrapper from 'enzyme/ShallowWrapper';
import '@testing-library/jest-dom';

configureEnzyme({ adapter: new Adapter() });

configure(ShallowWrapper);

jest.mock('react-intl', () => {
  const reactIntl = jest.requireActual('react-intl');
  const intl = reactIntl.createIntl({
    locale: 'en',
  });

  return {
    ...reactIntl,
    useIntl: () => intl,
  };
});
