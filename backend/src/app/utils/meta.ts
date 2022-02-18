import moment from 'moment';

import { Meta } from '../../types';

export const createMeta = (): Meta => {
	const date = moment();

	return {
		createdAt: {
			unix: date.unix(),
			human: date.format(),
		},
		lastModified: {
			unix: date.unix(),
			human: date.format(),
		},
	};
};

export const updateMeta = (metaObject: Meta): Meta => {
	const date = moment();

	return {
		...metaObject,
		lastModified: {
			unix: date.unix(),
			human: date.format(),
		},
	};
};
