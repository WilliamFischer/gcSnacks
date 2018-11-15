import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ViewController } from 'ionic-angular';
import { PayPal, PayPalPayment, PayPalConfiguration } from '@ionic-native/paypal';

import { AngularFirestore,AngularFirestoreCollection } from 'angularfire2/firestore';
import { AngularFireAuth } from '@angular/fire/auth';

@IonicPage()
@Component({
  selector: 'page-cart',
  templateUrl: 'cart.html',
})
export class CartPage {
  cartItems: any;
  adjustedPrice: any;
  emptyCart: boolean = false;
  totalPrice:any = 0;
  cartCount: number = 0;
  itemQuantity: any;
  cartLoading:boolean  = true;


  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl : ViewController,private fireStore: AngularFirestore, public afAuth: AngularFireAuth,private payPal: PayPal ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CartPage');

    this.fireStore.collection('users/' + this.afAuth.auth.currentUser.uid + '/cart').valueChanges().subscribe(
      values =>{
        if(values){

          this.cartItems = values;

          values.forEach(eachObj => {
            if(eachObj){
              this.cartCount = +this.cartCount + +eachObj['quanitity'];
              this.totalPrice = +this.totalPrice + +eachObj['amount'];
            }
          });

          if(this.totalPrice == 0){
            this.cartLoading  = false;
            this.emptyCart = true;
          }else{
            this.cartLoading  = false;
          }
        }
      });

  }

  closeCart(){
    this.viewCtrl.dismiss();
  }

  // itemCardDown(cartItem){
  //   if(this.cartItems.amount == 1){}else{
  //     var newPrice = this.adjustedPrice - this.cartItems.price;
  //     this.adjustedPrice = newPrice + '.00';
  //   }
  //
  //   this.itemQuantity = this.fireStore.doc<any>('users/' + this.afAuth.auth.currentUser.uid + '/cart/' + cartItem.item);
  //   console.log(this.itemQuantity.quanitity)
  //   // this.ItemQuantity.update(this.adjustedPrice)
  // }
  //
  // itemCardUp(cartItem){
  //   var newPrice = +this.adjustedPrice + +this.cartItems.price;
  //   this.adjustedPrice = newPrice + '.00';
  // }


  placeOrder(){

    if(this.totalPrice != 0){
      this.cartLoading  = false;
      this.emptyCart = false;

      this.payPal.init({
        PayPalEnvironmentProduction: 'AR7AHIWIta7z7My5KPOOhkVSFOwVkqdJkrdqoOoTSu68Lvvk2nHn9W9ieE0Odz1jUxrFLF_DccykOGL4',
        PayPalEnvironmentSandbox: 'AQ0uWcu6H4jcvb1MYNt3t3dbhIklQ5luDk_9A3pQtRa6RI1KN7cvkHrT2enUeii2zhjuiO6gV0B46_ad'
        }).then(() => {
        this.payPal.prepareToRender('PayPalEnvironmentProduction', new PayPalConfiguration({
        })).then(() => {
          let paymentAmount = this.totalPrice + +5 + '.00';
          let payment = new PayPalPayment(paymentAmount, 'AUD', 'Munch Order + $5 Delivery Fee', 'sale');
          this.payPal.renderSinglePaymentUI(payment).then(() => {
            alert("Succefully Paid")
            this.viewCtrl.dismiss();
          }, (err) => {
            console.log("Error " + err)
          });
        }, (err) => {
          console.log("Config Error " + err)
        });
        }, (err) => {
          console.log("Setup Error " + err)
        });
    }else{
      alert('Your cart is empty')
    }
  }

}
