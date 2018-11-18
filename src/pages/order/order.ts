import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the OrderPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-order',
  templateUrl: 'order.html',
})
export class OrderPage {
  userAddress: string;
  arrivalTime: any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.userAddress = localStorage.getItem('address')

    var d1 = new Date();
    var newDateObj = new Date();
    newDateObj.setTime(d1.getTime() + (30 * 60 * 1000));
    let hours = newDateObj.getHours();
    let minutes = newDateObj.getMinutes();

    this.arrivalTime = hours + ':' + minutes;
    var H = +this.arrivalTime.substr(0, 2);
    var h = H % 12 || 12;
    var ampm = (H < 12 || H === 24) ? "AM" : "PM";
    this.arrivalTime = h + this.arrivalTime.substr(2, 3) + ampm;

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OrderPage');
  }

}
