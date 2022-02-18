import { ApplyAssetContext, BaseAsset, codec, cryptography, transactions, ValidateAssetContext } from 'lisk-sdk';

import { ASSET_IDS, FEES } from '../../../../constants';
import { AccountProps } from '../../../../types';
import { updateMeta } from '../../../utils/meta';
import { getStoreData } from '../../../utils/store';
import { CHAIN_STATE, chainStateSchema } from '../schemas';

type Props = {
	problemId: string;
	solutionId: string;
};

export class AcceptSolutionAsset extends BaseAsset {
	public name = 'acceptSolution';
	public id = ASSET_IDS.acceptSolution;
	public fee = FEES.acceptSolution;

	public schema = {
		$id: 'mapsmap/acceptSolution-asset',
		title: 'AcceptSolutionAsset transaction asset for mapsmap module',
		type: 'object',
		required: ['problemId', 'solutionId'],
		properties: {
			problemId: {
				dataType: 'string',
				fieldNumber: 1,
			},
			solutionId: {
				dataType: 'string',
				fieldNumber: 2,
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
		const problem = storeData.problems.find(p => p.data.id === asset.problemId);
		const solution = storeData.solutions.find(s => s.data.id === asset.solutionId);

		if (!problem) {
			throw new Error(`Problem with id ${asset.problemId} does not exist.`);
		}

		if (!solution) {
			throw new Error(`Solution with id ${asset.solutionId} does not exist.`);
		}

		if (problem.data.owner.id !== cryptography.bufferToHex(sender.address)) {
			throw new Error(`Sender is not owner of problem.`);
		}

		if (problem.data.status === 'solved') {
			throw new Error(`Problem with id ${asset.problemId} is already solved.`);
		}

		await reducerHandler.invoke('token:credit', {
			address: cryptography.hexToBuffer(solution.data.owner.id),
			amount: BigInt(transactions.convertLSKToBeddows(problem.data.chestFund.toString())),
		});

		problem.meta = updateMeta(problem.meta);
		problem.data = {
			...problem.data,
			status: 'solved',
			solvedBy: asset.solutionId,
			chestFund: 0,
		};

		await stateStore.account.set(sender.address, sender);
		await stateStore.chain.set(CHAIN_STATE, codec.encode(chainStateSchema, storeData));
	}
}
