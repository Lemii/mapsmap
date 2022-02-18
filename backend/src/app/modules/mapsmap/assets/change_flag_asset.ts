import { ApplyAssetContext, BaseAsset, ValidateAssetContext } from 'lisk-sdk';

import { ASSET_IDS, FEES } from '../../../../constants';

export class ChangeFlagAsset extends BaseAsset {
	public name = 'changeFlag';
	public id = ASSET_IDS.changeFlag;
	public fee = FEES.changeFlag;

	// Define schema for asset
	public schema = {
		$id: 'mapsmap/changeFlag-asset',
		title: 'ChangeFlagAsset transaction asset for mapsmap module',
		type: 'object',
		required: [],
		properties: {},
	};

	public validate({ asset }: ValidateAssetContext<{}>): void {
		// Validate your asset
	}

	// eslint-disable-next-line @typescript-eslint/require-await
	public async apply({ asset, transaction, stateStore }: ApplyAssetContext<{}>): Promise<void> {
		throw new Error('Asset "changeFlag" apply hook is not implemented.');
	}
}
