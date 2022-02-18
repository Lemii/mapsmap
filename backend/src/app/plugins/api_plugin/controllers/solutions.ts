import { NextFunction, Request, Response } from 'express';
import { BaseChannel } from 'lisk-sdk';

import { Solution } from '../../../../types';
import { ActionType } from '../types';

export const getSolutions = (channel: BaseChannel) => async (
	_req: Request,
	res: Response,
	_next: NextFunction,
): Promise<void> => {
	const action: ActionType = 'getSolutions';

	try {
		const data = await channel.invoke<Solution[]>(`mapsmap:${action}`);
		res.status(200).send(data);
	} catch (err) {
		res.status(404).send({
			errors: [{ message: `Could not get solutions` }],
		});
	}
};

export const getSolutionById = (channel: BaseChannel) => async (
	req: Request,
	res: Response,
	_next: NextFunction,
): Promise<void> => {
	const { id } = req.params;

	if (!id) {
		res.status(400).send({
			errors: [{ message: 'No id specified.' }],
		});
		return;
	}

	const action: ActionType = 'getSolutionById';

	try {
		const data = await channel.invoke<Solution>(`mapsmap:${action}`, { id });

		res.status(200).send(data);
	} catch (err) {
		res.status(404).send({
			errors: [{ message: `Could not get solution` }],
		});
	}
};

export const getSolutionsByOwner = (channel: BaseChannel) => async (
	req: Request,
	res: Response,
	_next: NextFunction,
): Promise<void> => {
	const { owner } = req.params;

	if (!owner) {
		res.status(400).send({
			errors: [{ message: 'No owner specified.' }],
		});
		return;
	}

	const action: ActionType = 'getSolutionsByOwner';

	try {
		const data = await channel.invoke<Solution[]>(`mapsmap:${action}`, { owner });
		res.status(200).send(data || []);
	} catch (err) {
		res.status(404).send({
			errors: [{ message: `Could not get solutions` }],
		});
	}
};

export const getSolutionsForProblem = (channel: BaseChannel) => async (
	req: Request,
	res: Response,
	_next: NextFunction,
): Promise<void> => {
	const { problemId } = req.params;

	if (!problemId) {
		res.status(400).send({
			errors: [{ message: 'No problemId specified.' }],
		});
		return;
	}

	const action: ActionType = 'getSolutionsForProblem';

	try {
		const data = await channel.invoke<Solution[]>(`mapsmap:${action}`, { problemId });
		res.status(200).send(data || []);
	} catch (err) {
		res.status(404).send({
			errors: [{ message: `Could not get solutions` }],
		});
	}
};
