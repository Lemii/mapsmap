export type AddProblemProps = {
	title: string;
	description: string;
	solutionConditions: string;
	tags: string[];
	category: number;
	chestFund: number;
};

export type EditProblemProps = {
	id: string;
	title: string;
	description: string;
	solutionConditions: string;
	tags: string[];
	category: number;
	chestFund: number;
};

export type DeleteProblemProps = {
	id: string;
};

export type AddSolutionProps = {
	problemId: string;
	description: string;
	tags: string[];
};

export type EditSolutionProps = {
	id: string;
	description: string;
	tags: string[];
};

export type DeleteSolutionProps = {
	id: string;
};

export type AcceptSolutionProps = {
	problemId: string;
	solutionId: string;
};

export type RegisterUserProps = {
	username: string;
	contacts: Buffer;
	country: string;
};

export type EditUserProps = {
	username: string;
	contacts: Buffer;
	country: string;
};
