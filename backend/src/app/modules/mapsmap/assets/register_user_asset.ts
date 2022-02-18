import { ApplyAssetContext, BaseAsset, transactions, ValidateAssetContext } from 'lisk-sdk';

import { ASSET_IDS, FEES } from '../../../../constants';
import { AccountProps } from '../../../../types';
import { isValidIsoCode, validateContacts } from '../../../utils/validation';

type Props = {
	username: string;
	contacts: Buffer;
	country: string;
};

export class RegisterUserAsset extends BaseAsset {
	public name = 'registerUser';
	public id = ASSET_IDS.registerUser;
	public fee = FEES.registerUser;

	public schema = {
		$id: 'mapsmap/registerUser-asset',
		title: 'RegisterUserAsset transaction asset for mapsmap module',
		type: 'object',
		required: ['username', 'contacts', 'country'],
		properties: {
			username: {
				dataType: 'string',
				fieldNumber: 1,
				minLength: 3,
				maxLength: 20,
			},
			contacts: {
				dataType: 'bytes',
				fieldNumber: 2,
			},
			country: {
				dataType: 'string',
				fieldNumber: 3,
			},
		},
	};

	public validate({ asset, transaction }: ValidateAssetContext<Props>): void {
		if (transaction.fee < BigInt(transactions.convertLSKToBeddows(this.fee))) {
			throw new Error(`Fee must be ${this.fee} or higher.`);
		}

		if (!isValidIsoCode(asset.country)) {
			throw new Error(`${asset.country} is not a valid country code.`);
		}

		validateContacts(asset.contacts);
	}

	public async apply({ asset, transaction, stateStore }: ApplyAssetContext<Props>): Promise<void> {
		const sender = await stateStore.account.getOrDefault<AccountProps>(transaction.senderAddress);

		sender.mapsmap = {
			...sender.mapsmap,
			...asset,
			role: 0,
			flag: 0,
		};

		await stateStore.account.set(sender.address, sender);
	}
}
