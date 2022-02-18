import { ApplyAssetContext, BaseAsset, codec, cryptography, transactions, ValidateAssetContext } from 'lisk-sdk';

import { ASSET_IDS, FEES } from '../../../../constants';
import { AccountProps, Solution } from '../../../../types';
import { createMeta } from '../../../utils/meta';
import { getStoreData } from '../../../utils/store';
import { CHAIN_STATE, chainStateSchema } from '../schemas';

export type Props = {
	problemId: string;
	description: string;
	tags: string[];
};

export class AddSolutionAsset extends BaseAsset {
	public name = 'addSolution';
	public id = ASSET_IDS.addSolution;
	public fee = FEES.addSolution;

	public schema = {
		$id: 'mapsmap/addSolution-asset',
		title: 'AddSolutionAsset transaction asset for mapsmap module',
		type: 'object',
		required: ['problemId', 'description', 'tags'],
		properties: {
			problemId: {
				dataType: 'string',
				fieldNumber: 1,
			},
			description: {
				dataType: 'string',
				fieldNumber: 2,
				minLength: 3,
				maxLength: 1200,
			},
			tags: {
				type: 'array',
				fieldNumber: 3,
				items: {
					dataType: 'string',
					minLength: 3,
					maxLength: 20,
				},
			},
		},
	};

	public validate({ transaction }: ValidateAssetContext<Props>): void {
		if (transaction.fee !== BigInt(transactions.convertLSKToBeddows(this.fee))) {
			throw new Error(`Fee must be ${this.fee} or higher.`);
		}
	}

	public async apply({ asset, transaction, stateStore }: ApplyAssetContext<Props>): Promise<void> {
		const storeData = await getStoreData(stateStore);
		const sender = await stateStore.account.getOrDefault<AccountProps>(transaction.senderAddress);
		const problem = storeData.problems.find(p => p.data.id === asset.problemId);

		if (!problem) {
			throw new Error(`Problem with id ${asset.problemId} does not exist.`);
		}

		const problemReference = {
			id: problem.data.id,
			title: problem.data.title,
		};

		const solution: Solution = {
			meta: createMeta(),
			data: {
				id: cryptography.bufferToHex(transaction.id),
				owner: {
					id: cryptography.bufferToHex(sender.address),
					username: sender.mapsmap.username,
				},
				description: asset.description,
				flag: 0,
				problem: problemReference,
				tags: asset.tags,
			},
		};

		storeData.solutions.push(solution);
		sender.mapsmap.solutions.push({ id: solution.data.id, problem: problemReference });

		await stateStore.account.set(sender.address, sender);
		await stateStore.chain.set(CHAIN_STATE, codec.encode(chainStateSchema, storeData));
	}
}
