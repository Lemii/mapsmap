import dotenv from 'dotenv';
import { Application, PartialApplicationConfig } from 'lisk-sdk';

import { registerModules } from './modules';
import { registerPlugins } from './plugins';

dotenv.config();

export const getApplication = (
	genesisBlock: Record<string, unknown>,
	config: PartialApplicationConfig,
): Application => {
	const app = Application.defaultApplication(genesisBlock, config);

	registerModules(app);
	registerPlugins(app);

	return app;
};
