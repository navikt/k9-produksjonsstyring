import ErrorEventType from './errorEventType';
import ErrorMessage from './ErrorMessage';
import Formatter from './Formatter';

const REST_FORBIDDEN_MESSAGE_CODE = 'Rest.ErrorMessage.Forbidden';

interface ErrorData {
  type: string;
  message: string;
  location: string;
}

class RestForbiddenFormatter implements Formatter<ErrorData> {
  type = ErrorEventType.REQUEST_FORBIDDEN;

  isOfType = (type: string) => type === this.type;

  format = (errorData: ErrorData) => ErrorMessage.withMessageCode(REST_FORBIDDEN_MESSAGE_CODE, errorData);
}

export default RestForbiddenFormatter;
