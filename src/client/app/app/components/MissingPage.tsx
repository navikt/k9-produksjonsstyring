import React, { FunctionComponent, useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import { BodyShort } from '@navikt/ds-react';
import * as Sentry from '@sentry/react';

const MissingPage: FunctionComponent = () => {
	useEffect(() => {
		const referrerUrl = document.referrer;
		Sentry.captureEvent({
			message: `404 - User came from ${referrerUrl}`,
			level: 'warning',
			tags: { page: window.location.href },
		});
	}, []);

	return (
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
};

export default MissingPage;
