import { Location } from '@angular/common';
import { IAppConfig } from '../entities/app.config';

export class Utils {

  public static getAPIEndPoint(appConfig: IAppConfig, args: Array<string>): string {
    let chunks = [appConfig.server, appConfig.api];
    args.forEach(c => chunks.push(c));
    return chunks.reduce((a, b) => Location.joinWithSlash(a, b));
  }

}
