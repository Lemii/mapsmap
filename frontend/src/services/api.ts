import { apiClient } from '@liskhq/lisk-client';

import config from '../config';
import { AccountProps, ActionType, ChainState, Problem, Solution, TagCloudData } from '../types';

const RPC_ENDPOINT = config.api;

let clientCache: apiClient.APIClient;

export const getClient = async () => {
	if (!RPC_ENDPOINT) throw new Error('No RPC endpoint defined');
	if (!clientCache) clientCache = await apiClient.createWSClient(RPC_ENDPOINT);

	return clientCache;
};

const invokeAction = async <T>(action: ActionType, arg: Record<string, unknown> = {}): Promise<T> => {
	const client = await getClient();
	const data = await client.invoke<T>(`mapsmap:${action}`, arg);
	return data;
};

export const getAccount = async (address: Buffer | string) => {
	const client = await getClient();
	const data: unknown = client.account.get(address);
	return data as AccountProps;
};

export const getState = async () => {
	return invokeAction<ChainState>('getState');
};

export const getProblems = async () => {
	return invokeAction<Problem[]>('getProblems');
};

export const getSolutions = async () => {
	return invokeAction<Solution[]>('getSolutions');
};

export const getProblemById = async (id: string) => {
	return invokeAction<Problem | undefined>('getProblemById', { id });
};

export const getSolutionById = async (id: string) => {
	return invokeAction<Solution | undefined>('getSolutionById', { id });
};

export const getProblemsByOwner = async (owner: string) => {
	return invokeAction<Problem[]>('getProblemsByOwner', { owner });
};

export const getSolutionsByOwner = async (owner: string) => {
	return invokeAction<Solution[]>('getSolutionsByOwner', { owner });
};

export const getSolutionsForProblem = async (problemId: string) => {
	return invokeAction<Solution[]>('getSolutionsForProblem', { problemId });
};

export const getOpenProblems = async () => {
	return invokeAction<Problem[]>('getOpenProblems');
};

export const getSolvedProblems = async () => {
	return invokeAction<Problem[]>('getSolvedProblems');
};

export const getProblemWordCloud = async () => {
	return invokeAction<TagCloudData>('getProblemWordCloud');
};

export const getSolutionWordCloud = async () => {
	return invokeAction<TagCloudData>('getSolutionWordCloud');
};
