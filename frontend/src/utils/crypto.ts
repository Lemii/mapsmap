import { cryptography } from '@liskhq/lisk-client';
import { Mnemonic } from '@liskhq/lisk-passphrase';

import config from '../config';

export const getCredentials = (pass?: string) => {
	const passphrase = pass || Mnemonic.generateMnemonic();

	return {
		mapAddress: cryptography.getBase32AddressFromPassphrase(passphrase, config.addressPrefix),
		binaryAddress: cryptography.getAddressFromPassphrase(passphrase).toString('hex'),
		passphrase: passphrase,
	};
};
