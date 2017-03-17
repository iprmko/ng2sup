import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Variable } from '../../entities/variable';
import { Page, Region } from '../../entities/page';

import { RegionComponent } from '../../components/region/region';

@Component({
  selector: 'page-scada-page',
  templateUrl: 'scada-page.html',
  providers: [RegionComponent]
})
export class ScadaPage {

  selectedItem: Page;

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
  ) {
    // If we navigated to this page, we will have an item available as a nav param
    this.selectedItem = navParams.get('item');
  }


  itemTapped(item) {

  }

  variableChange(item: Variable) {
      console.log("Variable change "+item);
  }
  navigate(page: Page) {
    console.log("Navigate page", page);
    this.navCtrl.push(ScadaPage, { item: page });
  }
  ionViewDidLoad() {

  }
}
