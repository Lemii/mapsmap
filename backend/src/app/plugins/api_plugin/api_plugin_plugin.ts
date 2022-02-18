/* eslint-disable @typescript-eslint/no-misused-promises */
import cors from 'cors';
import express, { Express } from 'express';
import rateLimit from 'express-rate-limit';
import { Server } from 'http';
import { ActionsDefinition, BaseChannel, BasePlugin, EventsDefinition, PluginInfo, SchemaWithDefault } from 'lisk-sdk';

import config from './config';
import * as controllers from './controllers';

export class ApiPluginPlugin extends BasePlugin {
	private _server!: Server;
	private _app!: Express;
	private _channel!: BaseChannel;

	public static get alias(): string {
		return 'apiPlugin';
	}

	public static get info(): PluginInfo {
		return {
			author: 'lemii, korben3',
			version: '0.1.0',
			name: 'apiPlugin',
		};
	}

	public get defaults(): SchemaWithDefault {
		return {
			$id: '/plugins/plugin-apiPlugin/config',
			type: 'object',
			properties: {},
			required: [],
			default: {},
		};
	}

	public get events(): EventsDefinition {
		return [];
	}

	public get actions(): ActionsDefinition {
		return {};
	}

	// eslint-disable-next-line @typescript-eslint/require-await
	public async load(channel: BaseChannel): Promise<void> {
		this._app = express();
		this._channel = channel;

		this._channel.once('app:ready', () => {
			this._registerMiddlewares();
			this._registerControllers();
			this._server = this._app.listen(config.port);
		});
	}

	public async unload(): Promise<void> {
		await new Promise<void>((resolve, reject) => {
			this._server.close(err => {
				if (err) {
					reject(err);
					return;
				}
				resolve();
			});
		});
	}
	private _registerMiddlewares(): void {
		const limiter = rateLimit(config.limiter);
		this._app.use(limiter);
		this._app.use(express.json());
		this._app.use(cors());
	}

	private _registerControllers(): void {
		// Account
		this._app.get('/api/accounts/:address', controllers.accounts.getAccount(this._channel, this.codec));

		// Problems
		this._app.get('/api/problem/:id', controllers.problems.getProblemById(this._channel));
		this._app.get('/api/problems', controllers.problems.getProblems(this._channel));
		this._app.get('/api/problems/owner/:owner', controllers.problems.getProblemsByOwner(this._channel));
		this._app.get('/api/problems/open', controllers.problems.getOpenProblems(this._channel));
		this._app.get('/api/problems/solved', controllers.problems.getSolvedProblems(this._channel));

		// Solutions
		this._app.get('/api/solution/:id', controllers.solutions.getSolutionById(this._channel));
		this._app.get('/api/solutions', controllers.solutions.getSolutions(this._channel));
		this._app.get('/api/solutions/owner/:owner', controllers.solutions.getSolutionsByOwner(this._channel));
		this._app.get('/api/solutions/problem/:problemId', controllers.solutions.getSolutionsForProblem(this._channel));
	}
}
