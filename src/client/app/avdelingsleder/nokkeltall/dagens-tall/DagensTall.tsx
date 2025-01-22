import React, { useState } from 'react';
import dayjs from 'dayjs';
import { Box, Detail, HGrid, HStack, Heading, Loader, Select, ToggleGroup } from '@navikt/ds-react';
import { useHentDagensTall } from 'api/queries/avdelingslederQueries';
import Teller from 'avdelingsleder/nokkeltall/components/dagensTallPanel/Teller';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';

export default function DagensTall() {
	const [valgtHovedgruppe, setValgtHovedgruppe] = useState('ALLE');
	const {
		data: { hovedgrupper, undergrupper, tall, oppdatertTidspunkt } = {},
		isFetching,
		isSuccess,
	} = useHentDagensTall();
	const [tidsområde, setTidsområde] = useState('I_DAG');
	return (
		<Box padding="4" borderWidth="1" borderColor="border-default">
			<Heading size="small">Dagens tall</Heading>
			<VerticalSpacer eightPx />
			{isFetching && <Loader />}
			{isSuccess && (
				<>
					<Detail>Oppdatert {dayjs(oppdatertTidspunkt).format('DD.MM.YYYY kl. HH:mm:ss')}</Detail>
					<HStack className="mt-4 mb-6" gap="4">
						<Select
							label="Valgt ytelse"
							hideLabel
							value={valgtHovedgruppe}
							onChange={(event) => setValgtHovedgruppe(event.currentTarget.value)}
						>
							{hovedgrupper?.map(({ kode, navn }) => (
								<option key={kode} value={kode}>
									{navn}
								</option>
							))}
						</Select>
						<ToggleGroup value={tidsområde} onChange={(nyttTidsområde) => setTidsområde(nyttTidsområde)}>
							<ToggleGroup.Item value="I_DAG" label="I dag" />
							<ToggleGroup.Item value="SISTE_7" label="Siste 7 dager" />
						</ToggleGroup>
					</HStack>
					<HGrid gap="2" columns={4}>
						{tall
							.filter(({ hovedgruppe }) => hovedgruppe === valgtHovedgruppe)
							.map((value) => {
								const venstreTall = tidsområde === 'I_DAG' ? value.nyeIDag : value.nyeSiste7Dager;
								const høyreTall = tidsområde === 'I_DAG' ? value.ferdigstilteIDag : value.ferdigstilteSiste7Dager;
								return (
									<Teller
										key={value.undergruppe}
										forklaring={undergrupper.find(({ kode }) => kode === value.undergruppe).navn}
										venstreTall={venstreTall}
										hoyreTall={høyreTall}
									/>
								);
							})}
					</HGrid>
				</>
			)}
		</Box>
	);
}
