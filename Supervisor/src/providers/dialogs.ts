import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Settings } from './settings';
import 'rxjs/add/operator/map';
import { Utils } from './common';
import { Observable } from 'rxjs/Rx';
import { Page } from '../entities/page';
import { ToastController, ToastOptions } from 'ionic-angular';

@Injectable()
export class Dialogs {

  constructor(private toastCtrl: ToastController) {
    console.info('Create Dialogs provider');
  }

  public show(opts?: DialogOptions | string | Error): Promise<any> {
    let dialogOpts: DialogOptions;

    if (typeof opts === 'string') {
      dialogOpts = {
        type: DialogType.info,
        message: opts,
        duration: 3000,
        position: 'bottom'
      };
    } else if (opts instanceof Error) {
      dialogOpts = {
        type: DialogType.error,
        message: (opts as Error).message,
        duration: 3000,
        position: 'bottom'
      };
    } else {
      dialogOpts = {
        type: opts.type || DialogType.info,
        message: opts.message || JSON.stringify(opts),
        duration: 3000,
        position: 'bottom'
      };
    }

    return this.showToast(dialogOpts);
  }

  private showToast(dialogOpts): Promise<any> {

    let toast = this.toastCtrl.create(dialogOpts);

    return toast.present();
  }

}

export enum DialogType {
  info,
  warn,
  error
}

export interface DialogOptions extends ToastOptions {
  type: DialogType;
}
