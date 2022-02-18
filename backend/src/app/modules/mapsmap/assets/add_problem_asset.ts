import { ApplyAssetContext, BaseAsset, codec, cryptography, transactions, ValidateAssetContext } from 'lisk-sdk';

import { ASSET_IDS, FEES } from '../../../../constants';
import { AccountProps, Problem } from '../../../../types';
import { createMeta } from '../../../utils/meta';
import { getStoreData } from '../../../utils/store';
import { CHAIN_STATE, chainStateSchema } from '../schemas';

export type Props = {
	title: string;
	description: string;
	solutionConditions: string;
	tags: string[];
	category: number;
	chestFund: number;
};

export class AddProblemAsset extends BaseAsset {
	public name = 'addProblem';
	public id = ASSET_IDS.addProblem;
	public fee = FEES.addProblem;

	public schema = {
		$id: 'mapsmap/addProblem-asset',
		title: 'AddProblemAsset transaction asset for mapsmap module',
		type: 'object',
		required: ['title', 'description', 'solutionConditions', 'tags', 'category', 'chestFund'],
		properties: {
			title: {
				dataType: 'string',
				fieldNumber: 1,
				minLength: 3,
				maxLength: 40,
			},
			description: {
				dataType: 'string',
				fieldNumber: 2,
				minLength: 3,
				maxLength: 800,
			},
			solutionConditions: {
				dataType: 'string',
				fieldNumber: 3,
				minLength: 3,
				maxLength: 800,
			},
			tags: {
				type: 'array',
				fieldNumber: 4,
				items: {
					dataType: 'string',
					minLength: 3,
					maxLength: 20,
				},
			},
			category: {
				dataType: 'uint32',
				fieldNumber: 5,
			},
			chestFund: {
				fieldNumber: 6,
				dataType: 'uint32',
			},
		},
	};

	public validate({ transaction }: ValidateAssetContext<Props>): void {
		if (transaction.fee < BigInt(transactions.convertLSKToBeddows(this.fee))) {
			throw new Error(`Fee must be ${this.fee} or higher.`);
		}
	}

	public async apply({ asset, transaction, stateStore, reducerHandler }: ApplyAssetContext<Props>): Promise<void> {
		const storeData = await getStoreData(stateStore);
		const sender = await stateStore.account.getOrDefault<AccountProps>(transaction.senderAddress);

		const problem: Problem = {
			meta: createMeta(),
			data: {
				id: cryptography.bufferToHex(transaction.id),
				status: 'open',
				owner: {
					id: cryptography.bufferToHex(sender.address),
					username: sender.mapsmap.username,
				},
				solvedBy: '',
				flag: 0,
				...asset,
			},
		};

		const totalCost = Number(this.fee) + asset.chestFund;

		const senderBalance: BigInt = await reducerHandler.invoke('token:getBalance', {
			address: transaction.senderAddress,
		});
		const senderBalanceInLsk = Number(transactions.convertBeddowsToLSK(senderBalance.toString()));

		if (senderBalanceInLsk < totalCost) {
			throw new Error(`Sender does not have the required ${totalCost} tokens`);
		}

		await reducerHandler.invoke('token:debit', {
			address: transaction.senderAddress,
			amount: BigInt(transactions.convertLSKToBeddows(asset.chestFund.toString())),
		});

		storeData.problems.push(problem);
		sender.mapsmap.problems.push({ id: problem.data.id, title: problem.data.title });

		await stateStore.account.set(sender.address, sender);
		await stateStore.chain.set(CHAIN_STATE, codec.encode(chainStateSchema, storeData));
	}
}
