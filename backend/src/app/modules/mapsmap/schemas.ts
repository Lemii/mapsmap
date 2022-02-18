import { Schema } from 'lisk-sdk';

import { Problem, Solution } from '../../../types';

export const CHAIN_STATE = 'mapsmap:state';

export const CHAIN_INIT = {
	problems: [] as Problem[],
	solutions: [] as Solution[],
};

const timestampSchema = {
	type: 'object',
	required: ['unix', 'human'],
	properties: {
		unix: {
			fieldNumber: 1,
			dataType: 'uint32',
		},
		human: {
			fieldNumber: 2,
			dataType: 'string',
		},
	},
};

const metaSchema = {
	type: 'object',
	required: ['createdAt', 'lastModified'],
	properties: {
		createdAt: {
			fieldNumber: 1,
			...timestampSchema,
		},
		lastModified: {
			fieldNumber: 2,
			...timestampSchema,
		},
	},
};

export const ownerReferenceSchema = {
	type: 'object',
	required: ['id', 'username'],
	properties: {
		id: {
			fieldNumber: 1,
			dataType: 'string',
		},
		username: {
			fieldNumber: 2,
			dataType: 'string',
		},
	},
};

export const problemReferenceSchema = {
	type: 'object',
	required: ['id', 'title'],
	properties: {
		id: {
			fieldNumber: 1,
			dataType: 'string',
		},
		title: {
			fieldNumber: 2,
			dataType: 'string',
		},
	},
};

export const solutionReferenceSchema = {
	type: 'object',
	required: ['id', 'problem'],
	properties: {
		id: {
			fieldNumber: 1,
			dataType: 'string',
		},
		problem: {
			fieldNumber: 2,
			...problemReferenceSchema,
		},
	},
};

const problemSchema: Schema = {
	$id: '/mapsmap/problem',
	type: 'object',
	required: ['meta', 'data'],
	properties: {
		meta: {
			fieldNumber: 1,
			...metaSchema,
		},
		data: {
			fieldNumber: 2,
			type: 'object',
			required: [
				'id',
				'status',
				'title',
				'description',
				'solutionConditions',
				'tags',
				'category',
				'owner',
				'chestFund',
				'flag',
			],
			properties: {
				id: {
					dataType: 'string',
					fieldNumber: 1,
				},
				status: {
					dataType: 'string',
					fieldNumber: 2,
				},
				title: {
					dataType: 'string',
					fieldNumber: 3,
				},
				description: {
					dataType: 'string',
					fieldNumber: 4,
				},
				solutionConditions: {
					dataType: 'string',
					fieldNumber: 5,
				},
				tags: {
					type: 'array',
					fieldNumber: 6,
					items: {
						dataType: 'string',
					},
				},
				category: {
					dataType: 'uint32',
					fieldNumber: 7,
				},
				owner: {
					fieldNumber: 8,
					...ownerReferenceSchema,
				},
				chestFund: {
					dataType: 'uint32',
					fieldNumber: 9,
				},
				solvedBy: {
					dataType: 'string',
					fieldNumber: 10,
				},
				flag: {
					dataType: 'uint32',
					fieldNumber: 11,
				},
			},
		},
	},
};

const solutionSchema: Schema = {
	$id: '/mapsmap/solution',
	type: 'object',
	required: ['meta', 'data'],
	properties: {
		meta: {
			fieldNumber: 1,
			...metaSchema,
		},
		data: {
			fieldNumber: 2,
			type: 'object',
			required: ['id', 'problem', 'description', 'owner', 'flag', 'tags'],
			properties: {
				id: {
					dataType: 'string',
					fieldNumber: 1,
				},
				problem: {
					fieldNumber: 2,
					...problemReferenceSchema,
				},
				description: {
					dataType: 'string',
					fieldNumber: 3,
				},
				owner: {
					fieldNumber: 4,
					...ownerReferenceSchema,
				},
				flag: {
					dataType: 'uint32',
					fieldNumber: 5,
				},
				tags: {
					type: 'array',
					fieldNumber: 6,
					items: {
						dataType: 'string',
					},
				},
			},
		},
	},
};

export const chainStateSchema: Schema = {
	$id: '/mapsmap/chain-state',
	type: 'object',
	required: ['problems', 'solutions'],
	properties: {
		problems: {
			fieldNumber: 1,
			type: 'array',
			items: problemSchema,
		},
		solutions: {
			fieldNumber: 2,
			type: 'array',
			items: solutionSchema,
		},
	},
};

export const accountSchema = {
	$id: '/mapsmap/account',
	type: 'object',
	required: ['username', 'role', 'problems', 'solutions', 'contacts', 'country', 'flag'],
	properties: {
		username: {
			dataType: 'string',
			fieldNumber: 1,
		},
		role: {
			dataType: 'uint32',
			fieldNumber: 2,
		},
		problems: {
			type: 'array',
			items: problemReferenceSchema,
			fieldNumber: 3,
		},
		solutions: {
			type: 'array',
			items: solutionReferenceSchema,
			fieldNumber: 4,
		},
		contacts: {
			dataType: 'bytes',
			fieldNumber: 5,
		},
		country: {
			dataType: 'string',
			fieldNumber: 6,
		},
		flag: {
			dataType: 'uint32',
			fieldNumber: 7,
		},
	},
	default: {
		username: '',
		role: 0,
		problems: [],
		solutions: [],
		contacts: Buffer.from('{}'),
		country: '',
		flag: 0,
	},
};
