import React, { FunctionComponent } from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router';
import { BodyShort } from '@navikt/ds-react';

const MissingPage: FunctionComponent = () => (
	<div className="bg-gray-100 flex m-auto justify-center">
		<div className="bg-white rounded-md p-8">
			<BodyShort>
				<FormattedMessage id="MissingPage.PageIsMissing" />
			</BodyShort>
			<div className="flex">
				<BodyShort className="m-auto mt-4">
					<Link to="/">
						<FormattedMessage id="MissingPage.Home" />
					</Link>
				</BodyShort>
			</div>
		</div>
	</div>
);

export default MissingPage;
