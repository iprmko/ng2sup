import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Settings } from './settings';
import 'rxjs/add/operator/map';
import { Utils } from './common';
import { Observable } from 'rxjs/Rx';
import { Variable } from '../entities/variable';

@Injectable()
export class Variables {

  constructor(public http: Http, public settingsProvider: Settings) {
    console.info('Create Variables Provider');
  }

  getAllVariables(): Observable<Array<Variable>> {
    return this.http.request(Utils.getAPIEndPoint(this.settingsProvider.config, ['variables']))
      .map(this.extractData)
      .catch(this.handleError);
  }

  getVariable(name: string): Observable<Variable> {
    const url = Utils.getAPIEndPoint(this.settingsProvider.config, ['variables', name]);
    return this.http.request(url)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getVariables(name: string[]): Observable<Array<Variable>> {
    return Observable.forkJoin(name.map(v => this.getVariable(v)));
  }

  private extractData<T>(res: Response): Array<T> | any {
    let body = res.json();
    if (body.res === "ok")
      return body.data as Array<T>;
    else
      return Observable.throw(body.message);
  }

  private handleError(error: Response | any) {
    // In a real world app, we might use a remote logging infrastructure
    console.error(error)
    let errMsg = "Error getting variables from the server";
    return Observable.throw(errMsg);
  }

}
