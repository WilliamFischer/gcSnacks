import { Component } from '@angular/core';
import { IonicPage, ViewController, NavController, NavParams,ModalController } from 'ionic-angular';
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
  userAddress: string;
  deliverLocation: any;


  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl : ViewController,
    private fireStore: AngularFirestore,
    public afAuth: AngularFireAuth,
    private payPal: PayPal,
    public modalCtrl: ModalController ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CartPage');

    this.fireStore.collection('users/' + this.afAuth.auth.currentUser.uid + '/cart').valueChanges().subscribe(
    values =>{
      if(values){
        this.cartItems = values;

        values.forEach(eachObj => {
          this.calculateTotal(eachObj['amount'], eachObj['quanitity']);
        });

        if(this.totalPrice == 0){
          this.cartLoading  = false;
          this.emptyCart = true;
        }else{
          this.cartLoading  = false;
        }
      }
    });


    this.userAddress = localStorage.getItem('address');
    console.log(this.userAddress);
  }

  closeCart(){
    this.viewCtrl.dismiss();
  }

  itemCardDown(cartItem){
    this.totalPrice = 0;
    this.cartCount = 0;

    var newAmount = cartItem.amount - cartItem.price;
    var newQuantity = cartItem.quanitity - 1;
    var cartSource = this.fireStore.doc<any>('users/' + this.afAuth.auth.currentUser.uid + '/cart/' + cartItem.item);

    cartSource.update({amount:newAmount, quanitity:newQuantity});

    if(newQuantity == 0){
      cartSource.delete();
    }
  }

  itemCardUp(cartItem){
    this.totalPrice = 0;
    this.cartCount = 0;

    var newAmount = +cartItem.amount + +cartItem.price;
    var newQuantity = +cartItem.quanitity + 1;
    var cartSource = this.fireStore.doc<any>('users/' + this.afAuth.auth.currentUser.uid + '/cart/' + cartItem.item);

    cartSource.update({amount:newAmount, quanitity:newQuantity});
  }

  calculateTotal(amount, quanitity){
      if(amount && quanitity){
        this.cartCount = +this.cartCount + +quanitity;
        this.totalPrice = +this.totalPrice + +amount;
        console.log("Cart now " + quanitity + " items full and " + amount)
      }
  }


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

            var today = new Date();
            let hours = today.getHours();
            let minutes = today.getMinutes();
            let seconds = today.getSeconds();
            let milliseconds = today.getMilliseconds();
            var finalTime = hours + ":" + minutes + ":" + seconds + ":" + milliseconds;

            this.deliverLocation = this.fireStore.doc<any>('deliveries/' + finalTime);
            this.deliverLocation.set({
              totalCost: this.totalPrice + +5 + '.00',
              approved: false,
              time: finalTime
            })

            var cartSource = this.fireStore.collection<any>('users/' + this.afAuth.auth.currentUser.uid + '/cart').valueChanges().subscribe(
            values =>{
              values.forEach(eachObj => {
                console.log(eachObj)
                var deliverLocation = this.fireStore.doc<any>('deliveries/' + finalTime + '/cart/' + eachObj.item);
                deliverLocation.set({
                  cart: {
                    item: eachObj.item,
                    price: eachObj.price,
                    imgurl: eachObj.img
                  }
                })

              });
            })

            var modalPage = this.modalCtrl.create('OrderPage');
            modalPage.present();

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
