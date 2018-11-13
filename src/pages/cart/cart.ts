import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ViewController } from 'ionic-angular';
/**
 * Generated class for the CartPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-cart',
  templateUrl: 'cart.html',
})
export class CartPage {
  paymentMode: boolean;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl : ViewController ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CartPage');
  }

  closeCart(){
    this.viewCtrl.dismiss();
  }

  confirmPayment(){
    this.paymentMode = true;
  }

  placeOrder(){
    this.viewCtrl.dismiss();
  }
}
