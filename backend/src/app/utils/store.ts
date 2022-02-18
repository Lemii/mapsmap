import { BaseModuleDataAccess, codec, StateStore } from 'lisk-sdk';

import { ChainState } from '../../types';
import { CHAIN_INIT, CHAIN_STATE, chainStateSchema } from '../modules/mapsmap/schemas';

export const getStoreData = async (stateStore: StateStore): Promise<ChainState> => {
	const storeDataBuffer = await stateStore.chain.get(CHAIN_STATE);
	const storeData = storeDataBuffer ? codec.decode<ChainState>(chainStateSchema, storeDataBuffer) : CHAIN_INIT;
	return storeData;
};

export const getModuleData = async (dataAccess: BaseModuleDataAccess): Promise<ChainState> => {
	const storeDataBuffer = await dataAccess.getChainState(CHAIN_STATE);
	const storeData = storeDataBuffer ? codec.decode<ChainState>(chainStateSchema, storeDataBuffer) : CHAIN_INIT;
	return storeData;
};
