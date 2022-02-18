/* eslint-disable @typescript-eslint/no-empty-function */
import { Application } from 'lisk-sdk';
import { MapsmapModule } from "./modules/mapsmap/mapsmap_module";

// @ts-expect-error Unsused variable error happens here until at least one module is registered
export const registerModules = (app: Application): void => {

    app.registerModule(MapsmapModule);
};
