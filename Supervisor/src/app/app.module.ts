import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { MyApp } from './app.component';

import { TagComponent } from '../components/tag/tag';
import { RegionComponent } from '../components/region/region';
import { ActionComponent } from '../components/action/action';
import { ConnectionStatusComponent } from '../components/connection-status/connection-status';

import { HomePage } from '../pages/home/home';
import { SettingsPage } from  '../pages/settings/settings';
import { ScadaPage } from '../pages/scada-page/scada-page';

import { Settings } from '../providers/settings';
import { Dialogs } from '../providers/dialogs';

@NgModule({
  declarations: [
    TagComponent,
    ActionComponent,
    RegionComponent,
    ConnectionStatusComponent,
    MyApp,
    HomePage,
    SettingsPage,
    ScadaPage
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    TagComponent,
    ActionComponent,
    RegionComponent,
    ConnectionStatusComponent,
    MyApp,
    HomePage,
    SettingsPage,
    ScadaPage
  ],
  providers: [
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    Storage, Settings, Dialogs
  ]
})
export class AppModule { }
