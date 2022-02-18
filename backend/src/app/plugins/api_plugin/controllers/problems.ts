import { NextFunction, Request, Response } from 'express';
import { BaseChannel } from 'lisk-sdk';

import { Problem } from '../../../../types';
import { ActionType } from '../types';

export const getProblems = (channel: BaseChannel) => async (
	_req: Request,
	res: Response,
	_next: NextFunction,
): Promise<void> => {
	const action: ActionType = 'getProblems';

	try {
		const data = await channel.invoke<Problem[]>(`mapsmap:${action}`);
		res.status(200).send(data);
	} catch (err) {
		res.status(404).send({
			errors: [{ message: `Could not get problems` }],
		});
	}
};

export const getProblemById = (channel: BaseChannel) => async (
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

	const action: ActionType = 'getProblemById';

	try {
		const data = await channel.invoke<Problem>(`mapsmap:${action}`, { id });

		res.status(200).send(data);
	} catch (err) {
		res.status(404).send({
			errors: [{ message: `Could not get problems` }],
		});
	}
};

export const getProblemsByOwner = (channel: BaseChannel) => async (
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

	const action: ActionType = 'getProblemsByOwner';

	try {
		const data = await channel.invoke<Problem[]>(`mapsmap:${action}`, { owner });
		res.status(200).send(data || []);
	} catch (err) {
		res.status(404).send({
			errors: [{ message: `Could not get problems` }],
		});
	}
};

export const getOpenProblems = (channel: BaseChannel) => async (
	_req: Request,
	res: Response,
	_next: NextFunction,
): Promise<void> => {
	const action: ActionType = 'getOpenProblems';

	try {
		const data = await channel.invoke<Problem[]>(`mapsmap:${action}`);
		res.status(200).send(data || []);
	} catch (err) {
		res.status(404).send({
			errors: [{ message: `Could not get problems` }],
		});
	}
};

export const getSolvedProblems = (channel: BaseChannel) => async (
	_req: Request,
	res: Response,
	_next: NextFunction,
): Promise<void> => {
	const action: ActionType = 'getSolvedProblems';

	try {
		const data = await channel.invoke<Problem[]>(`mapsmap:${action}`);
		res.status(200).send(data || []);
	} catch (err) {
		res.status(404).send({
			errors: [{ message: `Could not get problems` }],
		});
	}
};
