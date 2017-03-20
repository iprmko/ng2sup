import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Settings } from './settings';
import 'rxjs/add/operator/map';
import { Utils } from './common';
import { Observable } from 'rxjs/Rx';
import { Action } from '../entities/action';

@Injectable()
export class Actions {

  constructor(public http: Http, public settingsProvider: Settings) {
    console.info('Create Actions Provider');
  }

  getAllActions(): Observable<Array<Action>> {
    return this.http.request(Utils.getAPIEndPoint(this.settingsProvider.config, ['actions']))
      .map(this.extractData)
      .catch(this.handleError);
  }

  getAction(name: string): Observable<Action> {
    const url = Utils.getAPIEndPoint(this.settingsProvider.config, ['actions', name]);
    return this.http.request(url)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getActions(name: string[]): Observable<Array<Action>> {
    return Observable.forkJoin(name.map(v => this.getAction(v)));
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
    let errMsg = "Error getting actions from the server";
    return Observable.throw(errMsg);
  }

}
