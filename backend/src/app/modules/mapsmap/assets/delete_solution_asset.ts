import { ApplyAssetContext, BaseAsset, codec, cryptography, transactions, ValidateAssetContext } from 'lisk-sdk';

import { ASSET_IDS, FEES } from '../../../../constants';
import { AccountProps } from '../../../../types';
import { getStoreData } from '../../../utils/store';
import { CHAIN_STATE, chainStateSchema } from '../schemas';

export type Props = {
	id: string;
};

export class DeleteSolutionAsset extends BaseAsset {
	public name = 'deleteSolution';
	public id = ASSET_IDS.deleteSolution;
	public fee = FEES.deleteSolution;

	public schema = {
		$id: 'mapsmap/deleteSolution-asset',
		title: 'DeleteSolutionAsset transaction asset for mapsmap module',
		type: 'object',
		required: ['id'],
		properties: {
			id: {
				dataType: 'string',
				fieldNumber: 1,
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

		storeData.solutions = storeData.solutions.filter(s => s.data.id !== asset.id);
		sender.mapsmap.solutions = sender.mapsmap.solutions.filter(s => s.id !== asset.id);

		await stateStore.account.set(sender.address, sender);
		await stateStore.chain.set(CHAIN_STATE, codec.encode(chainStateSchema, storeData));
	}
}
