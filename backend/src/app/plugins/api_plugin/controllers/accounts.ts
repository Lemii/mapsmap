/*
 * Copyright © 2020 Lisk Foundation
 *
 * See the LICENSE file at the top-level directory of this distribution
 * for licensing information.
 *
 * Unless otherwise agreed in a custom licensing agreement with the Lisk Foundation,
 * no part of this software, including this file, may be copied, modified,
 * propagated, or distributed except according to the terms contained in the
 * LICENSE file.
 *
 * Removal or modification of this copyright notice is prohibited.
 */
import { NextFunction, Request, Response } from 'express';
import { BaseChannel, PluginCodec, validator } from 'lisk-sdk';

export const getAccount = (channel: BaseChannel, codec: PluginCodec) => async (
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	const accountAddress = req.params.address;

	if (!validator.isHexString(accountAddress)) {
		res.status(400).send({
			errors: [{ message: 'The Address parameter should be a hex string.' }],
		});
		return;
	}

	try {
		const account: Buffer = await channel.invoke('app:getAccount', {
			address: accountAddress,
		});
		res.status(200).send({ data: codec.decodeAccount(account), meta: {} });
	} catch (err) {
		if ((err as Error).message.startsWith('Specified key accounts:address')) {
			res.status(404).send({
				errors: [{ message: `Account with address '${accountAddress}' was not found` }],
			});
		} else {
			next(err);
		}
	}
};
