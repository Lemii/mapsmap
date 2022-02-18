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

export enum ProblemFlag {
	ok = 0,
	hidden = 1,
}

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

export enum SolutionFlag {
	ok = 0,
	hidden = 1,
}

export type UserData = {
	username: string;
	role: number;
	problems: ProblemReference[];
	solutions: SolutionReference[];
	contacts: Buffer;
	country: string;
	flag: number;
};

export enum UserRole {
	user = 0,
	guardian = 1,
}

export enum UserFlag {
	ok = 0,
	hidden = 1,
}

export type AccountProps = {
	address: Buffer;
	mapsmap: UserData;
	token: { balance: BigInt };
};

export type ChainState = {
	problems: Problem[];
	solutions: Solution[];
};

export type ActionType =
	| 'getState'
	| 'getProblems'
	| 'getSolutions'
	| 'getProblemById'
	| 'getSolutionById'
	| 'getProblemsByOwner'
	| 'getSolutionsByOwner'
	| 'getSolutionsForProblem'
	| 'getOpenProblems'
	| 'getSolvedProblems'
	| 'getProblemWordCloud'
	| 'getSolutionWordCloud';

export type TagCloudData = {
	value: string;
	count: number;
}[];

export type Credentials = {
	mapAddress: string;
	binaryAddress: string;
	passphrase: string;
};

export type UserContextType = {
	userCredentials: Credentials | null;
	updateUserCredentials: (credentials: Credentials | null) => void;
	signOut: () => void;
};

export type Timeout = ReturnType<typeof setTimeout>;
