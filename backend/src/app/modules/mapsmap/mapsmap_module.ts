/*
 * LiskHQ/lisk-commander
 * Copyright © 2021 Lisk Foundation
 *
 * See the LICENSE file at the top-level directory of this distribution
 * for licensing information.
 *
 * Unless otherwise agreed in a custom licensing agreement with the Lisk Foundation,
 * no part of this software, including this file, may be copied, modified,
 * propagated, or distributed except according to the terms contained in the
 * LICENSE file.
 *
 * Removal or modification of this copyright notice is prohibited.
 *
 */
import { AfterGenesisBlockApplyContext, BaseModule, codec } from 'lisk-sdk';

import { getModuleData } from '../../utils/store';
import { generateTagCloudData } from '../../utils/wordCloud';
import { AcceptSolutionAsset } from './assets/accept_solution_asset';
import { AddProblemAsset } from './assets/add_problem_asset';
import { AddSolutionAsset } from './assets/add_solution_asset';
import { ChangeFlagAsset } from './assets/change_flag_asset';
import { ChangeRoleAsset } from './assets/change_role_asset';
import { DeleteProblemAsset } from './assets/delete_problem_asset';
import { DeleteSolutionAsset } from './assets/delete_solution_asset';
import { EditProblemAsset } from './assets/edit_problem_asset';
import { EditSolutionAsset } from './assets/edit_solution_asset';
import { EditUserAsset } from './assets/edit_user_asset';
import { RegisterUserAsset } from './assets/register_user_asset';
import { accountSchema, CHAIN_INIT, CHAIN_STATE, chainStateSchema } from './schemas';

export class MapsmapModule extends BaseModule {
	// @ts-ignore
	public actions = {
		getState: async () => getModuleData(this._dataAccess),
		getProblems: async () => (await getModuleData(this._dataAccess)).problems,
		getSolutions: async () => (await getModuleData(this._dataAccess)).solutions,
		getProblemById: async ({ id }: { id: string }) => {
			const state = await getModuleData(this._dataAccess);
			return state.problems.find(p => p.data.id === id);
		},
		getSolutionById: async ({ id }: { id: string }) => {
			const state = await getModuleData(this._dataAccess);
			return state.solutions.find(s => s.data.id === id);
		},
		getProblemsByOwner: async ({ owner }: { owner: string }) => {
			const state = await getModuleData(this._dataAccess);
			return state.problems.filter(p => p.data.owner.id === owner);
		},
		getSolutionsByOwner: async ({ owner }: { owner: string }) => {
			const state = await getModuleData(this._dataAccess);
			return state.solutions.filter(s => s.data.owner.id === owner);
		},
		getSolutionsForProblem: async ({ problemId }: { problemId: string }) => {
			const state = await getModuleData(this._dataAccess);
			return state.solutions.filter(s => s.data.problem.id === problemId);
		},
		getOpenProblems: async () => {
			const state = await getModuleData(this._dataAccess);
			return state.problems.find(p => p.data.status === 'open');
		},
		getSolvedProblems: async () => {
			const state = await getModuleData(this._dataAccess);
			return state.problems.find(p => p.data.status === 'solved');
		},
		getProblemWordCloud: async () => {
			const state = await getModuleData(this._dataAccess);
			return generateTagCloudData(state.problems);
		},
		getSolutionWordCloud: async () => {
			const state = await getModuleData(this._dataAccess);
			return generateTagCloudData(state.solutions);
		},
	};
	public reducers = {};
	public name = 'mapsmap';
	public transactionAssets = [
		new AddProblemAsset(),
		new EditProblemAsset(),
		new DeleteProblemAsset(),
		new AddSolutionAsset(),
		new EditSolutionAsset(),
		new DeleteSolutionAsset(),
		new ChangeRoleAsset(),
		new ChangeFlagAsset(),
		new AcceptSolutionAsset(),
		new RegisterUserAsset(),
		new EditUserAsset(),
	];
	public events = [];
	public id = 1000;
	public accountSchema = accountSchema;

	public async afterGenesisBlockApply(_input: AfterGenesisBlockApplyContext) {
		await _input.stateStore.chain.set(CHAIN_STATE, codec.encode(chainStateSchema, CHAIN_INIT));
	}
}
