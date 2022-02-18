import { ApplyAssetContext, BaseAsset, codec, cryptography, transactions, ValidateAssetContext } from 'lisk-sdk';

import { ASSET_IDS, FEES } from '../../../../constants';
import { AccountProps } from '../../../../types';
import { getStoreData } from '../../../utils/store';
import { CHAIN_STATE, chainStateSchema } from '../schemas';

export type Props = {
	id: string;
};

export class DeleteProblemAsset extends BaseAsset {
	public name = 'deleteProblem';
	public id = ASSET_IDS.deleteProblem;
	public fee = FEES.deleteProblem;

	public schema = {
		$id: 'mapsmap/deleteProblem-asset',
		title: 'DeleteProblemAsset transaction asset for mapsmap module',
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

	public async apply({ asset, transaction, stateStore, reducerHandler }: ApplyAssetContext<Props>): Promise<void> {
		const storeData = await getStoreData(stateStore);
		const sender = await stateStore.account.getOrDefault<AccountProps>(transaction.senderAddress);
		const problem = storeData.problems.find(p => p.data.id === asset.id);

		if (!problem) {
			throw new Error(`Problem with id ${asset.id} does not exist.`);
		}

		if (problem.data.owner.id !== cryptography.bufferToHex(sender.address)) {
			throw new Error(`Sender is not owner of problem.`);
		}

		storeData.problems = storeData.problems.filter(p => p.data.id !== asset.id);
		sender.mapsmap.problems = sender.mapsmap.problems.filter(p => p.id !== asset.id);

		await reducerHandler.invoke('token:credit', {
			address: transaction.senderAddress,
			amount: BigInt(transactions.convertLSKToBeddows(problem.data.chestFund.toString())),
		});

		await stateStore.account.set(sender.address, sender);
		await stateStore.chain.set(CHAIN_STATE, codec.encode(chainStateSchema, storeData));
	}
}
