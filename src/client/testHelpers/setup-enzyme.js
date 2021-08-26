import { configure as configureEnzyme } from 'enzyme';
// import Adapter from 'enzyme-adapter-react-16';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import 'regenerator-runtime/runtime.js';

configureEnzyme({ adapter: new Adapter() });
