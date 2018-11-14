import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ViewController } from 'ionic-angular';

import { AngularFirestore,AngularFirestoreCollection } from 'angularfire2/firestore';
import { AngularFireAuth } from '@angular/fire/auth';

@IonicPage()
@Component({
  selector: 'page-cart',
  templateUrl: 'cart.html',
})
export class CartPage {
  paymentMode: boolean;
  cartItems: any[];
  adjustedPrice: any;
  emptyCart: boolean = true;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl : ViewController,private fireStore: AngularFirestore, public afAuth: AngularFireAuth ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CartPage');

    this.fireStore.collection('users/' + this.afAuth.auth.currentUser.uid + '/cart').valueChanges().subscribe(
      values =>{
        if(values){
          this.cartItems = values;
          if(this.cartItems.length > 0){
            this.emptyCart = false;
          }
        }
      });

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

  itemCardDown(){

  }

  itemCardUp(){

  }

  itemCountUp(){
    var newPrice = +this.adjustedPrice + +this.cartItems.price;
    this.adjustedPrice = newPrice + '.00';
  }

  itemCountDown(){
    if(this.cartItems.amount == 1){}else{
      var newPrice = this.adjustedPrice - this.cartItems.price;
      this.adjustedPrice = newPrice + '.00';
    }
  }
}
