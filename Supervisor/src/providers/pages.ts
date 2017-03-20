import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Settings } from './settings';
import 'rxjs/add/operator/map';
import { Utils } from './common';
import {Observable} from 'rxjs/Rx';
import { Page } from '../entities/page';

@Injectable()
export class Pages {

  constructor(public http: Http, public settingsProvider: Settings) {
    console.info('Create Pages Provider');
  }

  getAllPages(): Observable<Array<Page>> {
    const url = Utils.getAPIEndPoint(this.settingsProvider.config, ['pages']);
    return this.http.get(url)
      .map(this.extractData)
      .catch(this.handleError)
  }

  getPage(name: string): Observable<Page> {
    const url = Utils.getAPIEndPoint(this.settingsProvider.config, ['pages', name]);
    return this.http.get(url)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getPages(name: string[]): Observable<Array<Page>> {
    return Observable.forkJoin(name.map(v => this.getPage(v)));
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
    let errMsg = "Error getting pages from the server";
    return Observable.throw(errMsg);
  }

}
