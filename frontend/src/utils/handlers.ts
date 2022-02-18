import notify from './notify';

export const errorHandler = (error: unknown, callback?: (msg: string) => void) => {
	const err = error as Error;

	console.error(err.message);

	notify('error', 'Error', err.message);

	if (callback) {
		callback(err.message);
	}
};

export const successHandler = (message = 'Success', description?: string) => {
	notify('success', message, description);
};

export const infoHandler = (message = 'Info', description?: string) => {
	notify('info', message, description);
};

export const warningHandler = (message = 'Warning', description?: string) => {
	notify('warning', message, description);
};
