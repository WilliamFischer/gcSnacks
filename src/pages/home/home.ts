import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  menuValue: number = 0;

  constructor(public navCtrl: NavController) {

  }

  menuNumber(key){
    this.menuValue = key;
  }

}
