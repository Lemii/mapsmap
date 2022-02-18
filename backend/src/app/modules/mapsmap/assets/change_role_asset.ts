import { ApplyAssetContext, BaseAsset, ValidateAssetContext } from 'lisk-sdk';

import { ASSET_IDS, FEES } from '../../../../constants';

export class ChangeRoleAsset extends BaseAsset {
	public name = 'changeRole';
	public id = ASSET_IDS.changeRole;
	public fee = FEES.changeRole;

	// Define schema for asset
	public schema = {
		$id: 'mapsmap/changeRole-asset',
		title: 'ChangeRoleAsset transaction asset for mapsmap module',
		type: 'object',
		required: [],
		properties: {},
	};

	public validate({ asset }: ValidateAssetContext<{}>): void {
		// Validate your asset
	}

	// eslint-disable-next-line @typescript-eslint/require-await
	public async apply({ asset, transaction, stateStore }: ApplyAssetContext<{}>): Promise<void> {
		throw new Error('Asset "changeRole" apply hook is not implemented.');
	}
}
