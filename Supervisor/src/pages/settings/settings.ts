import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';
import { ViewController } from 'ionic-angular';
import { IAppConfig } from '../../entities/app.config';

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsPage {
  appConfig: IAppConfig;

  constructor(
    public viewCtrl: ViewController,
    public params: NavParams
  ) {
    this.appConfig = this.params.get('item');
  }

  dismiss() {
    this.viewCtrl.dismiss({ item: this.appConfig });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingsPage');
  }

}
