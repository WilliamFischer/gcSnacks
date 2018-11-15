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
  paymentMode: boolean;
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
              this.totalPrice = +this.totalPrice + +eachObj['amount'] + ".00";
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

  confirmPayment(){
    if(this.totalPrice != 0){
      this.cartLoading  = false;
      this.emptyCart = false;

      this.paymentMode = true;
      this.totalPrice = +this.totalPrice + +5 + ".00";
    }else{
      alert('Your cart is empty')
    }
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


  placeOrder(){
    this.payPal.init({
      PayPalEnvironmentProduction: 'AR7AHIWIta7z7My5KPOOhkVSFOwVkqdJkrdqoOoTSu68Lvvk2nHn9W9ieE0Odz1jUxrFLF_DccykOGL4',
      PayPalEnvironmentSandbox: 'AQ0uWcu6H4jcvb1MYNt3t3dbhIklQ5luDk_9A3pQtRa6RI1KN7cvkHrT2enUeii2zhjuiO6gV0B46_ad'
      }).then(() => {
      // Environments: PayPalEnvironmentNoNetwork, PayPalEnvironmentSandbox, PayPalEnvironmentProduction
      this.payPal.prepareToRender('PayPalEnvironmentSandbox', new PayPalConfiguration({
        // Only needed if you get an "Internal Service Error" after PayPal login!
        //payPalShippingAddressOption: 2 // PayPalShippingAddressOptionPayPal
      })).then(() => {
        let payment = new PayPalPayment('3.33', 'AUD', 'Description', 'sale');
        this.payPal.renderSinglePaymentUI(payment).then(() => {
          console.log("Succefully Paid")
          this.viewCtrl.dismiss();
        }, (err) => {
          // Error or render dialog closed without being successful
            console.log("Error " + err)
        });
      }, (err) => {
        console.log("Config Error " + err)
        // Error in configuration
      });
      }, (err) => {
        console.log("Setup Error " + err)
      // Error in initialization, maybe PayPal isn't supported or something else
      });
  }

}
