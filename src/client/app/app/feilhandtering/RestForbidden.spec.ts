import { expect } from 'chai';
import RestForbiddenFormatter from 'app/feilhandtering/RestForbidden';
import ErrorMessage from './ErrorMessage';
import ErrorEventType from './errorEventType';

describe('RestTimeoutFormatter', () => {
	it('skal håndtere feil når feildata er av korrekt type', () => {
		 
		expect(new RestForbiddenFormatter().isOfType(ErrorEventType.REQUEST_FORBIDDEN)).is.true;
	});

	it('skal ikke håndtere feil når feildata er av annen type', () => {
		 
		expect(new RestForbiddenFormatter().isOfType(ErrorEventType.POLLING_HALTED_OR_DELAYED)).is.false;
	});

	it('skal formatere feil når en har fått timeout', () => {
		const errorData = {
			type: ErrorEventType.REQUEST_FORBIDDEN,
			message: 'timeout',
			location: 'url',
		};
		expect(new RestForbiddenFormatter().format(errorData)).to.eql(
			ErrorMessage.withMessageCode('Rest.ErrorMessage.Forbidden', errorData),
		);
	});
});
