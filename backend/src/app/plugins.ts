import { Application } from 'lisk-sdk';

import { ApiPluginPlugin } from './plugins/api_plugin/api_plugin_plugin';

export const registerPlugins = (app: Application): void => {
	app.registerPlugin(ApiPluginPlugin);
};
