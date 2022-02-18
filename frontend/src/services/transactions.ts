import { cryptography, transactions } from '@liskhq/lisk-client';

import config from '../config';
import { ASSET_IDS, FEES } from '../constants';
import { getClient } from './api';
import * as Props from './types';

const sendTransaction = async (
	passphrase: string,
	assetID: number,
	fee: string,
	asset: Record<string, unknown> = {},
) => {
	const client = await getClient();

	const tx = await client.transaction.create(
		{
			moduleID: 1000,
			assetID,
			fee: BigInt(transactions.convertLSKToBeddows(fee)),
			asset,
		},
		passphrase,
	);

	return client.transaction.send(tx);
};

export const sendAddProblemAsset = (passphrase: string, asset: Props.AddProblemProps) => {
	return sendTransaction(passphrase, ASSET_IDS.addProblem, FEES.addProblem, asset);
};

export const sendEditProblemAsset = (passphrase: string, asset: Props.EditProblemProps) => {
	return sendTransaction(passphrase, ASSET_IDS.editProblem, FEES.editProblem, asset);
};

export const sendDeleteProblemAsset = (passphrase: string, asset: Props.DeleteProblemProps) => {
	return sendTransaction(passphrase, ASSET_IDS.deleteProblem, FEES.deleteProblem, asset);
};

export const sendAddSolutionAsset = (passphrase: string, asset: Props.AddSolutionProps) => {
	return sendTransaction(passphrase, ASSET_IDS.addSolution, FEES.addSolution, asset);
};

export const sendEditSolutionAsset = (passphrase: string, asset: Props.EditSolutionProps) => {
	return sendTransaction(passphrase, ASSET_IDS.editSolution, FEES.editSolution, asset);
};

export const sendDeleteSolutionAsset = (passphrase: string, asset: Props.DeleteSolutionProps) => {
	return sendTransaction(passphrase, ASSET_IDS.deleteSolution, FEES.deleteSolution, asset);
};

export const sendAcceptSolutionAsset = (passphrase: string, asset: Props.AcceptSolutionProps) => {
	return sendTransaction(passphrase, ASSET_IDS.acceptSolution, FEES.acceptSolution, asset);
};

export const sendRegisterUserAsset = (passphrase: string, asset: Props.RegisterUserProps) => {
	return sendTransaction(passphrase, ASSET_IDS.registerUser, FEES.registerUser, asset);
};

export const sendEditUserAsset = (passphrase: string, asset: Props.EditUserProps) => {
	return sendTransaction(passphrase, ASSET_IDS.editUser, FEES.editUser, asset);
};

export const fundAccount = async (address: string) => {
	const passphrase = config.fundPassphrase;

	if (!passphrase) {
		throw new Error('No funding passphrase has been configured');
	}

	const client = await getClient();

	const asset = {
		amount: BigInt('1000000000000'),
		recipientAddress: cryptography.getAddressFromLisk32Address(address, config.addressPrefix),
		data: 'Fund account',
	};

	const tx = await client.transaction.create(
		{
			moduleName: 'token',
			assetName: 'transfer',
			fee: BigInt(transactions.convertLSKToBeddows('1')),
			asset,
		},
		passphrase,
	);

	return client.transaction.send(tx);
};
