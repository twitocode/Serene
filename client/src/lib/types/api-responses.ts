export type Result<T> = {
	isSuccess: boolean;
	errors: Error[];
	value?: T;
	status: number;
};

export type ApiAppError = Result<null> & {
	type: string;
	title: string;
	status: number;
	detail: string;
	instance: string;
	errors: Error[];
	traceId: string;
};

export type ValidationError<T1 extends string > = Omit<ApiAppError, "errors"> & {
	errors: Record<T1 , string[]>;
};

export type Error = {
	code: string;
	message: string;
};
