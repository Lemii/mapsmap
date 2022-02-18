import { ApplyAssetContext, BaseAsset, codec, cryptography, transactions, ValidateAssetContext } from 'lisk-sdk';

import { ASSET_IDS, FEES } from '../../../../constants';
import { AccountProps } from '../../../../types';
import { updateMeta } from '../../../utils/meta';
import { getStoreData } from '../../../utils/store';
import { CHAIN_STATE, chainStateSchema } from '../schemas';

export type Props = {
	id: string;
	description: string;
	tags: string[];
};

export class EditSolutionAsset extends BaseAsset {
	public name = 'editSolution';
	public id = ASSET_IDS.editSolution;
	public fee = FEES.editSolution;

	public schema = {
		$id: 'mapsmap/editSolution-asset',
		title: 'EditSolutionAsset transaction asset for mapsmap module',
		type: 'object',
		required: ['id', 'description', 'tags'],
		properties: {
			id: {
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
		if (transaction.fee < BigInt(transactions.convertLSKToBeddows(this.fee))) {
			throw new Error(`Fee must be ${this.fee} or higher.`);
		}
	}

	public async apply({ asset, transaction, stateStore }: ApplyAssetContext<Props>): Promise<void> {
		const storeData = await getStoreData(stateStore);
		const sender = await stateStore.account.getOrDefault<AccountProps>(transaction.senderAddress);
		const solution = storeData.solutions.find(s => s.data.id === asset.id);

		if (!solution) {
			throw new Error(`Solution with id ${asset.id} does not exist.`);
		}

		if (solution.data.owner.id !== cryptography.bufferToHex(sender.address)) {
			throw new Error(`Sender is not owner of solution.`);
		}

		solution.meta = updateMeta(solution.meta);
		solution.data = {
			...solution.data,
			...asset,
		};

		await stateStore.account.set(sender.address, sender);
		await stateStore.chain.set(CHAIN_STATE, codec.encode(chainStateSchema, storeData));
	}
}
