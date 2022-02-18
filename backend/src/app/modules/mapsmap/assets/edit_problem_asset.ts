import { ApplyAssetContext, BaseAsset, codec, cryptography, transactions, ValidateAssetContext } from 'lisk-sdk';

import { ASSET_IDS, FEES } from '../../../../constants';
import { AccountProps } from '../../../../types';
import { updateMeta } from '../../../utils/meta';
import { getStoreData } from '../../../utils/store';
import { CHAIN_STATE, chainStateSchema } from '../schemas';

export type Props = {
	id: string;
	title: string;
	description: string;
	solutionConditions: string;
	tags: string[];
	category: number;
	chestFund: number;
};

export class EditProblemAsset extends BaseAsset {
	public name = 'editProblem';
	public id = ASSET_IDS.editProblem;
	public fee = FEES.editProblem;

	public schema = {
		$id: 'mapsmap/editProblem-asset',
		title: 'EditProblemAsset transaction asset for mapsmap module',
		type: 'object',
		required: ['id', 'title', 'description', 'solutionConditions', 'tags', 'category', 'chestFund'],
		properties: {
			id: {
				dataType: 'string',
				fieldNumber: 1,
			},
			title: {
				dataType: 'string',
				fieldNumber: 2,
				minLength: 3,
				maxLength: 40,
			},
			description: {
				dataType: 'string',
				fieldNumber: 3,
				minLength: 3,
				maxLength: 800,
			},
			solutionConditions: {
				dataType: 'string',
				fieldNumber: 4,
				minLength: 3,
				maxLength: 800,
			},
			tags: {
				type: 'array',
				fieldNumber: 5,
				items: {
					dataType: 'string',
					minLength: 3,
					maxLength: 20,
				},
			},
			category: {
				dataType: 'uint32',
				fieldNumber: 6,
			},
			chestFund: {
				fieldNumber: 7,
				dataType: 'uint32',
			},
		},
	};

	public validate({ transaction }: ValidateAssetContext<Props>): void {
		if (transaction.fee < BigInt(transactions.convertLSKToBeddows(this.fee))) {
			throw new Error(`Fee must be ${this.fee} or higher.`);
		}
	}

	public async apply({ asset, transaction, stateStore }: ApplyAssetContext<Props>): Promise<void> {
		const storeData = await getStoreData(stateStore);
		const sender = await stateStore.account.getOrDefault<AccountProps>(transaction.senderAddress);
		const problem = storeData.problems.find(p => p.data.id === asset.id);

		if (!problem) {
			throw new Error(`Problem with id ${asset.id} does not exist.`);
		}

		if (problem.data.owner.id !== cryptography.bufferToHex(sender.address)) {
			throw new Error(`Sender is not owner of problem.`);
		}

		problem.meta = updateMeta(problem.meta);
		problem.data = {
			...problem.data,
			...asset,
		};

		await stateStore.account.set(sender.address, sender);
		await stateStore.chain.set(CHAIN_STATE, codec.encode(chainStateSchema, storeData));
	}
}
