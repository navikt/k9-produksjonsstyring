// TODO (TOR) default export feilar for yarn:coverage
 
export type Error = Readonly<{
	response?: {
		data: {
			type?: string;
		};
		status?: string;
	};
	type?: string;
}>;
