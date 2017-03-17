import 'rxjs/add/operator/map';
import { Component, ViewChild } from '@angular/core';

import { Platform, MenuController, Nav } from 'ionic-angular';
import { ModalController } from 'ionic-angular';

import { StatusBar, Splashscreen } from 'ionic-native';

import { Page } from '../entities/page';
import { SettingsPage } from  '../pages/settings/settings';
import { HomePage } from '../pages/home/home';
import { ScadaPage } from '../pages/scada-page/scada-page';

import { Dialogs } from '../providers/dialogs';
import { Pages } from '../providers/pages';
import { Variables } from '../providers/variables';
import { Actions } from '../providers/actions';
import { Settings } from '../providers/settings';
import { VariablesMonitor, ConnectionStatus, ConnectionStatusUpdate } from '../providers/variables-monitor';


@Component({
  templateUrl: 'app.html',
  providers: [Pages, Variables, Actions, VariablesMonitor]
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  // make HelloIonicPage the root (or first) page
  rootPage: any = HomePage;
  pages: Array<Page>;
  errorMessage: any;
  loggedIn: boolean = true;

  constructor(
    public platform: Platform,
    public menu: MenuController,
    public modal: ModalController,
    public pagesProvider: Pages,
    public settingsProvider: Settings,
    public variablesMonitorProvider: VariablesMonitor,
    public dialogs: Dialogs
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready()
      .then(() => {
        return this.settingsProvider.load();
      })
      .then((Settings) => {
        // Okay, so the platform is ready and our plugins are available.
        // Here you can do any higher level native things you might need.
        StatusBar.styleDefault();
        Splashscreen.hide();
        this.pagesProvider.getAllPages()
          .subscribe(
          pages => this.pages = pages.filter(p => p.root !== false),
          error => this.showError(error));

        if (!this.variablesMonitorProvider.running)
          this.variablesMonitorProvider.start();
      });
  }

  private showError(error) {
      this.dialogs.show(error); 
  }

  openScadaPage(page) {
    // close the menu when clicking a link from the menu
    this.menu.close();
    // navigate to the new page if it is not the current page
    this.nav.setRoot(ScadaPage, { item: page });
  }

  editSettings() {
    let modal = this.modal.create(SettingsPage, { item: this.settingsProvider.config });
    modal.onDidDismiss(data => {
      this.settingsProvider.store(data.item);
      this.menu.close();
    });
    modal.present();
  }
}
