import { configure as configureEnzyme } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import configure from '@commercetools/enzyme-extensions';
import ShallowWrapper from 'enzyme/ShallowWrapper';

configureEnzyme({ adapter: new Adapter() });

configure(ShallowWrapper);
