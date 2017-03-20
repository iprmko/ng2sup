import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { IAppConfig, defaultAppConfig } from '../entities/app.config';

@Injectable()
export class Settings {

  private confCache: IAppConfig;

  constructor(private storage: Storage) {
    console.info('Create Settings provider');
  }

  public load(): Promise<IAppConfig> {
    return this.storage
      .ready()
      .then(() => {
        return this.storage.get('app.config') as Promise<IAppConfig>;
      })
      .then(val => {
        let config = val as IAppConfig;
        if (config === null)
          config = defaultAppConfig;
        this.confCache = config;
        return Promise.resolve(config);
      });

  }

  public store(config: IAppConfig): Promise<IAppConfig> {
    return this.storage
      .ready()
      .then((localForage) => {
        return this.storage.set('app.config', config);
      })
      .then(() => {
        this.confCache = config;
        return Promise.resolve(this.confCache);
      })
  }

  public reset(): Promise<IAppConfig> {
    return this.store(defaultAppConfig);
  }

  public get config(): IAppConfig {
    return this.confCache;
  }

}
