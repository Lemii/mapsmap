export type Timestamp = {
	unix: number;
	human: string;
};

export type Meta = {
	createdAt: Timestamp;
	lastModified: Timestamp;
};

export type OwnerReference = {
	id: string;
	username: string;
};

export type ProblemReference = {
	id: string;
	title: string;
};

export type SolutionReference = {
	id: string;
	problem: ProblemReference;
};

export type Problem = {
	meta: Meta;
	data: {
		id: string;
		status: 'solved' | 'open';
		title: string;
		description: string;
		solutionConditions: string;
		tags: string[];
		category: number;
		owner: OwnerReference;
		chestFund: number;
		solvedBy: string;
		flag: number;
	};
};

export type Solution = {
	meta: Meta;
	data: {
		id: string;
		problem: ProblemReference;
		description: string;
		owner: OwnerReference;
		flag: number;
		tags: string[];
	};
};

export type UserData = {
	username: string;
	role: number;
	problems: ProblemReference[];
	solutions: SolutionReference[];
	contacts: Buffer;
	country: string;
	flag: number;
};

export type AccountProps = {
	address: Buffer;
	mapsmap: UserData;
};

export type ChainState = {
	problems: Problem[];
	solutions: Solution[];
};

export type TagCloudData = {
	value: string;
	count: number;
}[];
