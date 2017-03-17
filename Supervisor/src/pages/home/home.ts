import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Variable, VariableType } from '../../entities/variable';

let variableTypes = VariableType;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
 
  selectedItem: any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    // If we navigated to this page, we will have an item available as a nav param
    this.selectedItem = navParams.get('item');
  }

  itemTapped(item) {

  }

  ionViewDidLoad() {

  }
}
