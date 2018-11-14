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
  cartItems: any;
  adjustedPrice: any;
  emptyCart: boolean = true;
  totalPrice:any = 0;
  cartCount: number = 0;
  itemQuantity: any;


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

          values.forEach(eachObj => {
            if(eachObj){
              this.cartCount = +this.cartCount + +eachObj['quanitity'];
              this.totalPrice = +this.totalPrice + +eachObj['amount'] + ".00";
            }
          });

          console.log(this.totalPrice)
        }
      });

  }

  closeCart(){
    this.viewCtrl.dismiss();
  }

  confirmPayment(){
    this.paymentMode = true;
    this.totalPrice = +this.totalPrice + +5 + ".00";
  }

  placeOrder(){
    this.viewCtrl.dismiss();
  }

  itemCardDown(cartItem){
    if(this.cartItems.amount == 1){}else{
      var newPrice = this.adjustedPrice - this.cartItems.price;
      this.adjustedPrice = newPrice + '.00';
    }

    this.itemQuantity = this.fireStore.doc<any>('users/' + this.afAuth.auth.currentUser.uid + '/cart/' + cartItem.item);
    console.log(this.itemQuantity.quanitity)
    // this.ItemQuantity.update(this.adjustedPrice)
  }

  itemCardUp(cartItem){
    var newPrice = +this.adjustedPrice + +this.cartItems.price;
    this.adjustedPrice = newPrice + '.00';
  }


}
